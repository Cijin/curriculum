//TODO:
//figure out a way to load all images on render
//front-end ask for images every few seconds as they update
//  also figure out how to add images to the front end as they are sent
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const gm = require('gm').subClass({ imageMagick: true });

const app = express();
const userData = {};
const secretKey = "Super Secret Key"

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(express.static('9'));

const session = (req, res, next) => {
  if (!req.get('authorization')) {
    return res.status(403).send("Missing Token, Please Login :)");
  }
  const token = req.get('authorization').split(" ")[1];
  const body = jwt.decode(token);
  if (!body) {
    return res.sendStatus(403);
  }
  req.user = body.username;
  req.token = body;
  next();
}

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/api/session', session, (req, res) => {  
  return res.status(200).json(req.token);
});

app.get('/api/images', session, (req, res) => {
  return res.status(200).json(userData);
});

app.post('/api/meme', session, (req, res) => {
  const imageData = Buffer.from(req.body.b64Data, 'base64');
  const filename = req.user + '.png';  
  const username = req.user;

  if (!imageData || !req.body.text) {
    return res.sendStatus(400);
  }
  gm(imageData).fontSize(20).stroke('#ffffff')
    .drawText(50, 50, req.body.text)
    .write(path.resolve(__dirname, `chatImages/${filename}`), (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);       
      }
    });
    if (!userData[username])
      userData[username] = {};
    userData[username].imageSrc = `/chatImages/${filename}`;
  return res.sendStatus(201);
});

app.post('/api/session', (req, res) => {  
  const username = req.body.username;
  if (!username) {
    return res.status(400).send("Username cannot be empty!");
  }
  if (userData[username]) {
    return res.status(200).json({
      username: username,
      jwt: userData[username].jwt
    });
  }
  const token = jwt.sign({username}, secretKey);
  userData[username].jwt = token;
  return res.status(200).json({
    username: username,
    jwt: token
  });
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});