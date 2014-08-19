module.exports = (function() {
	function check_ids(AST) {
		if (AST.type !== "List") 
			throw new Error("Non-list functions are not implemented yet");

		for (var i=0; i< AST.contents.length; i++)
			if (AST.contents[i].type !== "Identifier")
				throw new Error("Pattern matching is not implemented yet");

		return AST;
	}
	function defun(context, AST) {
		if (AST.contents.length !== 3) 
			throw new Error("You need exaclty three elements in a list to define function");
		if (AST.contents[0].type!="Identifier")
			throw new Error("First argument should be identifier");

		var Func = { 
			"type": "Function",
			"args": check_ids(AST.contents[1]), 
			"body": AST.contents[2]};

		context.functions[AST.contents[0].name] = Func;
		return Func;
	}

	function lambda(context, AST) {
		if (AST.contents.length !== 2)
			throw new Error("You need exaclty two elements in a list to define lambda");

		return { 
			"type": "Function",
			"args": check_ids(AST.contents[0]), 
			"body": AST.contents[1]};
	}

	function list(context, AST) {
		return AST;
	}

	function quote(context, AST) {
		return AST;		
	}

	function eval(context, AST) {
		return context.execute(AST);
	}

	function iff(context, AST) {
		if (AST.contents.length !== 3) 
			throw new Error("You need exaclty three elements (condition, then, else)");
		if (context.bool(context.execute(AST.contents[0])))
			return context.execute(AST.contents[1]);
		else
			return context.execute(AST.contents[2]);
	}

	function orr(context, AST) {
		for (var i=0;i<AST.contents.length; i++) {
			if (context.bool(context.execute(AST.contents[i]))) return true;
		}
		return false;
	}

	function equals(context, AST) {
		if (AST.contents.length < 1) return true;
		var val = context.execute(AST.contents[0]);
		for (var i=1;i<AST.contents.length; i++) {
			if (context.execute(AST.contents[i])!== val) return false;
		}
		return true;
	}

	function morethan(context, AST) {
		if (AST.contents.length !== 2)
			throw new Error("You need exaclty two elements to compare");
		return {
			type:"Literal",
			value:(context.number(context.execute(AST.contents[0])) > 
			context.number(context.execute(AST.contents[1])) ? 1 : 0)
		};
	}

	function lessthan(context, AST) {
		if (AST.contents.length !== 2)
			throw new Error("You need exaclty two elements to compare");
		return {
			type:"Literal",
			value:(context.number(context.execute(AST.contents[0])) <
			context.number(context.execute(AST.contents[1])) ? 1 : 0)
		};
	}

	function minus(context, AST) {
		if (AST.contents.length !== 2)
			throw new Error("You need exaclty two elements for minus");
		return {
			type:"Literal",
			value:(context.number(context.execute(AST.contents[0])) - 
			context.number(context.execute(AST.contents[1])))
		};
	}

	function plus(context, AST) {
		if (AST.contents.length !== 2)
			throw new Error("You need exaclty two elements for plus");
		return {
			type:"Literal",
			value:(context.number(context.execute(AST.contents[0])) +
			context.number(context.execute(AST.contents[1])))
		};
	}

	function car(context, AST) {
		if (AST.contents.length !== 1)
			throw new Error("You need exactly one element for car");
		var rl = context.execute(AST.contents[0]);
		if (rl.type !== "List")
			throw new Error("Car argument should be list, but " + rl.type + " is given");

		return rl.contents[0];
	}

	function cdr(context, AST) {
		if (AST.contents.length !== 1)
			throw new Error("You need exaclty one element for cdr");
		var rl = context.execute(AST.contents[0]);
		if (rl.type !== "List")
			throw new Error("Cdr argument should be list, but " + rl.type + " is given");

		return rl.contents[rl.contents.length - 1];
	}

	return {
		"functions":{
			"defun": defun,
			"lambda": lambda,
			"list": list,
			"quote": quote,
			"eval": eval,
			"if": iff,
			"or": orr,
			"equals": equals,
			"morethan": morethan,
			"lessthan": lessthan,
			"minus": minus,
			"plus": plus,
			"car": car,
			"cdr": cdr
		}}
})();