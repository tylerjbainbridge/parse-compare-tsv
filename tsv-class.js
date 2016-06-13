'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');

class tsvParser{

  constructor(actual, expected){
    this.actualFile = actual;
    this.expectedFile = expected;
    this.options = {
      headers: true,
      delimiter:'\t'
    }
  }

  parseCSV(filePath, cb){
    var self = this;
    let array = [];

    csv
     .fromPath(filePath, self.options)
     .on("data", (data)=>{
         array.push(data);
     })

     .on("end", ()=>{
       if(array.length == 0){
         cb(new Error(`Error: ${filePath} is empty.`));
       }else{
         cb(null, array);
       }
     })

     .on('error', (err)=>{
       //+2 is  to account for the headers and the array indexing.
       console.log(`Error found on line: ${array.length+2}.`);
       cb(err);
     });
  }

  readFiles(cb){
    var self = this;

    async.parallel([
        (cb)=>{
          self.parseCSV(self.actualFile, cb);
        },
        (cb)=>{
          self.parseCSV(self.expectedFile, cb);
        }
    ],

    (err, results)=>{
      //console.log(results);
      self.actual = results[0];
      self.expected = results[1];
      cb(err, results);
    });
  }

  compareFiles(){
    _.size(this.actual) === _.size(this.expected) ? console.log(`Same number of rows: ${_.size(this.actual)}`) : console.error(new Error('Error: Different amount of rows in actual.'));

    _.forEach(this.expected, (row)=>{
      if(!_.find(this.actual, row)) console.log(`Can't find expected row in actual:\n${JSON.stringify(row)}`);
    })
  }

}

module.exports = tsvParser;
