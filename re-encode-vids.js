#!/usr/bin/env node

'use strict';

var fs = require('fs');
var Q = require('q');
var sys = require('sys')
var exec = require('child_process').exec;
var _ = require('underscore');

module.exports = (function () {

  var appDir = '/opt/house-monitor';
  var newVidsDir = '/new-vids';
  var liveVidsDir = '/live-vids';

  var readdir = Q.nfbind(fs.readdir);
  var unlink = Q.nfbind(fs.unlink);

    // look for new vids uploaded
    readdir(appDir + newVidsDir)
      .then(function (vids) {
        console.log('', vids.length, 'new videos to re-encode');
        console.log('vids', vids);
        var encodeCommand = 'avconv -i $1 -vcodec libx264 -vprofile high -preset slow -b:v 1000k -maxrate 1000k -bufsize 200k -r 4 $2';

        _.each(vids, function (vid) {

          var command = encodeCommand
            .replace('$1', appDir + newVidsDir + '/' + vid)
            .replace('$2', appDir + liveVidsDir + '/' + vid.replace(/^(.*?)\.avi$/, '$1.mp4'));

          console.log('running\n', command);

          try {
            exec(command, function (error, stdout, stderr) {
              if (error) {
                console.log(error);
              }
              sys.puts(stdout);
              sys.puts(stderr);

              // remove the old vid
              console.log('deleting ', appDir + newVidsDir + '/' + vid)
              unlink(appDir + newVidsDir + '/' + vid);
            });
          } catch (err) {
            console.log('caught error encoding.  SKIPPING.')
          }

        })
      })
      .catch(function (err) {
        console.log('caught error', err);
      })

})();
