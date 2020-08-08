/*
  visit https://js5solutions.freedomains.dev/ for solution

  Considering the size of the files, I thought it would be useful to have
  detailed documentation for the reviewer.There is an explanation just like 
  this one on top of the HTML file as well.

  Middleware Session: adds req.user and req.token to all incoming paths 
    as they are checked everytime a request is sent
    
  app.get('/api/images'): sends back current data on all users

  app.post('/api/meme'): Gets base64 data and text from user and
    combines them to file as username.png
    Also creates a imageSrc key for later use to send back to client
*/
const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const gm = require('gm').subClass({ imageMagick: true });

const app = express();
let userData = {};
const secretKey = "Super Secret Key"

fs.readFile(path.resolve(__dirname, "userInfo"), (err, data) => {
  if (err) {
    console.log("File Read Error: ", err);
  }
  if (data) {
    userData = JSON.parse(data.toString());
  }
});

app.use(morgan('dev'));
app.use(bodyParser.json({ limit: "5mb", extended: true }));
app.use(express.static(path.resolve(__dirname, 'chatImages')));

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
};

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
  gm(imageData).fontSize(40).stroke('#ffffff')
    .drawText(50, 50, req.body.text)
    .write(path.resolve(__dirname, `chatImages/${filename}`), (err) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);       
      }
    });
    if (!userData[username]) {
      userData[username] = {};
    }
    userData[username].imageSrc = `/${filename}`;

    fs.writeFile(path.resolve(__dirname, "userInfo"),
      JSON.stringify(userData),
      () => {});

    return res.sendStatus(201);
});

app.post('/api/session', (req, res) => {  
  const username = req.body.username;
  if (!username) {
    return res.status(400).send("Username cannot be empty!");
  }  
  userData[username] = {};
  const token = jwt.sign({username}, secretKey);  
  return res.status(200).json({
    username: username,
    jwt: token
  });
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});