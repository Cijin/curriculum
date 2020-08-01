const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/api/session', (req, res) => {
  if (!req.get('authorization')) {
    return res.status(400).send("Missing Token, Please Login :)");
  }
  const token = req.get('authorization').split(" ")[1];
  const body = jwt.decode(token);
  if (!body) {
    return res.sendStatus(400);
  }
  return res.status(200).json(body);
});

app.post('/api/session', (req, res) => {
  //TODO: create a new jwt token for the current user
  //or return an existing one if one exists    
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});