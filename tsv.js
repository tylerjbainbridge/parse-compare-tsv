'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');

var args = process.argv.slice(2);
var actualFile = args[0];
var expectedFile = args[1];

if (!actualFile) {
  console.log('Must provide actual file');
  process.exit();
}
if (!expectedFile) {
  console.log('Must provide expected file');
  process.exit();
}

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
  if(_.size(actual) === _.size(expected)){
    for(let i=0; i<actual.length; i++){
      if(!_.isEqual(actual[i], expected[i])){
        console.log(`Error on row ${i}`);
      }
    }
  }
}
