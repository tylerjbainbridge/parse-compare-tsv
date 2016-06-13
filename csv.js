'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');

var actualFile = 'actual.csv';
var expectedFile = 'expected.csv';

async.parallel([
    (callback)=>{
      let actual = [];
      csv
       .fromPath(actualFile, {headers: true, delimiter:'\t'})
       .on("data", (data)=>{
           actual.push(data);
       })
       .on("end", ()=>{
           callback(null, actual);
       });
    },
    (callback)=>{
      let expected = [];
      csv
       .fromPath(expectedFile, {headers: true,delimiter:'\t'})
       .on("data", (data)=>{
          expected.push(data);
       })
       .on("end", ()=>{
           callback(null, expected);
       });
    }
],

(err, results)=>{
  //console.log(results);
  compareFiles(results[0], results[1]);
});

function compareFiles(actual, expected){
  if(actual.length == expected.length){
    console.log(`Both files contain ${actual.length} rows.`)
  }
}
