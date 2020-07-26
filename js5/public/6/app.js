const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');

const app = express();
const usersInfo = {};
const secretKey = process.env.TOKEN_SECRET;
const saltRounds = 10;

fs.readFile(path.resolve(__dirname, "userData"), (err, data) => {
  if (err) {
    console.log("Error reading file");
  }
  if (data) {
    usersInfo = JSON.parse(data.toString());
  }
});

const writeFile = () => {
  fs.writeFile(path.resolve(__dirname, "userData"),
    JSON.stringify(usersInfo),
    () => {});
};

app.use(morgan('dev'));
app.use(bodyParser.json());

const session = (req, res) => {
  if (!req.get('authorization')) {
    return res.status(403).send("Missing Authorization Header");
  }
  const token = req.get('authorization').split(" ")[1];
  jwt.verify(token, secretKey, (err, data) => {
    if (err) {
      return res.sendStatus(403);
    }
    return res.status(200).json({data});
  });
};

const logIn = (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(400).send("Missing username or password");
  }
  const user = { username, password };

  jwt.sign({user}, secretKey, (err, token) => {
    res.status(200).json({token});
  });
};

const signUp = (req, res) => {

};

const logOut = () => {

};

module.exports = {
  signUp,
  logIn,
  session,
  logOut
};
