var adaptor = require("../pop-music-generator/lib/adaptor");

var lyrics = [
  "Foo foo foo foo foo foo foo foo",
  "Foo foo foo foo foo foo foo foo",
  "Foo foo foo foo foo foo foo foo",
  "Foo foo foo foo foo foo foo foo"
];
var baseRhythm = [
  [15],
  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
  [0, 1, 2, 3, 4, 5, 15],
  [0, 1, 2, 12, 14]
];

var baseMelody = [
  [10],
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
  [1, 2, 3, 4, 5, 6, 7],
  [1, 2, 3, 4, 5]
];


console.log(adaptor.getAdaptedVerse(lyrics, baseRhythm, baseMelody));
