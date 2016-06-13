'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');

var args = process.argv.slice(2);
var actualFile = args[0];
var expectedFile = args[1];

if (!actualFile) {
  console.log('Must provide an actual file');
  process.exit();
}
if (!expectedFile) {
  console.log('Must provide an expected file');
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

/**
 * Compares two .tsv files.
 * @param  {[type]} actual   array of rows and columns from actual file.
 * @param  {[type]} expected array of rows and columns from expected file.
 */
function compareFiles(actual, expected){

  if(_.size(actual) === _.size(expected))
    console.log(`Same number of rows: ${_.size(actual)}`);

  _.forEach(expected, function(row){
    if(!_.find(actual, row)) console.log(`Couldn't find expected row in actual:\n${JSON.stringify(row)}`);
  })

}
