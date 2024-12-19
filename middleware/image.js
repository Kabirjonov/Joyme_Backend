const multer = require('multer');
const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '..');
const publicDir = path.join(rootDir, 'public');
const uploadsDir = path.join(publicDir, 'uploads');

// Create folder function
function createNeedFolder(folderPath) {
    if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
        console.log(`Folder created: ${folderPath}`);
    }
}

// Ensure directories exist
createNeedFolder(publicDir);   
createNeedFolder(uploadsDir);

// Multer storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// File filter function
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// Configure Multer instances
const uploadSingle = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single('file');

const uploadMultiple = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).array('files', 5);

module.exports = {
    uploadSingle,
    uploadMultiple
};
