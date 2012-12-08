var request = require('request');
var key = require('./key.js');
var url = 'http://api.crunchbase.com/v/1/financial-organizations.js?api_key='+key;
var fs = require('fs');

request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    var companies = JSON.parse(body);
    fs.writeFileSync('./financial-organizations.json', JSON.stringify(companies));
  } else {
    console.error(error);
    process.exit();
  }
});
