module.exports = (function() {
	var context = {};
	var lex = require("./lex.js");
	var template = require("./template.js");
	var stdlib = require("./stdlib.js");

	function tail(AST) {
		if (AST.type !== "List") throw new Error("Cannot take tail from non-list AST");
		AST.contents.splice(0, 1);
		return AST;
	}

	function execute(AST) {
		if (AST.type === "Literal") return AST.value;
		if (AST.type === "List") {
			if (AST.contents.length < 1) 
				throw new Error("Cannot execute empty list");

			if (AST.contents[0].type === "Literal")
				throw new Error("First element shouldn't be literal");

			if (AST.contents[0].type === "Identifier") {
				var dd = template.decode(AST.contents[0].name);
				if (context.jsFunctions[dd]) {
					return context.jsFunctions[dd](context, tail(AST));
				}
				if (context.functions[dd]) {
					throw new Error("not implemented");
				}
				throw new Error(AST.contents[0].name + " is undefined");
			}
		}
		if (AST.type === "Identifier") {
			throw new Error("Don't know how to execute Identifier " + AST.name);
		}
		if (AST.type === "Program") {
			for (var i=0; i<AST.body.length-1; i++) execute(AST.body[i]);
			return execute(AST.body[AST.body.length-1]);
		}
		throw new Error("Unexpected AST node type=" + AST.type);
	}

	function run(text) {
		return execute(lex.parse(template.preprocess(text)));
	}

	function cleanContext() {
		context.functions = {};
	}

	context.execute = execute;
	context.functions = {};
	context.jsFunctions = stdlib.functions;

	return {
		cleanContext: cleanContext,
		run:run
	};
})();