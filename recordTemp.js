#!/usr/bin/env node

'use strict';

var Q = require('q');
var temp = require('./temp');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));

module.exports = (function () {

  var pathOfTemps = argv.pathOfTemps || '/bigopt/house-monitor';
  var filename = 'temps.json';
  var readFile = Q.nfbind(fs.readFile);
  var writeFile = Q.nfbind(fs.writeFile);
  var temps;

  readFile(pathOfTemps + '/' + filename)
    .then(function (f) {
      console.log('using existing temps ');
      temps = JSON.parse(f);
      return temp.getTempF();
    })
    .fail(function (err) {
      console.log('no existing', filename, 'starting new');
      temps = {
        "all": []
      };
      return temp.getTempF();
    })
    .then(function (tempF) {
      var temp = {
        date: new Date(),
        temp: tempF
      };
      temps.all.push(temp);
      temps.latest = temp;
      return writeFile(pathOfTemps + '/' + filename, JSON.stringify(temps, null, 4));
    })
    .fail(function () {
      console.log('success');
    })
    .fail(function (err) {
      console.log('error writing file', err);
    })

})();
