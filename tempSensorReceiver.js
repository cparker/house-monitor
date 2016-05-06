var express = require('express');
var morgan = require('morgan');
var bodyParser = require('body-parser');

var app = express();

app.use(morgan('combined'));
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

var handleTempPost = function(req,res,err) {
  console.log('req is ', req);
  console.log('POST body is ', req.body);
  res.json({});
}

app.post('/tempSensorPost', handleTempPost);

var port = 8000;

app.listen(port);

console.log('listening on', port);
