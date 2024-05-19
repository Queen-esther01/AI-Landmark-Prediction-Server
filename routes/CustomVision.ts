import express, { Request, Response } from 'express'
import { File } from '../types/types';


const msRest = require("@azure/ms-rest-js");
const util = require('util');
const fs = require('fs');
const path = require('path'); 
const router = express.Router()
// const uploads = require('../middlewares/uploads')
const multer = require('multer');
multer({ dest: 'uploads/' })
const uploads = require('../middlewares/uploads')
const {convertToBlob, deleteFile } = require('../helpers/fileHandlers')

const TrainingApi = require("@azure/cognitiveservices-customvision-training");
const PredictionApi = require("@azure/cognitiveservices-customvision-prediction");

const trainingKey = process.env["VISION_TRAINING_KEY"];
const trainingEndpoint = process.env["VISION_TRAINING_ENDPOINT"];
const predictionKey = process.env["VISION_PREDICTION_KEY"];
const predictionResourceId = process.env["VISION_PREDICTION_RESOURCE_ID"];
const predictionEndpoint = process.env["VISION_PREDICTION_ENDPOINT"];

const publishIterationName = "classifyModel";
const setTimeoutPromise = util.promisify(setTimeout);

const credentials = new msRest.ApiKeyCredentials({ inHeader: { "Training-key": trainingKey } });
const trainer = new TrainingApi.TrainingAPIClient(credentials, trainingEndpoint);
const predictor_credentials = new msRest.ApiKeyCredentials({ inHeader: { "Prediction-key": predictionKey } });
const predictor = new PredictionApi.PredictionAPIClient(predictor_credentials, predictionEndpoint);


router.post('/add-image', uploads.array('EiffelTower', 10), async(req:any, res:Response) => {
    // Access the file object
    //const files = req.files;

    const imagesPath = path.join(__dirname, '../uploads'); // Directory where your images are stored
    const files = fs.readdirSync(imagesPath);

    let fileUploadPromises: any[] = [];
    files.forEach((file: string) => {
        fileUploadPromises.push(trainer.createImagesFromData(process.env.PROJECT_ID, fs.readFileSync(`${imagesPath}\\${file}`), { tagIds: [req.body.tagId]}))
    })

    try {
        const createImage = await Promise.all(fileUploadPromises)
        await deleteFile();
        return res.status(200).send(createImage);
    } catch (error) {
        await deleteFile();
        return res.status(400).send(error);
    }
})

router.post('/train-model', async(req:any, res:Response) => {
    console.log("Training...");
    let trainingIteration = await trainer.trainProject(process.env.PROJECT_ID);

    // Wait for training to complete
    console.log("Training started...");
    while (trainingIteration.status == "Training") {
        console.log("Training status: " + trainingIteration.status);
        await setTimeoutPromise(1000, null);
        trainingIteration = await trainer.getIteration(process.env.PROJECT_ID, trainingIteration.id)
    }
    console.log("Training status: " + trainingIteration.status);
})

router.get('/get-iterations', async(req:any, res:Response) => {
    try {
        const iterations = await trainer.getIterations(process.env.PROJECT_ID)
        return res.status(200).send(iterations);
    } catch (error) {
        return res.status(400).send(error);
    }
})

router.post('/publish-iteration',  async(req:any, res:Response) => {
    try {
        const iterations = await trainer.getIterations(process.env.PROJECT_ID)
        if(iterations.length === 0){
            return res.status(204).send({
                status: 204,
                message: 'There are no iterations to publish'
            });
        }
        const published = await trainer.publishIteration(process.env.PROJECT_ID, iterations[0].id, iterations[0].publishName, predictionResourceId);
        return res.status(200).send(published);
    } catch (error) {
        return res.status(200).send(error);
    }
})


router.post('/prediction', uploads.single('Image'), async(req:any, res:Response) => {
    try {
        const iterations = await trainer.getIterations(process.env.PROJECT_ID)
        if(iterations.length === 0){
            return res.status(204).send({
                status: 204,
                message: 'There are no iterations to publish'
            });
        }

        const imagesPath = path.join(__dirname, '../uploads');
        const file = fs.readdirSync(imagesPath)[0];
 
        const readyFile = fs.readFileSync(`${imagesPath}\\${file}`)

        const results = await predictor.classifyImage(process.env.PROJECT_ID, iterations[0].publishName, readyFile);

        // Show results
        console.log("Results:");
        results.predictions.forEach((predictedResult: { tagName: string; probability: number; }) => {
            console.log(`\t ${predictedResult.tagName}: ${(predictedResult.probability * 100.0).toFixed(2)}%`);
        });
        await deleteFile();
        return res.status(200).send(results);
    } catch (error) {
        await deleteFile();
        return res.status(200).send(error);
    }
})

router.get('/get-tags', async(req:Request, res:Response) => {
    const tags = await trainer.getTags(process.env.PROJECT_ID)
    return res.status(200).send(tags);
})

module.exports = router