var repl = require("repl");

function eval(cmd, context, filename, callback) {
  callback(null, "not implemented: " + cmd);
}

repl.start({
  prompt: "👂 >",
  eval: eval
});