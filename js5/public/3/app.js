const path = require('path');
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.listen(process.env.PORT || 8123);