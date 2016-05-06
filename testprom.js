'use strict';

var Q = require('q');
var fs = require('fs');


var read = Q.nfbind(fs.readFile);

var func = function () {
  return read('other.txt', 'utf-8')
    .then(function () {
      console.log('this is a then attached right to the read');
    })
    .catch(function (err) {
      console.log('ATTACHED: this is a catch attached right to the read', err);
      throw err;
    })

};

read('str.txt', 'utf-8')
  .then(function (f) {
    console.log('I GOT', f);
  })
  .then(function () {
    console.log('and this is another THEN');
  })
  .then(function () {
    console.log('and one more');
    // throw 'Oh nooooooo!'
    return Q('here is some stuff');
  })
  .then(function (stuff) {
    console.log('the previous promise handed me >>', stuff);
    return func();
  })
  .then(function () {
    console.log('after call to read');
  })
  .catch(function (err) {
    console.log('CAUGHT', err)
  })
  .then(function () {
    console.log('this is a THEN after the catch')
  });
