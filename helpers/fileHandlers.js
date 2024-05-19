const fs = require('fs');
const paths = require('path'); 

const convertToBlob = (filePath, mimeType) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                return reject(err);
            }
            resolve(data.buffer);
        });
    });
};


const deleteFile = () => {
    return new Promise((resolve, reject) => {
        fs.readdir('uploads/', (err, files) => {
            if (err) return reject(err);
    
            const deletePromises = files.map(file => {
                return new Promise((resolve, reject) => {
                    fs.unlink(paths.join('uploads/', file), (err) => {
                        if (err) return reject(err);
                        resolve();
                    });
                });
            });
    
            Promise.all(deletePromises)
            .then(resolve)
            .catch(reject);
        });
    });
};
module.exports = {
    convertToBlob, deleteFile
}