#!/usr/bin/env node

'use strict';

var tempsensor = require('ds18x20');
var _ = require('underscore');

tempsensor.isDriverLoaded(function(err,isLoaded) {
  console.log(isLoaded);
});


