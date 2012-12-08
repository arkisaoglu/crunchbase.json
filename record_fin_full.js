var request = require('request');
var async = require('async');
var fs = require('fs');
var key = require('./key.js');

function get_company(name, cb){
  var url = 'http://api.crunchbase.com/v/1/financial-organization/'+name+'.js?api_key='+key;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      try {
        var company = JSON.parse(body);
        return cb(null, company); // Print the google web page.
      } catch(e){
        return cb(e);
      }
    } else {
      return cb(error);
    }
  });
}

function write_company(name, json){
  return fs.writeFileSync(__dirname+'/financial-organizations/'+name+'.json', JSON.stringify(json));
}

function get_fn_array(){
  var arr = [];
  var companies = JSON.parse(fs.readFileSync('./financial-organizations.json', 'utf8'));
  companies.forEach(function(company, i){
    try{
      var ls = fs.lstatSync(__dirname+'/financial-organizations/'+company.permalink+'.json');
      return false;
    } catch(e){
      var fn = function(cb){
        get_company(company.permalink, function(e, company_json){
          console.log(company);
          if (!e){
            write_company(company.permalink, company_json);
            return cb(null);
          } else {
            console.error(e);
            return cb(null);
          }
        });
      };
      arr.push(fn);
    }
  });
  return arr;
}

var funcs = get_fn_array();
async.series(funcs);
