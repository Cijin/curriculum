//visit https://js5solution2.freedomains.dev/ for solution demo
const path = require('path');
const { exec } = require('child_process');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.use(express.static('public'));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, "index.html"));
});

app.post('/commands', (req, res) => {  
  let command = req.body.process;
  exec(command, (error, stdout) => {
    if (error) {       
      return res.send({output: error});
    }    
    return res.json({output: stdout});
  });
});

app.listen(process.env.PORT || 8123);