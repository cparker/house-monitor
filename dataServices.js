#!/usr/bin/env node

'use strict';


var express = require('express');
var morgan = require('morgan');

module.exports = (function() {

  var handleMotion = function(req,res) {

  };


  var handleTemp = function(req, res) {

  };

  var app = express();
  app.use(morgan('combined'));

  app.get('/motion', handleMotion);
  app.get('/temp', handleTemp);

  app.listen(3000);

})();
