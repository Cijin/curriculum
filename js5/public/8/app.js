const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const PORT = process.env.PORT || 8123;
let imgObj = {};

const writeImage = (imgFile) => {
  fs.writeFile(path.resolve(__dirname, 'images'), imgFile, 'base64', () =>{});
};

app.use(bodyParser.json({ limit: "5mb", extended:true }));
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/api/image/:imageId', (req, res) => {
  let imageId = req.params.imageId;
  if (imgObj[imageId]) {
    let img = Buffer.from(imgObj[imageId], 'base64');
    res.writeHead(200, {
    'Content-Type': 'image/png',
    'Content-Length': img.length
  });
    return res.end(img);    
  }
  return res.sendStatus(404);
});

app.post('/api/images', (req, res) => {
  const imgData = req.body.img;
  if (!imgData) {
    res.sendStatus(400);
  }
  const id = uuidv4() + '.png';
  imgObj[id] = imgData;
  let link = `http://${req.hostname}:${PORT}/api/image/${id}`;

  return res.status(200).json({link});
});

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});