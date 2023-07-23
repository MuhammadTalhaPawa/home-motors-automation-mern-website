require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const app = express();

app.use(bodyParser.json());

port = process.env.PORT || 8000;

mongoose.set("strictQuery", false);
mongoose.connect(
  process.env.atlasMongoURL,
  // process.env.localMongoURL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const autoDataSchema = new mongoose.Schema({
  name: String,
  value: Number,
});

const autoData = mongoose.model("autoData", autoDataSchema);

function getKeyValue(data) {
  var keyValue = data.split("=");
  jsonValue = {
    key: keyValue[0],
    value: parseInt(keyValue[1]),
  };
  return jsonValue;
}

function getAllKeyValues(data) {
  var things = data.split(",");
  var keyValueThings = [];

  things.forEach((thing) => {
    var keyValue = thing.split("=");
    var obj = {
      variable: keyValue[0],
      value: keyValue[1],
    };
    keyValueThings.push(obj);
  });

  return keyValueThings;
}

app.get("/", (req, res) => {
  res.send("Home motor update: updateAllValues");
});

app.get("/getValue/:myData", async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue);

  d = await autoData.findOne({ name: jsonKeyValue.key });

  var isTaskCompleted = null;
  var value = null;

  if (d == null) {
    console.log("not found");
    isTaskCompleted = false;
    value = -1;
  } else {
    console.log("found");
    isTaskCompleted = true;
    value = d.value;
  }

  res.send({
    functionType: "getValue",
    taskCompleted: isTaskCompleted,
    value: value,
  });
});

app.get("/getAllValues", async (req, res) => {
  // jsonKeyValue = await getKeyValue(req.params.myData);
  // console.log(jsonKeyValue)

  d = await autoData.find({});
  // console.log(d);

  var allData = [];
  for (var i = 0; i < d.length; i++) {
    var jsonData = {};
    jsonData.variable = d[i].name;
    jsonData.value = d[i].value;
    allData.push(jsonData);
  }

  var isTaskCompleted = false;
  if (d.length > 0) {
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

  res.send({
    functionType: "getAllValue",
    taskCompleted: isTaskCompleted,
    value: allData,
  });
});

app.get("/insertOne/:myData", async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue);

  d = await autoData.findOne({ name: jsonKeyValue.key });

  var isTaskCompleted = null;
  if (d == null) {
    console.log("not found");
    await autoData.insertMany({
      name: jsonKeyValue.key,
      value: jsonKeyValue.value,
    });
    isTaskCompleted = true;
  } else {
    console.log("found");
    isTaskCompleted = false;
  }

  res.send({ functionType: "insertOne", taskCompleted: isTaskCompleted });
});

app.get("/deleteOne/:myData", async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue);

  d = await autoData.findOne({ name: jsonKeyValue.key });

  var isTaskCompleted = null;
  if (d == null) {
    console.log("not found");
    isTaskCompleted = false;
  } else {
    console.log("found");
    await autoData.deleteOne({ name: jsonKeyValue.key });
    isTaskCompleted = true;
  }

  res.send({ functionType: "deleteOne", taskCompleted: isTaskCompleted });
});

app.get("/deleteAll", async (req, res) => {
  await autoData.deleteMany({});

  res.send({ functionType: "deleteAll", taskCompleted: true });
});

app.get("/updateOne/:myData", async (req, res) => {
  jsonKeyValue = await getKeyValue(req.params.myData);
  console.log(jsonKeyValue);

  d = await autoData.findOne({ name: jsonKeyValue.key });

  var isTaskCompleted = null;
  if (d == null) {
    console.log("not found");
    isTaskCompleted = false;
  } else {
    console.log("found");
    await autoData.updateOne(
      { name: jsonKeyValue.key },
      { $set: { value: jsonKeyValue.value } }
    );
    isTaskCompleted = true;
  }

  res.send({ functionType: "updateOne", taskCompleted: isTaskCompleted });
});

app.get("/updateAll/:myData", async (req, res) => {
  allKeyValues = getAllKeyValues(req.params.myData);
  // console.log(allKeyValues);

  for (let i = 0; i < allKeyValues.length; i++) {
    keyValue = allKeyValues[i];
    console.log(keyValue);
    f = await autoData.findOne({ name: keyValue.variable });
    if (f == null) {
      console.log("Not Found: inserting: ");
      await autoData.insertMany({
        name: keyValue.variable,
        value: keyValue.value,
      });
    } else {
      console.log("found: updating");
      await autoData.updateOne(
        { name: keyValue.variable },
        { $set: { value: keyValue.value } }
      );
    }
  }

  // allKeyValues.forEach((keyvalue) => {
  //   f = await autoData.findOne({ name: keyvalue.variable });
  //   console.log(keyvalue);
  // });

  res.send({ functionType: "updateAll", taskCompleted: true });
});

app.listen(port, () => console.log(`Example app listening on ${port} `));
