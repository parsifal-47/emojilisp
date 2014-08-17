module.exports = (function() {
	var context = [];
	var lex = require("lex.js");
	function execute(AST) {
		
	}
	function addAndRun(text) {
		context.push(lex.parse(text));

	}
	return {add:addAndRun};
})();