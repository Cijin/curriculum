const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

app.use(cors());

app.get('/*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'kanban.html'));
});

app.listen(process.env.PORT || 8123, () => {
  console.log('Server listening on Port: 8123');
});