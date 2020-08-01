const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.get('/api/session', (req, res) => {
  //TODO: decode jwt token to return a json body with username
});

app.post('/api/session', (req, res) => {
  //TODO: create a new jwt token for the current user
  //or return an existing one if one exists  
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});