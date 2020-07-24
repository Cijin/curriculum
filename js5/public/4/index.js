const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();

let files = {};

fs.readFile(path.resolve(__dirname, "./fileInfo"), (err, data) => {
  if (err) {
    console.log("File read error");
  }
  if (data) {
    files = JSON.parse(data);
  }
});

//delete files older than 5 minutes
const clearFiles = () => {
  Object.keys(files).map((key) => {
    if (Date.now() - files[key].created > (5 * 60 * 1000)) {
      delete files[key];
    }
  });
};

//middleware to see requests in console
app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/files', (req, res) => {  
  let returnObj = {};
  returnObj.filenames = Object.keys(files);    
  returnObj.current = files.current;
  return res.json(returnObj);
});

app.get('/api/file/:filename', (req, res) => {
  files.current = files[req.params.filename];
  return res.json(files.current);
});

app.post('/api/files', (req, res) => {
  const name = req.body.filename;
  const content = req.body.content;
  if (!name || !content) {
    return res.sendStatus(400);
  }
  files[name] = {};
  files[name].content = content;
  files[name].created = Date.now();
  files.current = content;
  fs.writeFile(
    path.resolve(__dirname, "./fileInfo"),
    JSON.stringify(files), () => {}
  );
  return res.sendStatus(201);
});

clearFiles();

app.listen(process.env.PORT || 8123);
