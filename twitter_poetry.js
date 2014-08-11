var _ = require('lodash'),
    twitter = require('twitter'),
    apiKeys = require("./api_keys").keys;
var twit = new twitter(apiKeys);

var Hypher = require('hypher'),
    english = require('hyphenation.en-us'),
    h = new Hypher(english);

var hyphenate = function (word) {
  return h.hyphenate(word);
};
var Parser = require('parse-english'),
  parser = new Parser();

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
  tweetWords = tweet.split("/\s+/");
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

var options = {
  language: "en",
  filter_level: "medium",
  track: "baby,body,boys,girls,happy,heart,home,kiss,lonely,love,money,rain,sad,sexy,smile"
};
var allTweets = [{tweet: "My cousin is covered in blue", lastWord: "blue"}];
var rhyme = require('rhyme');
rhyme(function (r) {
  twit.stream('statuses/filter', options, function (stream) {
    stream.on('data', function (data) {
      if (data.text) {
        var tweet = cleanTweet(data.text);
        if (!tweet) {
          return;
        }
        var tweetSyllables = hyphenate(tweet).length;
        if (tweetSyllables < 10 || tweetSyllables > 16) {
          return;
        }
        var tweetWords = tweet.split(" ");
        var lastWord = tweetWords[tweetWords.length - 1];
        var lastWordRhymes = r.rhyme(lastWord);
        var rhymingTweet = _.find(allTweets, function (savedTweet) {
          return _.contains(lastWordRhymes, savedTweet.lastWord.toUpperCase());

        });
        if (rhymingTweet) {
          allTweets = _.without(allTweets, rhymingTweet);
          console.log(tweet);
          console.log(rhymingTweet.tweet);
        }
        allTweets.push({tweet: tweet, lastWord: lastWord});
      }
    });
  });
});
