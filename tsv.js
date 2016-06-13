'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');
var TSV = require('./tsv-class');

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

var tsv = new TSV(actualFile, expectedFile);

tsv.readFiles(function(err, res){
  tsv.compareFiles();
});
