//view solution here ==> https://js5p5.freedomains.dev/

const path = require('path');
const fetch = require('node-fetch');
const fs = require('fs');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();

let chatRooms = {};

fs.readFile(path.resolve(__dirname, "chatRooms"), (err, data) => {
  if(err) {
    console.log("Error Reading file")
  }
  if (data) {
    chatRooms = JSON.parse(data.toString());
  }
});

const writeToFile = () => {
  fs.writeFile(path.resolve(__dirname, "chatRooms"),
    JSON.stringify(chatRooms),
    () => {}
  );
}

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/:roomName?', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/api/session', (req, res) => {  
  //get jwt token, to see if user is already logged in
  let jwtToken = req.get('authorization').split(" ")[1];

  fetch('https://js5.c0d3.com/auth/api/session', {
    headers: {
    'Authorization': `Bearer ${jwtToken}`
    }
  }).then((response) => {
      return response.json()
    }).then((data) => {
      if (!data.username) {
        res.status = 403;
      }
      return res.json(data);
    });
});

app.get('/api/:roomName/messages', (req, res) => {
  let roomName = req.params.roomName;
  if (!chatRooms[roomName]) {
    chatRooms[roomName] = {};
    chatRooms[roomName].messages = [];
    writeToFile();    
  }  
  return res.status(200).json({ messages: chatRooms[roomName].messages });
});

app.post('/api/:roomName/messages', (req, res) => {
  const roomName = req.params.roomName;
  const message = req.body.message;
  if (!message) {
    return res.sendStatus(400);
  }
  chatRooms[roomName].messages.push(message);
  //update file
  writeToFile();
  return res.sendStatus(201);
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});