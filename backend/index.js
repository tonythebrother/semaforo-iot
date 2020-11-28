const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const ip = require('ip');

app.use(express.json());

app.use(bodyParser.json());

app.use(cors({ origin: true }));

//app.use(require('./routes'));

app.listen(3000, () => console.log(`http://localhost:3000 ó http://${ip.address()}:3000`));

