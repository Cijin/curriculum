//TODO:
//check if /api/meme works as intended
//figure out a way to load all images on render
//front-end ask for images every few seconds as they update
//  also figure out how to add images to the front end as they are sent
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const gm = require('gm');
const { nextTick } = require('process');

const app = express();
const userTokens = {};
const secretKey = "Super Secret Key"

app.use(morgan('dev'));
app.use(bodyParser.json());

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

app.post('/api/meme', session, (req, res) => {
  const imageData = Buffer.from(req.body.b64Data, 'base64');
  if (!imageData) {
    return res.sendStatus(400);
  }
  
  gm(imageData).fontSize(70).stroke('#ffffff')
    .drawText(0, 200, req.body.text)
    .write(path.resolve(__dirname, `chatImages/${req.user} + .png`));

  return res.sendStatus(200);
});

app.get('/api/session', session, (req, res) => {  
  return res.status(200).json(req.token);
});

app.post('/api/session', (req, res) => {  
  const username = req.body.username;
  if (!username) {
    return res.status(400).send("Username cannot be empty!");
  }
  if (userTokens[username]) {
    return res.status(200).json({
      username: username,
      jwt: userTokens[username].jwt
    });
  }
  const token = jwt.sign({username}, secretKey);
  return res.status(200).json({
    username: username,
    jwt: token
  });
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});