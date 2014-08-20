var buster = require("buster");
var assert = buster.referee.assert;
var interpreter = require("../lib/interpreter.js");
var template = require("../lib/template.js");

buster.testCase("Template tests", {
    "compile and run all tests described by templates": function () {
	    var examples = require("../templates/stdlib.json");
	    for (var j = 0; j< examples.length; j++) {
	    	if (examples[j].result) {
		        var prog = template.encode(examples[j].program);
		        assert.equals(interpreter.run(prog), examples[j].result, examples[j].name);
		    }
		    if (examples[j].tests) {
		    	for (var k = 0; k < examples[j].tests.length; k++) {
		    		var prog = template.encode(
		    					examples[j].program.concat( 
		    					examples[j].tests[k].program));
			        assert.equals(interpreter.run(prog), 
			        	examples[j].tests[k].result, examples[j].name + " case #" + k);
		    	}
		    }
	    }
    }
});
