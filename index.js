require("dotenv").config();
 
const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())

port = 8000;

mongoose.connect(
  "mongodb://localhost:27017/HomeAutoDB",
  {
      useNewUrlParser: true,
      useUnifiedTopology: true
  }
);

const autoDataSchema = new mongoose.Schema({
  name: String,
  value: Number
});

const autoData = mongoose.model('autoData', autoDataSchema);

function getKeyValue(data) {
  var keyValue = data.split('=');
  jsonValue = {
    key : keyValue[0],
    value : parseInt(keyValue[1])
  }
  return jsonValue
}

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/insert/:myData', async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue)
  
  d = await autoData.findOne({name: jsonKeyValue.key})

  inserted = true
  if(d == null) {
    console.log("not found")
    await autoData.insertMany({
      name: jsonKeyValue.key,
      value: jsonKeyValue.value
    })
    
  }else {
    console.log("found")
    inserted = false
  }

  res.send({functionType : "insert", isInserted: inserted});
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
