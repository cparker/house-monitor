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
  var motionContentDir = '/media/iomega/motion';
  var lastCheckFile = 'lastCheck.json';
  var ec2key = '/media/iomega/bigopt/house-monitor/ec2-march-2014.pem';
  var ec2UserAndHost = 'ubuntu@cjparker.us';
  var movieUploadLocation = '/opt/house-monitor/new-vids/';
  var picUploadLocation = '/opt/house-monitor/live-vids/';

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
        lastCheck = {date: new Date(0)}
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
          return true;
        }
      });

      var movieUploadCommand = '/usr/bin/scp -p -i $1 $2 $3:$4'
        .replace('$1', ec2key)
        .replace('$3', ec2UserAndHost)
        .replace('$4', movieUploadLocation)

      var picUploadCommand = '/usr/bin/scp -p -i $1 $2 $3:$4'
        .replace('$1', ec2key)
        .replace('$3', ec2UserAndHost)
        .replace('$4', picUploadLocation)

      var movies = _.filter(newFiles, function(f) {
        return f.name.match('.avi'+'$')=='.avi';
      })

      var pics = _.filter(newFiles, function(f) {
        return f.name.match('.jpg'+'$')=='.jpg';
      })

      // MOVIES
      _.each(movies, function (fileToUpload) {
        console.log('running ', movieUploadCommand.replace('$2',fileToUpload.name))
        exec(movieUploadCommand.replace('$2',fileToUpload.name), function(err,stdout,stderr) {
          if (err) {
            console.log(err);
          }
          sys.puts(stdout);
          sys.puts(stderr);

        });
      });

      // PICS
      _.each(pics, function (fileToUpload) {
        console.log('running ', picUploadCommand.replace('$2',fileToUpload.name))
        exec(picUploadCommand.replace('$2',fileToUpload.name), function(err,stdout,stderr) {
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
      console.log('caught ',err);
    })

})();
