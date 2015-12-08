#!/usr/bin/env node

'use strict';

var express = require('express');
var morgan = require('morgan');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));

module.exports = (function () {
  console.log('argv',argv);
  var port = argv.port || 3000;
  var motionContentDir = argv.motionContentDir || '/opt/house-monitor/live-vids';
  var imageURLPrefix = argv.imageURLPrefix != undefined ? argv.imageURLPrefix : 'motionfiles/';
  var mockTemp = argv.mockTemp;

  var tempAPIURL = "/house/api/temp";
  var motionAPIURL = "/house/api/motion";

  /*
   [
   "eventDate" : "[ISO date string, based on the mtime of one of the files]",
   "pic" : "url to the pic",
   "vid" : "url of the video"
   ]
   */

  /**
   * Query should look like: cjparker.us/motion/sinceHours=24
   * @param req
   * @param res
   */
  var handleMotion = function (req, res) {
    var sinceHours = req.query.sinceHours || 24;
    console.log('getting you files created in the last ', sinceHours, ' hours');
    var cutoffDate = moment().subtract(sinceHours, 'hours').toDate();
    console.log('cutoff date ', cutoffDate);

    // get the file names
    var files = fs.readdirSync(motionContentDir);

    // map those into file stats
    var fileStats = _.map(files, function (f) {
      var fd = fs.openSync(motionContentDir + '/' + f, 'r');
      var stat = fs.fstatSync(fd);
      fs.closeSync(fd);
      return {
        url: imageURLPrefix + f,
        name: f,
        stat: stat
      }
    });


    var newFiles = _.filter(fileStats, function (fs) {
      return fs.stat.mtime >= cutoffDate;
    });

    // filter out only the vids
    var vids = _.filter(newFiles, function (fs) {
      var suffix = '.mp4';
      return fs.name.match(suffix+"$") == suffix;
    });

    // for each vid, find its corresponding still image (.jpg) and make a pair
    var pairs = _.chain(vids)
      .map(function (vid) {
        var noExtention = vid.name.substr(0, vid.name.lastIndexOf('.'));
        var picFilename = noExtention + '.jpg';
        // confirm that we have the still
        var hasPic = _.find(newFiles, function (fs) {
          return fs.name == picFilename;
        });

        if (hasPic) {
          return {
            "eventDate": moment(vid.stat.mtime),
            "pic": imageURLPrefix + picFilename,
            "vid": imageURLPrefix + vid.name
          }
        } else {
          console.log('skipping ', vid.name, ' because we couldnt find a matching pic', picFilename);
          return undefined;
        }
      })
      .filter(function (x) {
        return x != undefined;
      })
      .sortBy(function (pair) {
        return pair.eventDate.toDate();
      })
      .map(function (pair) {
        return {
          "eventDate": pair.eventDate.format(),
          "pic": pair.pic,
          "vid": pair.vid
        }
      })
      .value()
      .reverse();

    console.log('returning', pairs);

    res.json(pairs);
  };


  var handleTemp = function (req, res) {

    var tempJSON = JSON.parse(fs.readFileSync('./temps.json', 'utf-8'));

    //res.json(tempJSON);
    res.send(401);
  };

  var app = express();
  app.use(morgan('combined'));
  app.use(express.static('build'));

  app.get(motionAPIURL, handleMotion);
  app.get(tempAPIURL, handleTemp);

  app.listen(port);

  console.log('listening on', port);

})();
