var request = require('request');
var async = require('async');
var fs = require('fs');
var key = require('./key.js');
var url = 'http://api.crunchbase.com/v/1/company/triphunter.js?api_key='+key;

function get_company(name, cb){
  var url = 'http://api.crunchbase.com/v/1/company/'+name+'.js?api_key='+key;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      return cb(null, JSON.parse(body)); // Print the google web page.
    } else {
      return cb(error);
    }
  });
}

function write_company(name, json){
  return fs.writeFileSync(__dirname+'/companies/'+name+'.json', JSON.stringify(json));
}

function get_fn_array(){
  var arr = [];
  var companies = JSON.parse(fs.readFileSync('./companies.json', 'utf8'));
  companies.forEach(function(company){
    var fn = function(cb){
      get_company(company.permalink, function(e, company_json){
        console.log(company);
        if (!e){
          write_company(company.permalink, company_json);
          return cb(null);
        } else {
          return cb(e);
        }
      });
    };
    arr.push(fn);
  });
  return arr;
}

var funcs = get_fn_array();
async.series(funcs.splice(1, 2));
