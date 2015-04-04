var exec = require("child_process").exec;
var http = require("http");
var Notifier = require("git-notifier").Notifier;

function alwaysArray(arrayOrSomethingElse) {
  if (Array.isArray(arrayOrSomethingElse)) {
    return arrayOrSomethingElse;
  }
  return [arrayOrSomethingElse];
}

var notifier = new Notifier();
var server = http.createServer();
server.on("request", notifier.handler);

module.exports = function(configs, options) {
  var port;
  options = options || {};
  port = options.port || 8000;

  server.listen(port);
  console.log("Push-to-deploy server up and running on port `" + port + "`.");

  configs.forEach(function(config) {
    Object.keys(config).forEach(function(eventName) {
      var commandsTpl = alwaysArray(config[eventName]).join(";");
      var eventFn = function(data) {
        var commands;
        try {
          commands = commandsTpl.replace(/{{([^}]+)}}/g, function(match, key) {
            if (!(key in data)) {
              throw new Error("Could not replace `" + key + "` of `\"" + commandsTpl + "\"` on " +
                eventName + " " + JSON.stringify(data));
            }
            return data[key];
          });
        } catch(error) {
          console.error(error);
          return;
        }
        exec(commands, function(error, stdout, stderr) {
          console.log(stdout);
          console.error(stderr);
        });
      };

      notifier.on(eventName, eventFn);
    });
  });

  notifier.on("**", function(data) {
    var state = notifier.listeners(this.event).length === 1 ? "(ignored)" : "(processed)";
    console.log("##", this.event, state);
  });
};
