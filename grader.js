#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var http = require('http');

var program = require('commander');
var cheerio = require('cheerio');
var HTMLFILE_DEFAULT = "index.html";
var URLFILE_DEFAULT = "http://example.iana.org/";
var CHECKSFILE_DEFAULT = "checks.json";


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(htmlfile);
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    //console.log(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
	// console.log($(checks[ii]));
        out[checks[ii]] = present;
    }
    return out;
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

var checkJsonAndPrint = function(data, check) {
    var checkJson = checkHtmlFile(data, check);
    var outJson = JSON.stringify(checkJson, null, 4);
    return outJson;
};


if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-u, --url <url>', 'Url Path')
        .parse(process.argv);
    if (program.url) 
    {
	var request = http.request(program.url, function (res) {
	    var data = '';
	    res.on('data', function (chunk) {
            data += chunk;
	    });
	    res.on('end', function (chunk) {
		var output = checkJsonAndPrint(data, program.checks);
		console.log(output);
	    });
	});
	request.on('error', function (e) {
	    console.log(e.message);
	});
	request.end(); 
    } else {
	var output = checkJsonAndPrint(fs.readFileSync(program.file), program.checks);
	consolge.log(output);
    }

      
    
} else {
  exports.checkHtmlFile = checkHtmlFile;
}
