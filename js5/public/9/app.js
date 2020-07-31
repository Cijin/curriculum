const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();

app.use(morgan('dev'));
app.use(bodyParser.json());

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});