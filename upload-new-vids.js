#!/usr/bin/env node

'use strict';

var fs = require('fs');
var Q = require('q');
var sys = require('sys');
var exec = require('child_process').exec;
var _ = require('underscore');

module.exports = (function () {

  var readdir = Q.nfbind(fs.readdir);

  //var motionContentDir = '/media/iomega/motion';
  var motionContentDir = 'src';
  var lastCheckFile = 'lastCheck.json';

  readdir(motionContentDir)
    .then(function (motionFiles) {

      var lastCheck;

      try {
        var lastCheckJSON = JSON.parse(fs.readFileSync(lastCheckFile, {encoding: 'utf-8'}));
        lastCheck = {
          date: new Date(lastCheckJSON.date)
        }
      } catch (err) {
        console.log('looks like a first run ', err);
        lastCheck = {date: new Date()}
      }
      console.log('looking for files written since ', lastCheck);

      var motionFileStats = _.map(motionFiles, function (file) {
        var fd = fs.openSync(motionContentDir + '/' + file, 'r');
        var stat = fs.fstatSync(fd);
        fs.closeSync(fd);
        return {
          name: motionContentDir + '/' + file,
          stat: stat
        };
      });

      // which files are newer than since we last checked
      var newFiles = _.filter(motionFileStats, function (fileStat) {
        if (fileStat.stat.ctime > lastCheck.date) {
          console.log('found a new file ', fileStat.name);
          return fileStat.name;
        }
      });

      var uploadCommand = 'ls -la $1'.replace('$dir',motionContentDir);

      _.each(newFiles, function (fileToUpload) {
        console.log('working ',fileToUpload.name);
        exec(uploadCommand.replace('$1',fileToUpload.name), function(err,stdout,stderr) {
          if (err) {
            console.log(err);
          }
          sys.puts(stdout);
          sys.puts(stderr);

        });

      });

      fs.writeFileSync(lastCheckFile, JSON.stringify({date: new Date()}));
    })
    .catch(function (err) {
      console.log(err);
    })

})();
