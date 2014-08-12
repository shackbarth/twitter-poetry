var gather = require("./lib/twitter_poetry").gatherVerse,//.buildVerseFromInput,
  creds = require("./api_keys").keys,
  line = "I'm a cowboy, on a steel horse I ride";

gather({creds: creds, input: line}, function (err, res) {
  console.log("done!", arguments);
});
