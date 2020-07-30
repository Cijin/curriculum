const express = require('express');
const path = require('path');
const { createWorker } = require('tesseract.js');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const multer = require('multer');
const upload = multer({ dest: './uploads/' });

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.post('/files', upload.array('userFiles'), (req, res) => {  
  console.log(req.file);
  res.sendStatus(200);
});


app.listen(process.env.PORT || 8123, () => {
  console.log('Server Listening on Port: 8123');
});
