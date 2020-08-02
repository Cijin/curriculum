const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');

const app = express();
const userTokens = {};
const secretKey = "Super Secret Shh..."

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/api/session', (req, res) => {
  if (!req.get('authorization')) {
    return res.status(403).send("Missing Token, Please Login :)");
  }
  const token = req.get('authorization').split(" ")[1];
  const body = jwt.decode(token);
  if (!body) {
    return res.sendStatus(403);
  }
  return res.status(200).json(body);
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