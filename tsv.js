'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');

const args = process.argv.slice(2);
const actualFile = args[0];
const expectedFile = args[1];

const csvOptions = {
  headers: true,
  delimiter:'\t'
}

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
       .fromPath(actualFile, csvOptions)
       .on("data", (data)=>{
           actual.push(data);
       })
       .on("end", ()=>{
         if(actual.length == 0){
           callback(new Error('Error: actualFile is empty.'));
         }else{
           callback(null, actual);
         }
       })
       .on('error', (err)=>{
         //+2 is  to account for the headers and the array indexing.
         console.log(`Error found on line: ${actual.length+2}.`);
         callback(err);
       });
    },
    (callback)=>{
      let expected = [];
      csv
       .fromPath(expectedFile, csvOptions)
       .on("data", (data)=>{
          expected.push(data);
       })
       .on("end", ()=>{
         if(expected.length == 0){
            callback(new Error('Error: expectedFile is empty.'), expected);
         }else{
           callback(null, expected);
         }
       })
       .on('error', (err)=>{
         console.log(`Error found on line: ${expected.length+2}.`);
         callback(err);
       });
    }
],

(err, results)=>{
  //console.log(results);
  if(err){
    console.error(err);
  }else{
    compareFiles(results[0], results[1]);
  }
});

/**
 * Compares two .tsv files.
 * @param  {[type]} actual   array of rows and columns from actual file.
 * @param  {[type]} expected array of rows and columns from expected file.
 */
function compareFiles(actual, expected){

  _.size(actual) === _.size(expected) ? console.log(`Same number of rows: ${_.size(actual)}`); : console.error(new Error('Error: Different amount of rows in actual.'));

  _.forEach(expected, (row)=>{
    if(!_.find(actual, row)) console.log(`Can't find expected row in actual:\n${JSON.stringify(row)}`);
  })

}
