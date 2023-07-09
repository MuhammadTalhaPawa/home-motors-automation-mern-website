require("dotenv").config();
 
const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())

port = 8000;

mongoose.connect(
  process.env.atlasMongoURL,
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

app.get('/insertOne/:myData', async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue)
  
  d = await autoData.findOne({name: jsonKeyValue.key})

  var isTaskCompleted = null
  if(d == null) {
    console.log("not found")
    await autoData.insertMany({
      name: jsonKeyValue.key,
      value: jsonKeyValue.value
    })
    isTaskCompleted = true    
  }else {
    console.log("found")
    isTaskCompleted = false
  }

  res.send({functionType : "insertOne", taskCompleted: isTaskCompleted});
});

app.get('/deleteOne/:myData', async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue)

  d = await autoData.findOne({name: jsonKeyValue.key})
  
  var isTaskCompleted = null
  if(d == null) {
    console.log("not found")
    isTaskCompleted = false    
  }else {
    console.log("found")
    await autoData.deleteOne({name:jsonKeyValue.key})
    isTaskCompleted = true
  }

  res.send({functionType : "deleteOne", taskCompleted: isTaskCompleted});
});

app.get('/deleteAll', async (req, res) => {
  await autoData.deleteMany({}) 

  res.send({functionType : "deleteAll", taskCompleted: true});
});

app.get('/updateOne/:myData', async(req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue)
  
  d = await autoData.findOne({name: jsonKeyValue.key})

  var isTaskCompleted = null
  if(d == null) {
    console.log("not found")
    isTaskCompleted = false    
  }else {
    console.log("found")
    await autoData.updateOne({name: jsonKeyValue.key},{$set : {value: jsonKeyValue.value}})
    isTaskCompleted = true
  }

  res.send({functionType : "updateOne", taskCompleted: isTaskCompleted});
});

app.listen(port, () =>
  console.log(`Example app listening on ${port} `),
);
