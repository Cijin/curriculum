// *** Visit js5solutions.freedomains.dev for solution
const Jimp = require('jimp');
const express = require('express');
const app = express();
let prevImages = {};
let count = 0;

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send("Enter image url and message in the url to begin");
});

app.get('/imggen/api/:message', (req, res) => {
  //check if image loaded before
  if (prevImages[req.url]) {
    res.set('Content-Type', 'image/jpeg');
    return res.send(prevImages[req.url].buffer);
  }
  let memeText = req.params.message;
  let blur = +req.query.blur || 0;
  let src = req.query.src || "https://placeimg.com/640/480/any";
  let fontStyle = (req.query.black) ? 'FONT_SANS_32_BLACK' : 'FONT_SANS_32_WHITE'; 

  if (!memeText) {
    return res.status(400).send("Please enter a message");
  }

  Jimp.read(src)
    .then((image) => {      
      Jimp.loadFont(Jimp[fontStyle])
        .then((font) => {
          if (blur) {
            image.blur(blur);
          }          
          image.print(font, 10, 10, memeText);
          image.getBufferAsync(Jimp.MIME_JPEG)
            .then((buffer) => {
              prevImages[req.url] = {};
              prevImages[req.url].buffer = buffer;
              prevImages[req.url].count = (count + 1) % 10;
              res.set('Content-Type', 'image/jpeg');
              return res.send(buffer);
            });
        });
    });
});

app.listen(process.env.PORT || 8123);