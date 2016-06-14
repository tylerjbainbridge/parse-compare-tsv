'use strict'

const csv = require('fast-csv');
const async = require('async');
const _ = require('lodash');

class csvParser{

  constructor(actual, expected, delimiter){
    this.actualFile = actual;
    this.expectedFile = expected;
    this.options = {
      headers: true,
      delimiter: delimiter
    };
  }

  /**
   * @param {[type]} delimiter: a character to split on while parsing.
   */
  set delimiter(delimiter){
    this.options.delimiter = delimiter;
  }

  /**
   * [parseCSV description] Opens a file, splits on the specified delimiter, and stores the result in an object array.
   * @param  {[type]}   filePath [description] file to parse.
   * @param  {Function} cb       [description] cb for handing async flow.
   */
  parseCSV(filePath, cb){
    var self = this;
    let array = [];

    csv
     .fromPath(filePath, self.options)
     .on("data", (data)=>{
         array.push(data);
     })

     .on("end", ()=>{
       if(!array.length){
         cb(new Error(`Error: ${filePath} is empty.`));
       }else{
         cb(null, array);
       }
     })

     .on('error', (err)=>{
       //+2 is  to account for the headers and the array indexing.
       if(err.message.match(/column header mismatch expected/i)){
         console.log(`Error found on line: ${array.length+2}.`);
       }
       cb(err);
     });
  }

  /**
   * [readFiles description] Parses the csv files and returns an object containing both arrays.
   * @param  {Function} cb [description] cb for handling async flow.
   */
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

  /**
   * [compareFiles description] Work in progress.
   */
  compareFiles(){
    //Checks if they have the same number of rows.
    _.size(this.actual) === _.size(this.expected) ? console.log(`Same number of rows: ${_.size(this.actual)}`) : console.error(new Error('Error: Different amount of rows in actual.'));

    //Is every row in expectedFile in actualFile?
    _.forEach(this.expected, (row)=>{
      if(!_.find(this.actual, row)) console.log(`Can't find expected row in actual:\n${JSON.stringify(row)}`);
    })
  }

}

module.exports = csvParser;
