const multer = require('multer');
const path = require('path');

// Set up storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // specify the destination directory
    },
    fieldname: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // specify the filename
    }
});

// Initialize multer with the storage engine
const upload = multer({ storage: storage });

module.exports = upload