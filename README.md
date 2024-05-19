## Running Project
- add .env file with the following configs
  - VISION_TRAINING_KEY = XXXXXXXXXXX
  - VISION_TRAINING_ENDPOINT = XXXXXXXXXXX
  - VISION_PREDICTION_KEY = XXXXXXXXXXX
  - VISION_PREDICTION_ENDPOINT = XXXXXXXXXXX
  - PROJECT_ID = XXXXXXXXXXX
  - VISION_PREDICTION_RESOURCE_ID = XXXXXXXXXXX
- npm install && npm start
  - to watch for file changes, change start script in package.json from **node index.js** to **nodemon index.js**

## API
https://customvisionappserver.azurewebsites.net/api/v1
To confirm server is up and running, paste api in browser, you should get a hello world in return

## Endpoints
- /add-image
- /train-model
- /get-iterations
- /publish-iteration
- /prediction
- /get-tags
