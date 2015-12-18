#!/usr/bin/env node

'use strict';

var fs = require('fs');
var Q = require('q');
var sys = require('sys');
var exec = require('child_process').exec;
var _ = require('underscore');

module.exports = (function () {

  var appDir = '/opt/house-monitor';
  var newVidsDir = '/new-vids';
  var liveVidsDir = '/live-vids';

  var unlink = Q.nfbind(fs.unlink);
  var execPromise = Q.denodeify(exec);

  console.log('starting',new Date());

  // look for new vids uploaded
  var vids = fs.readdirSync(appDir + newVidsDir);
  console.log('', vids.length, 'new videos to re-encode');
  console.log('vids', vids);

  var encodeCommand = '/opt/apps/bin/avconv -y -i $INPUT -vcodec libx264 -vprofile high -preset slow -b:v 100k -maxrate 100k -bufsize 200k -r 4 $OUTPUT';
  var animatedGifCommand = "/home/ubuntu/bin/ffmpeg -t 20 -i $INPUT -r 1 -vf 'select=gt(scene\\,0.2),scale=350:-1' -gifflags +transdiff -y $OUTPUT";

  var commandPromises = _.flatten(_.map(vids, function (vid) {

    var newVidMp4Name = vid.replace(/^(.*?)\.avi$/, '$1.mp4');
    var newVidGifName = vid.replace(/^(.*?)\.avi$/, '$1.gif');

    var reEncodeCommand = encodeCommand
      .replace('$INPUT', appDir + newVidsDir + '/' + vid)
      .replace('$OUTPUT', appDir + liveVidsDir + '/' + newVidMp4Name);

    var aniGifFinalCommand = animatedGifCommand
      .replace('$INPUT', appDir + liveVidsDir + '/' + newVidMp4Name)
      .replace('$OUTPUT', appDir + liveVidsDir + '/' + newVidGifName);


    var reEncodeFunc = function () {
      console.log('running 1.', reEncodeCommand);
      return execPromise(reEncodeCommand)
        .then(function (res) {
          sys.puts(res[0]);
          sys.puts(res[1]);
          console.log('deleting source file');
          unlink(appDir + newVidsDir + '/' + vid);
        }).catch(function (err) {
          console.log(err);
          console.log('deleting source file');
          unlink(appDir + newVidsDir + '/' + vid);
        });
    };

    var makeGifFunc = function () {
      console.log('running 2.', aniGifFinalCommand);
      return execPromise(aniGifFinalCommand)
        .then(function (res) {
          sys.puts(res[0]);
          sys.puts(res[1]);
        }).catch(function (err) {
          console.log(err);
        });
    };

    // returning an array, which gets flattened
    return [reEncodeFunc, makeGifFunc];

  }));

  // now execute the promises sequentially
  commandPromises.reduce(Q.when, Q('initial'));


})();
