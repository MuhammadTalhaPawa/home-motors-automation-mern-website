const express = require('express')

const app = express();
port = 8000;

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/insert/:myData', (req, res) => {
  console.log(req.params.myData);
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
