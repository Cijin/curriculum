const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

let files = {};

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/files', (req, res) => {
  fs.readFile(path.resolve(__dirname, "./fileInfo"), (err, data) => {
    if (err) {
      console.log("File read error");
      return res.sendStatus(500);
    }
    // if (data) {
    //   return res.json([data]);
    // }
  })
});

app.get('/api/files/:filname', (req, res) => {
  res.json(files[req.params.filename].content);
});

app.post('/api/files', (req, res) => {
  const name = req.body.name;
  const content = req.body.content;
  if (!name || !content) {
    res.sendStatus(400);
  }
  files[name] = name;
  files[name].content = content;
  files[name].created = Date.now();
  fs.writeFile(
    path.resolve(__dirname, "./fileInfo"),
    JSON.stringify(files), () => {}
  );
  res.sendStatus(201);
});




app.listen(process.env.PORT || 8123);
