//visit https://js5solutions.freedomains.dev/ for solution

const express = require('express');
const path = require('path');
const fs = require('fs');
const Tesseract = require('tesseract.js');
const app = express();
const morgan = require('morgan');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');

const upload = multer({ dest: path.resolve(__dirname, 'uploads') });
const job = {};

const removeOldFiles = () => {
  const directory = path.resolve(__dirname, 'uploads');
  fs.readdir(directory, (err, files) => {
  setTimeout(() => {  
      if (err) {
        console.log("Error: ", err);
      }

      Array.from(files).forEach((file) => {
        fs.unlink(path.resolve(directory, file), (err) => {
          if (err) {
            console.log("File deletion error: ", err);
          }          
        });
      });
    })
  }, 5 * 60 * 1000);
};

//delete old files every five minutes
removeOldFiles();

app.use(morgan('dev'));

app.get('/', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.post('/files', upload.single('userFiles'), (req, res) => {
  const id = uuidv4();
  job[id] = {};
  job[id].src = req.file.path;
  Tesseract.recognize(req.file.path, 'eng')
    .then(({ data: { text }}) => {
      job[id].text = text;
      return res.redirect(`/files/${id}`);
    });
  return res.status(202)
});

app.get('/files/:jobId', (req, res) => {
  if (!job[req.params.jobId]) {
    return res.status(404).send("No text extracted");
  }
  const html = `<h1>Extracted Text:</h1><br><h2 style="padding-top:10px;">
    ${job[req.params.jobId].text}</h2>`

  return res.status(200).send(html);
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server Listening on Port: 8123');
});
