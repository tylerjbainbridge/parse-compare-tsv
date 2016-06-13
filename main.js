var csv = require("fast-csv");

var fs = require('fs');


var stream = fs.createReadStream("sample.tsv");

csv
    .fromStream(stream, {headers: true, delimiter: '\t'})
    .on("data", function(data){
        console.log(data);
        console.log('\n');
    })
    .on("end", function(){
        console.log("-------------------DONE---------------------")
    });