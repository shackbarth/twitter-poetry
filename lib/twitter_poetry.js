(function () {
  "use strict";
  var _ = require('lodash'),
    moby = require("moby"),
    rhyme = require('rhyme'),
    twitter = require('twitter'),
    cleanTweet = require("./clean_tweet").cleanTweet;


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

  var buildVerseFromInput = function (options, callback) {
    var twit = new twitter(options.creds),
      allTweets = [],
      verses = [],
      log = options.log || console.log,
      twitterOptions = {
        language: "en",
        filter_level: "medium",
        track: "baby,body,boys,girls,happy,heart,home,kiss,lonely,love,money,rain,sad,sexy,smile"
      };


    log("Input is " + options.input);
    log("Input has " + phraseSyllables(options.input) + " syllables");

    var lastWord = options.input.split(" ")[options.input.split(" ").length - 1];
    log("Last word is " + lastWord);


    //var synonyms = moby.search(lastWord);
    console.log(synonyms);
    rhyme(function (r) {
      var rhymes = r.rhyme(lastWord);
      log("Rhymes are " + rhymes.join(", "));
      //twitterOptions.track = synonyms.join(",");
      twit.stream(twitterOptions.track ? 'statuses/filter' : 'statuses/sample', twitterOptions, function (stream) {
        stream.on('data', function (data) {
          if (data.text) {
            var tweet = cleanTweet(data.text);
            if (!tweet) {
              return;
            }
            console.log(tweet);
          }
        });
      });

    });
  };

  var getMidpointSpaceIndex = function (phrase) {
    for (var i = phrase.length / 2; i < phrase.length; i++) {
      if (phrase.charAt(i) === " ") {
        return i;
      }
    }
    return 0;
  };

  var boringWords = ["i'm", "a", "on", "i"];

  var gatherVerse = function (options, callback) {
    var twit = new twitter(options.creds),
      allTweets = [],
      verses = [],
      log = options.log || console.log,
      twitterOptions = {
        language: "en",
        filter_level: "medium",
        track: "baby,body,boys,girls,happy,heart,home,kiss,lonely,love,money,rain,sad,sexy,smile"
      };

    options.verseLimit = options.verseLimit || 4;
    //var inputWords = options.input.split(" ");
    //inputWords = _.filter(inputWords, function (word) {
    //  return !_.contains(boringWords, word.toLowerCase());
    //});
    //var synonyms = _.flatten(_.map(inputWords, moby.search));
    //console.log("inputWords", inputWords);
    //console.log("syn", synonyms);
    //twitterOptions.track = synonyms.join(",");
    log("Ok here we go");
    rhyme(function (r) {
      twit.stream(twitterOptions.track ? 'statuses/filter' : 'statuses/sample', twitterOptions, function (stream) {
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
              log(tweet);
              log(rhymingTweet.tweet);
              allTweets = _.without(allTweets, rhymingTweet);
              verses.push([
                tweet.substring(0, getMidpointSpaceIndex(tweet)),
                tweet.substring(1 + getMidpointSpaceIndex(tweet)),
                rhymingTweet.tweet.substring(0, getMidpointSpaceIndex(rhymingTweet.tweet)),
                rhymingTweet.tweet.substring(1 + getMidpointSpaceIndex(rhymingTweet.tweet))
              ]);
              if (verses.length >= options.verseLimit) {
                stream.destroy();
                return callback(null, verses);
              }
            } else {
              allTweets.push({tweet: tweet, lastWord: lastWord});
            }
          }
        });
      });
    });


  };

  exports.buildVerseFromInput = buildVerseFromInput;
  exports.gatherVerse = gatherVerse;

}());
