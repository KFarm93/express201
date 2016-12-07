var _ = require('lodash');
var myArray = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];
var shuffledArray = _.shuffle(myArray);
joinedArray = shuffledArray.join();
final = joinedArray.replace(/,/g, ".");
console.log(final);
