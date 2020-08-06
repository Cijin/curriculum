//Use this link to authenticate your apps https://authdomain.freedomains.dev/
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
let usersInfo = {};
const secretKey = "Very Secret Key!";
const saltRounds = 10;


fs.readFile(path.resolve(__dirname, "userData"), (err, data) => {
  if (err) {
    console.log("Error reading file");
  }
  if (data) {
    usersInfo = JSON.parse(data.toString());
  }
});

const writeToFile = () => {
  fs.writeFile(path.resolve(__dirname, "userData"),
    JSON.stringify(usersInfo),
    () => {});
};

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cors({
  origin: 'https://js5p5.freedomains.dev'
}));

app.get('/', (req, res) => {
  res.send("Working Auth Url");
});

app.get('/api/sessions', (req, res) => {
  if (!req.get('authorization')) {
    return res.status(403).send("Missing Authorization Header");
  }
  const token = req.get('authorization').split(" ")[1];
  const decoded = jwt.decode(token);

  if (!decoded) {
    return res.sendStatus(403);
  }
  return res.status(200).json(decoded);
});

app.post('/api/sessions', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;  

  if (!usersInfo[username]) {
    return res.status(400).send("Please enter a valid username");
  }

  if (!password || !username) {
    return res.status(400).send("Please enter both username and password");
  }
  
  bcrypt.compare(password, usersInfo[username].password, (error, result) => {
    if (error) {
      console.log(error);
      return;
    }
    if (!result) {
      return res.sendStatus(403);
    }
    let user = usersInfo[username];
    user.token = jwt.sign({
      id: user.id,
      username: username
    }, secretKey);
    usersInfo[username] = user;
    writeToFile();
    delete user.password;
    return res.status(200).json(user);
  });
});

app.post('/api/users', (req, res) => {
  const body = req.body;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const id = uuidv4();

  if(!email.match(/^\S+@\S+$/)) {
    return res.status(400).send("Please enter a valid email!");
  }
  if(usersInfo[username] || !username) {
    return res.status(400).send("Please try another username");
  }

  //finding length of original string from base64
  if((3 * Math.ceil(password.length / 4) - (password.match(/=/g) || [])).length < 5) {
    return res.status(400).send("Password should contain at least 5 characters");
  }

  bcrypt.hash(password, saltRounds)
    .then((hash) => {
      body.password = hash;
      body.token = jwt.sign({id, username}, secretKey);
      let user = Object.entries(body).reduce((acc, [key, value]) => {
        acc[key] = value;
        return acc;
      }, {});
      usersInfo[username] = user;
      writeToFile();
      //deleting password before sending user info
      delete user.password;
      return res.status(200).json(user);
    }).catch((error) => {
      console.log('The following error was thrown: ', error);
    });
});

app.listen(process.env.PORT || 8123, () => {
  console.log('App listening on Port: 8123');
});
