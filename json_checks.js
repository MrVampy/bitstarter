#!/usr/bin/env node
var fs = require('fs');

function get_json(filename, callback) {
    var data = fs.readFileSync(filename, 'utf8');
    var lines = data.split("\n");
    

    callback(null, JSON.stringify(lines));
}

get_json('./checklist', function(err, lines){
  console.log(lines);
})
