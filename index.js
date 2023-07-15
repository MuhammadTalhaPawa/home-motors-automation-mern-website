require("dotenv").config();
 
const express = require('express')
const mongoose = require("mongoose");
const bodyParser = require('body-parser')

const app = express();

app.use(bodyParser.json())

port = process.env.PORT || 8000;

mongoose.set('strictQuery',false)
mongoose.connect(
  process.env.atlasMongoURL,
  // process.env.localMongoURL,
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
  res.send('Home motor automation Panga is not changA...');
});


app.get('/getValue/:myData', async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue)
  
  d = await autoData.findOne({name: jsonKeyValue.key})

  var isTaskCompleted = null
  var value = null

  if(d == null) {
    console.log("not found")
    isTaskCompleted = false 
    value = -1 
  }else {
    console.log("found")
    isTaskCompleted = true
    value = d.value
  }

  res.send({functionType : "getValue", taskCompleted: isTaskCompleted, value: value});
});

app.get('/getAllValues', async (req, res) => {
  // jsonKeyValue = await getKeyValue(req.params.myData);
  // console.log(jsonKeyValue)
  
  d = await autoData.find({})
  // console.log(d);

  var allData = [];
  for (var i = 0; i < d.length; i++) {
    var jsonData = {};
    jsonData.variable = d[i].name;
    jsonData.value = d[i].value;
    allData.push(jsonData);
  }

  var isTaskCompleted = false;
  if(d.length > 0) {
    isTaskCompleted = true;
  }
  // console.log(allData);

  // var isTaskCompleted = null
  // var value = null

  // if(d == null) {
  //   console.log("not found")
  //   isTaskCompleted = false 
  //   value = -1 
  // }else {
  //   console.log("found")
  //   isTaskCompleted = true
  //   value = d.value
  // }

  res.send({functionType : "getAllValue", taskCompleted: isTaskCompleted, value: allData});
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
