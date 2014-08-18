/* nodejs only file which re-builds lex and examples*/

var fs = require('fs');
var PEG = require("pegjs");
var template = require('./lib/template.js');

fs.readFile('lib/el.pegjs', 'utf8', function (err,data) {
  if (err) return console.log(err);
  var parser = PEG.buildParser(data, {output:"source"});
  fs.writeFile('lib/lex.js', 'try { module = module || {}; } ' +
			    'catch (e) { module = {}; } module.exports = ' + 
				parser + ';', function (err) {
	  if (err) return console.log(err);
	  console.log('lex has been rebuilt');
  });
});

fs.readdir('templates', function(err, data) {
  if (err) return console.log(err);
  for (var i = 0; i<data.length; i++) {
    var examples = require("./templates/" + data[i]);
    for (var j = 0; j< examples.length; j++) {
      fs.writeFile('examples/' + (examples[j].name.split(" ").join("_")) + ".eli",
        template.encode(examples[j].program), function (err) {
          if (err) return console.log(err);
          console.log('ok');
        });
    }
  }
});