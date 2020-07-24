const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const express = require('express');
const app = express();

app.use(bodyParser.json());
app.use(morgan('dev'));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/api/session', (req, res) => {
  fetch('https://js5.c0d3.com/auth/api/session')
    .then((res) => {
      return res.json()
    }).then((data) => {
      return res.json({data});
    })
});

app.get('/api/:roomName/messages', (req, res) => {

});

app.post('/api/:roomName/messages', (req, res) => {

});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});