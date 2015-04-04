var fs = require("fs");
var http = require("http");
var nopt = require("nopt");
var main = require("./main");
var yaml = require("js-yaml");

var configs, options;

function help() {
  var out = [
    "Usage: node-push-to-deploy [-p port] config-file1 [config-file2 ...]",
    "",
    "General options:",
    "  -h, --help              # Print options and usage.",
    "  -p, --port              # Set listening port (default 8000).",
    ""
  ];

  return out.join("\n");
}

options = nopt({
  port: String
}, {
  h: "--help",
  p: "--port"
});

configs = options.argv.remain;

module.exports = function() {
  if (options.help) {
    help();
    process.exit(0);
  }

  if (!configs.length) {
    console.error("Missing config file.\n");
    help();
    process.exit(1);
  }

  try {
    configs = configs.map(function(config) {
      if (/yml$/i.test(config)) {
        return yaml.safeLoad(fs.readFileSync(config, "utf8"));
      } else if (/json$/i.test(config)) {
        return JSON.parse(fs.readFileSync(config, "utf8"));
      } else {
        throw new Error("Unsupported extension `" + config + "`. Supported JSON or YAML.");
      }
    });
  } catch(error) {
    console.error(error, error.stack);
    process.exit(1);
  }

  main(configs, options);
};
