/* nodejs only file which re-builds lex */

var fs = require('fs');
var PEG = require("pegjs");

fs.readFile('interpreter/el.pegjs', 'utf8', function (err,data) {
  if (err) {
    return console.log(err);
  }
  var parser = PEG.buildParser(data, {output:"source"});
  fs.writeFile('interpreter/lex.js', 'try { module = module || {}; } ' +
			    'catch (e) { module = {}; } module.exports = ' + 
				parser + ';', function (err) {
	  if (err) return console.log(err);
	  console.log('ok');
  });
});
