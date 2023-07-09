require("dotenv").config();
 

const express = require('express')
const mongoose = require("mongoose");

const app = express();
port = 8000;

function getKeyValue(data) {
  var keyValue = data.split('=');
  jsonValue = {
    key : keyValue[0],
    value : keyValue[1]
  }
  return jsonValue
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/insert/:myData', (req, res) => {
  jsonKeyValue = getKeyValue(req.params.myData);
  console.log(jsonKeyValue)
  res.send('inserted');
});

app.get('/delete/:myData', (req, res) => {
  console.log(req.params.myData);
  res.send('deleted');
});

app.get('/update/:myData', (req, res) => {
  console.log(req.params.myData);
  res.send('updated');
});

app.listen(port, () =>
  console.log(`Example app listening on ${port} `),
);
