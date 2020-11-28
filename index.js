const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const ip = require("ip");

app.use(express.json());
app.use(bodyParser.json());
app.use(cors({ origin: true }));

const mqtt = require("mqtt");
const client = mqtt.connect(`tcp://${ip.address()}:1883`);

app.listen(3000, () =>
  console.log(`http://localhost:3000 ó http://${ip.address()}:3000`)
);

app.post("/", (req, res) => {
  const { topic, message } = req.body;

  client.on("connect", () => {
    client.subscribe(topic, (err) => {
      if (!err) client.publish(topic, message);
      else res.json({ isSuccess: false });
    });
  });

  client.on("message", () => {
    res.json({ isSuccess: true });
    client.end();
  });
});