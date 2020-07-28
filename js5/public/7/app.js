const express = require('express');
const multer = require('multer');
const Tesseract = require('tesseract.js');
const app = express();




app.listen(process.env.PORT || 8123, () => {
  console.log('Server Listening on Port: 8123');
});
