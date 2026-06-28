const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadPath;
    if (file.fieldname === 'profilepic') {
      uploadPath = path.join(__dirname, '../public/profile_pics');
    } else {
      uploadPath = path.join(__dirname, '../public/movies');
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

router.post('/video', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({ message: 'File uploaded successfully', filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading file', error });
  }
});

router.post('/profilepic', upload.single('file'), (req, res) => {
  try {
    res.status(200).json({ message: 'Profile picture uploaded successfully', filename: req.file.filename });
  } catch (error) {
    res.status(500).json({ message: 'Error uploading profile picture', error });
  }
});

module.exports = router;