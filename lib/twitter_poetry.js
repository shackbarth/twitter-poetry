(function () {
  "use strict";
  var _ = require('lodash'),
    twitter = require('twitter'),
    cleanTweet = require("./clean_tweet").cleanTweet;
  var rhyme = require('rhyme');


  var Hypher = require('hypher'),
    english = require('hyphenation.en-us'),
    h = new Hypher(english);

  var hyphenate = function (word) {
    return h.hyphenate(word);
  };
  var phraseSyllables = function (phrase) {
    return _.reduce(phrase.split(/\s+/), function (memo, word) {
      return memo = memo + hyphenate(word).length;
    }, 0);
  };

  var gatherVerse = function (options, callback) {
    options.verseLimit = options.verseLimit || 4;
    var twitterOptions = {
      language: "en",
      filter_level: "medium",
      track: "baby,body,boys,girls,happy,heart,home,kiss,lonely,love,money,rain,sad,sexy,smile"
    };
    var twit = new twitter(options.creds);

    var allTweets = [];
    rhyme(function (r) {
      var foo = twit.stream(twitterOptions.track ? 'statuses/filter' : 'statuses/sample', twitterOptions, function (stream) {
        stream.on('data', function (data) {
          if (data.text) {
            var tweet = cleanTweet(data.text);
            if (!tweet) {
              return;
            }
            var tweetSyllables = phraseSyllables(tweet);
            if (tweetSyllables < 16 || tweetSyllables > 20) {
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
            } else {
              allTweets.push({tweet: tweet, lastWord: lastWord});
            }
          }
        });
      });
    });


  };

  exports.gatherVerse = gatherVerse;

}());
