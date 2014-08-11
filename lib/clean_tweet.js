(function () {
  "use strict";
  var isJunk = function (s) {
    return !s ||
      s.indexOf("RT") === 0 || // TODO: word is junk vs phrase is junk
      s.indexOf("http") >= 0 ||
      s.indexOf("@") >= 0 ||
      s.indexOf("#") >= 0 ||
      s.indexOf("\n") >= 0 ||
      s.indexOf("…") >= 0 ||
      !/^[\x00-\x7F]*$/.test(s);
  }
  var cleanTweet = function (tweet) {
    var tweetWords = tweet.split("/\s+/");
    while(true) {
      if (!tweetWords[0]) {
        //console.log("rejected to 0", tweet);
        return false;
      }
      if (isJunk(tweetWords[0])) {
        tweetWords.splice(0, 1);
      } else {
        break;
      }
    }
    while(true) {
      var lastWord = tweetWords[tweetWords.length - 1];
      if (!lastWord) {
        //console.log("rejected to 0", tweet);
        return false;
      }
      if (isJunk(lastWord)) {
        tweetWords.splice(tweetWords.length - 1, 1);
      } else {
        break;
      }
    }
    var cleanedTweet = tweetWords.join(" ");
    if (isJunk(cleanedTweet)) {
      return false;
    }
    return cleanedTweet;
  };

  exports.cleanTweet = cleanTweet;
}());
