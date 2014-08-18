var repl = require("repl");
var interpreter = require("./lib/interpreter.js");

function eval(cmd, context, filename, callback) {
  cmd = cmd.replace(/[()]*/g, "");

  if (!cmd.trim()) {
  	callback(null);
  	return;
  }

  try {
  	R = interpreter.run(cmd);
  	callback(null, JSON.stringify(R));
  } catch (E) {
  	callback(null, "Error: " + (E.message? E.message: JSON.stringify(E)));
  }
}

repl.start({
  prompt: "👂 >",
  eval: eval
});