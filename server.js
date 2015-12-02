#!/usr/bin/env node

'use strict';

var express = require('express');
var morgan = require('morgan');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var argv = require('minimist')(process.argv.slice(2));

module.exports = (function () {
  var port = argv.port || 3000;
  var motionContentDir = argv.motionContentDir || '/opt/house-monitor/live-vids';
  var imageURLPrefix = argv.imageURLPrefix || 'motionfiles/';
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
        var picFilename = noExtention + '-00.jpg';
        // confirm that we have the still
        var hasPic = _.find(newFiles, function (fs) {
          console.log('fs.name',fs.name,'picFilename',picFilename);
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

    var mockResponse =
    {
      "all": [
        {
          "date": "2015-11-30T19:08:52.335Z",
          "tempF": 45.1
        },
        {
          "date": "2015-11-30T19:09:08.779Z",
          "tempF": 45.1
        }
      ],
      "latest": {
        "date": "2015-11-30T19:09:49.947Z",
        "tempF": 45.1
      }
    };

    return res.json(mockResponse);

  };

  var app = express();
  app.use(morgan('combined'));
  app.use(express.static('build'));

  app.get(motionAPIURL, handleMotion);
  app.get(tempAPIURL, handleTemp);

  app.listen(port);

  console.log('listening on', port);

})();
