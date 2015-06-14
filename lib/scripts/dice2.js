var Dice = function (rng) {
  // We can specify a custom random number generator (RNG)
  if (rng && typeof rng === 'function')
    this.random = rng;
};

// By default, the RNG is Math.random
Dice.prototype.random = Math.random;

/**
  * parse
  * -----
  * @param string
  *
  * Parse the string.
  * If the string is dice notation, return the result of the roll.
  * Else, throw an error.
  */
Dice.prototype.parse = function (string) {
  var i = 0;

  while (i < string.length) {
    // TODO
    i++;
  }
};


// DiceError object for parse errors.
var DiceError = function (offset, expected) {
  this.offset = offset;
  this.expected = expected;
  this.message = 'Dice failed to parse string.';
};
DiceError.prototype = Error.prototype;


// Export the Dice if we're using modules (which is the case for testing).
if (typeof module !== 'undefined' && module && module.exports)
  module.exports = Dice;
