'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');

const CSVParser = require('./tsv-class');

const args = process.argv.slice(2);
const actualFile = args[0];
const expectedFile = args[1];

if (!actualFile) {
  console.log('Must provide an actual file');
  process.exit();
}
if (!expectedFile) {
  console.log('Must provide an expected file');
  process.exit();
}

// var options = {
//   headers: true,
//   delimiter:'\t'
// };

var tsv = new CSVParser(actualFile, expectedFile, '/t');

tsv.readFiles(function(err, res){
  if(err){
    console.error(err);
  }else{
    tsv.compareFiles();
  }
});
