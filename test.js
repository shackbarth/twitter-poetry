var gather = require("./lib/twitter_poetry").gatherVerse,
  creds = require("./api_keys").keys;

gather({creds: creds}, function (err, res) {
  console.log("done!", arguments);
});
