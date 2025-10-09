import multer from 'multer';

// Configure multer to store files in memory (as buffer)
const storage = multer.memoryStorage();

// File filter to accept only images
const imageFileFilter = (req, file, cb) => {
    // Accept only image files
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'), false);
    }
};

// File filter to accept only PDFs
const pdfFileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF files are allowed!'), false);
    }
};

// Multer middleware for profile pictures
export const uploadProfilePicture = multer({
    storage: storage,
    fileFilter: imageFileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Multer middleware for PDF uploads
export const uploadPDF = multer({
    storage: storage,
    fileFilter: pdfFileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
    }
});