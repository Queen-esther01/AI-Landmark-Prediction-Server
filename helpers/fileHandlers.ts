const fs = require('fs');
const paths = require('path'); 

const convertToBlob = (filePath: string, mimeType: string) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err: any, data: { buffer: unknown; }) => {
            if (err) {
                return reject(err);
            }
            resolve(data.buffer);
        });
    });
};


const deleteFile = () => {
    return new Promise((resolve, reject) => {
        fs.readdir('uploads/', (err: unknown, files: any[]) => {
            if (err) return reject(err);
    
            const deletePromises = files.map(file => {
                return new Promise<void>((resolve, reject) => {
                    fs.unlink(paths.join('uploads/', file), (err: unknown) => {
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