import multer from 'multer';
import path from 'path';

// Set storage engine for multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/'); // You can customize this directory path
    },
    filename: function (req, file, cb) {
        cb(null, `${Date.now()}_${path.extname(file.originalname)}`);
    }
});

// Initialize upload instance with storage settings and file type filter
export const upload = multer({
    storage: storage,
    limits: { fileSize: 1000000 }, // Limit the file size to 1MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Images only!'));
        }
    }
});
