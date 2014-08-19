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

	function bool(AST) {
		if (AST.type === "Literal") return AST.value ? true : false;
		return true;
	}

	function number(AST) {
		if (AST.type === "Literal") return parseInt(AST.value);
		throw new Error("Cannot convert " + AST.type + " to a number");
	}

	function clone(AST) {
		return JSON.parse(JSON.stringify(AST));
	}

	function replace(AST, FL, TL) {
		if (AST.type === "Identifier") {
			for (var i = 0; i < FL.contents.length; i++) 
				if (FL.contents[i].name === AST.name) return clone(TL.contents[i]);

			return AST;
		}
		if (AST.type === "List") {
			for (var i = 0; i < AST.contents.length; i++)
				AST.contents[i] = replace(AST.contents[i], FL, TL);
			return AST;
		}
		
		return AST;
	}

	function substitute(FAST, AST) {
		if (FAST.type !== "Function")
			throw new Error("Cannot execute non-function");
		var arity = FAST.args.type === "List" ? FAST.args.contents.length : 1;
		if (arity !== AST.contents.length)
			throw new Error("Arity mismatch, should be " + arity + " but " + AST.contents.length + " is given");

		if (FAST.args.type !== "List")
			throw new Error("Non list functions are not implemented");

		var tree=clone(FAST.body);
		return replace(tree, FAST.args, AST);
	}

	function execute(AST) {
		if (AST.type === "Literal") return AST;
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
					return execute(substitute(context.functions[dd], tail(AST)));
				}
				throw new Error(AST.contents[0].name + " is undefined");
			}
			if (AST.contents[0].type === "List") {
				var tl = execute(AST.contents[0]);
				return execute(substitute(tl, tail(AST)));
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

	function print(AST) {
		if (AST.type === "Literal") return AST.value;
		if (AST.type === "Identifier") return AST.name;
		if (AST.type === "List") {
			var tl = ["("];
			for (var i=0;i<AST.contents.length; i++) tl.push(print(AST.contents[i]))
			tl.push(")");
			return template.encode(tl); 
		}
		if (AST.type === "Function") {
			return template.encode(["lambda", 
					AST.args.type === "List" ?  AST.args.contents.length : 1]);
		}
		return JSON.stringify(AST);
	}

	function run(text) {
		return print(execute(lex.parse(template.preprocess(text))));
	}

	function cleanContext() {
		context.functions = {};
	}

	context.bool = bool;
	context.number = number;
	context.execute = execute;
	context.functions = {};
	context.jsFunctions = stdlib.functions;

	return {
		cleanContext: cleanContext,
		run:run
	};
})();