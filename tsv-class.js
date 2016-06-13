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

  readFiles(cb){
    var self = this;

    async.parallel([
        (callback)=>{
          let actual = [];

          csv
           .fromPath(self.actualFile, self.options)
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
           .fromPath(self.expectedFile, self.options)
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
