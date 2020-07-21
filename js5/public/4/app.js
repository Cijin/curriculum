const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
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
})

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/files', (req, res) => {
  res.json(Object.keys(files));
});

app.get('/api/file/:filname', (req, res) => {
  res.json(files[req.params.filename].content);
});

app.post('/api/files', (req, res) => {
  const name = req.body.name;
  const content = req.body.content;
  if (!name || !content) {
    return res.sendStatus(400);
  }
  files[name] = {};
  files[name].content = content;
  files[name].created = Date.now();
  fs.writeFile(
    path.resolve(__dirname, "./fileInfo"),
    JSON.stringify(files), () => {}
  );
  return res.sendStatus(201);
});

app.listen(process.env.PORT || 8123);
