import multer from 'multer';

// Configure multer to store files in memory (Buffer)
// Files will be stored in MongoDB, not on disk
const storage = multer.memoryStorage();

// File filter - only allow images and PDFs
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, and PDF files are allowed.'));
  }
};

// Multer configuration - stores in memory for MongoDB storage
export const upload = multer({
  storage: storage, // Memory storage - file will be in req.file.buffer
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB max
  },
  fileFilter: fileFilter,
});

