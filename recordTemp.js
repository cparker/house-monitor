#!/usr/bin/env node

'use strict';

var tempsensor = require('ds18x20');
var _ = require('underscore');
var Q = require('q');
var minimist = require('minimist');
var argv = require('minimist')(process.argv.slice(2));
var temp = require('./temp');
var fs = require('fs');


module.exports = (function() {

  var filename = 'readings.json';
  var readFile = Q.nfbind(fs.readFile);
  var writeFile = Q.nfbind(fs.writeFile);
  var readings;

  readFile(filename)
    .then(function(f) {
      console.log('got existing readings', f);
      readings = JSON.parse(f);
      return temp.getTempF();
    })
    .fail(function(err) {
      console.log('no existing',filename, 'starting new');
      readings = [];
      return temp.getTempF();
    })
    .then(function(tempF) {
      readings.push({
        date : new Date(),
        temp : tempF
      });
      return writeFile(filename,JSON.stringify(readings, null, 4));
    })
    .fail(function() {
      console.log('success');
    })
    .fail(function(err) {
      console.log('error writing file',err);
    })
  
})();
