#!/usr/bin/env node

'use strict';

var tempsensor = require('ds18x20');
var _ = require('underscore');
var Q = require('q');
var argv = require('minimist')(process.argv.slice(2));

module.exports = (function () {
  // promise based versions

  var isDriverLoaded = Q.nbind(tempsensor.isDriverLoaded, tempsensor);
  var loadDriver = Q.nbind(tempsensor.loadDriver, tempsensor);
  var listSensors = Q.nbind(tempsensor.list, tempsensor);
  var getAll = Q.nbind(tempsensor.getAll, tempsensor);

  var ensureDriverLoaded = function () {
    return isDriverLoaded()
      .then(function (isLoaded) {
        console.log('driver is loaded', isLoaded);
        if (isLoaded) {
          return Q('driver is loaded');
        } else {
          return loadDriver();
        }
      })
      .fail(function (x) {
        console.log('driver is not loaded', x, 'attempting to load now');
        return loadDriver();
      })
      .fail(function (err) {
        console.log('error loading driver', err);
      });
  };

  var getTempF = function (mockTemp) {
    var firstSensor;

    if (mockTemp) {
      return mockTemp;
    }

    return ensureDriverLoaded()
      .then(function () {
        return listSensors();
      })
      .then(function (sensors) {
        console.log('got sensors', sensors);
        if (sensors.length > 0) {
          firstSensor = sensors[0];
          console.log('using first sensor listed', firstSensor);
          return getAll();
        }
      })
      .then(function (readings) {
        var celcius = readings[firstSensor];
        return Q(celcius * 1.8 + 32);
      })
      .catch(function (err) {
        console.log('caught exception on getTemp', err);
      });

  };

  // if --test, then read a value from the sensor and print to console
  if (argv.test) {
    getTempF()
      .then(function (result) {
        console.log('result', result);
      });
  }

  return {
    getTempF: getTempF
  };

})();


