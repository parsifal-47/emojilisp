module.exports = (function() {
	var confDir = 'conf';
	var sets = [];
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
	return {encode:encode};
})();