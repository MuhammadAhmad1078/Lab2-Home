import multer from 'multer';
import path from 'path';

// File filter
const fileFilter = (req: any, file: any, cb: any) => {
  const allowedTypes = /pdf|jpg|jpeg|png/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Only PDF, JPG, JPEG and PNG files are allowed!'));
  }
};

// Memory storage for both Reports and Phlebotomist signup
const memoryStorage = multer.memoryStorage();

export const uploadReport = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});

export const upload = multer({
  storage: memoryStorage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: fileFilter
});
