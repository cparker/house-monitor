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

  // look for new vids uploaded
  var vids = fs.readdirSync(appDir + newVidsDir);
  console.log('', vids.length, 'new videos to re-encode');
  console.log('vids', vids);

  var encodeCommand = 'avconv -y -i $1 -vcodec libx264 -vprofile high -preset slow -b:v 1000k -maxrate 1000k -bufsize 200k -r 4 $2';

  var commandPromises = _.map(vids, function (vid) {

    var command = encodeCommand
      .replace('$1', appDir + newVidsDir + '/' + vid)
      .replace('$2', appDir + liveVidsDir + '/' + vid.replace(/^(.*?)\.avi$/, '$1.mp4'));
    return function () {
      console.log('running ', command);

      return execPromise(command)
        .then(function (res) {
          sys.puts(res[0]);
          sys.puts(res[1]);
          console.log('deleting source file');
          unlink(appDir + newVidsDir + '/' + vid);
        }).catch(function (err) {
          console.log(err);
          console.log('deleting source file');
          unlink(appDir + newVidsDir + '/' + vid);
        })
    };
  });

  // now execute the promises sequentially
  commandPromises.reduce(Q.when, Q('initial'));


})();
