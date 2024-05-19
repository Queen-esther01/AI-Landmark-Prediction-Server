const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function (req: any, file: any, cb: (arg0: null, arg1: string) => void) {
        cb(null, 'uploads/'); // specify the destination directory
    },
    fieldname: function (req: any, file: { originalname: any; }, cb: (arg0: null, arg1: any) => void) {
        cb(null, Date.now() + path.extname(file.originalname)); // specify the filename
    }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

module.exports = upload