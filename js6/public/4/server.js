const express = require('express');
const app = express();
const path = require('path');
const morgan = require('morgan');

app.use(morgan('dev'));
app.use(express.static(path.resolve(__dirname, 'dist')));

app.get('/*', (req, res) => {
  return res.sendFile(path.resolve(__dirname, 'index.html'));
});

app.listen({port:8123}, () => {
  console.log('Server running on Port: 8123');
});