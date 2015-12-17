#!/usr/bin/env node

'use strict';

var Q = require('q');
var temp = require('./temp');
var fs = require('fs');
var argv = require('minimist')(process.argv.slice(2));
var nodemailer = require('nodemailer');
var moment = require('moment');

module.exports = (function () {

  var pathOfTemps = argv.pathOfTemps || '/bigopt/house-monitor';
  var filename = 'temps.json';
  var readFile = Q.nfbind(fs.readFile);
  var writeFile = Q.nfbind(fs.writeFile);
  var temps;
  var emailPassFile = argv.emailPassFile || '.emailpass';
  var alertTempThreshold = argv.alertTemp || 50;

  var emailPass;
  try {
    emailPass = fs.readFileSync(emailPassFile, 'utf-8').trim();
  } catch (err) {
    console.log('no .emailpass file, using some crazy default');
    emailPass = 'ssdf8098sm3n4,2m3n42,3m';
  }

  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'x@cjparker.us',
      pass: emailPass
    }
  });


  var alertTemp = function (tempF) {
    if (tempF <= alertTempThreshold) {
      console.log('!!!WARNING temperature is below configured threshold.  Alerting!!!');

      var nowMom = moment();

      var mailOptions = {
        priority: 'high',
        from: 'cparker@cjparker.us',
        to: '3038855590@txt.att.net',
        subject: 'WARNING house temperature ' + tempF,
        text: 'At ' + nowMom.format() + ' house temperature was ' + tempF +
        ' which is below your configured threshold of ' + alertTempThreshold
      };

      transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
          return console.log(error);
        }
        console.log('Message sent: ' + info.response);
      });
    }
  };


  readFile(pathOfTemps + '/' + filename)
    .then(function (f) {
      console.log('using existing temps ');
      temps = JSON.parse(f);
      return temp.getTempF();
    })
    .fail(function (err) {
      console.log('no existing', filename, 'starting new');
      temps = {
        'all': []
      };
      return temp.getTempF();
    })
    .then(function (t) {
      var tempF = t.toPrecision(3);
      alertTemp(tempF);
      var temp = {
        date: new Date(),
        tempF: tempF
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
    });

})();
