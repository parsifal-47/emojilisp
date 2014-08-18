module.exports = (function() {
	var confDir = 'conf';
	var sets = [];
	var base = require("../conf/base.json");
	var fs = require("fs");
	fs.readdir(confDir, function(err, data) {
	  if (err) return console.log(err);
	  for (var i = 0; i<data.length; i++) {
	    sets.push(require("../" + confDir + "/" + data[i]));
	  }
	});

	function encode(list) {
		for (var i = 0; i < list.length; i++) {
			for (var j = 0; j < sets.length; j++) {
				if (sets[j][list[i]]) {
					list[i] = sets[j][list[i]];
					break;
				}
			}
		}
		return list.join("");
	}

	function preprocess(str) {
		for (var i in base) str.split(base[i]).join(i);
		return str;
	}

	function decode(name) {
		for (var j = 0; j < sets.length; j++) {
			for (var k in sets[j])
				if (sets[j][k] === name) return k;
		}
		return name;
	}
	
	return {
		encode: encode,
		preprocess: preprocess,
		decode: decode
	};
})();