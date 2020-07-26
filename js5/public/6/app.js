const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/api/sessions', (req, res) => {
  const jwtToken = req.get('authorization').split(" ")[1];
  if (!jwtToken) {
    return res.status(400).send("Missing Authorization header.");
  }
  jwt.decode(jwtToken)
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});