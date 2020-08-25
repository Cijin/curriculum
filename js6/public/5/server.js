const express = require('express');
const app = express();
const morgan = require('morgan');

app.use(morgan('dev'));

app.get('/images', (req, res) => {
  console.log('Request Recieved');
  return res.send('Request Recieved');
});

app.listen({ port: 8123 }, () => {
  console.log('Server listening on Port: 8123');
});
