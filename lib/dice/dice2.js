var parseLibrary = [
  {
    name: 'number',
    test: function (s) { return /^[0-9]/.test(s); },
    greedy: true
  },
  {
    name: '()'
  },
  {
    name: 'd',
    op: function (left, right, offset, random, store) {
      var result = 0, roll;
      for (var i = 0; i < left; i++) {
        if (right === 'F' || right === 'f') roll = Math.ceil(random() * 3) - 2;
        else roll = Math.ceil(random() * right);
        store(offset, right, roll);
        result += roll;
      }
      return result;
    }
  },
  {
    name: '*',
    test: function (s) { return s === '*'; },
    op: function (left, right) {
      return left * right;
    }
  },
  {
    name: '/',
    test: function (s) { return s === '/'; },
    op: function (left, right) {
      return left / right;
    }
  },
  {
    name: '+',
    test: function (s) { return s === '+'; },
    op: function (left, right) {
      return left + right;
    }
  },
  {
    name: '-',
    test: function (s) { return s === '-'; },
    op: function (left, right) {
      return left - right;
    }
  }
];

var Dice = function (rng) {
  // We can specify a custom random number generator (RNG)
  if (rng && typeof rng === 'function')
    this.random = rng;
  // Intermediates for extra insight into dice rolls.
  this.intermediates = {};
};

// By default, the RNG is Math.random
Dice.prototype.random = Math.random;

/**
  * parse
  * -------------
  * @param string
  *
  * Parse the string.
  * If the string is dice notation, return the result of the roll.
  * Else, throw an error.
  */
Dice.prototype.parse = function (input) {

  // Convert input into an array.
  var input = input.split('');

  while (input.length) {
    var c = input.shift();
    // TODO;
  }
};

/**
  * getIntermediates
  * -------------
  * Returns dice roll intermediates for the latest parse.
  */
Dice.prototype.getIntermediates = function () {
  return this.intermediates;
}

/**
  * setIntermediate
  * ---------------
  * @param offset
  * @param dice
  * @param roll
  *
  * Stores dice roll intermediate results at a parsed offset.
  */
Dice.prototype.setIntermediate = function (offset, dice, roll) {
  if (!this.intermediates[offset])
    this.intermediates[offset] = {d: dice, rolls: []};
  this.intermediates[offset].rolls.push(roll);
  return this.intermediates[offset];
}


// DiceError object for parse errors.
var DiceError = function (input, offset, expected) {
  this.name = 'DiceError';

  this.input = input;
  this.offset = offset;
  this.expected = expected;

  this.message = 'Dice failed to parse ' + input + ' at character ' + offset + '. ';
  this.message += 'Expected: ' + this.expected.join(' or ') + '.';
};
DiceError.prototype = Object.create(Error.prototype);
DiceError.prototype.constructor = DiceError;


// Export the Dice if we're using modules (which is the case for testing).
if (typeof module !== 'undefined' && module && module.exports)
  module.exports = Dice;
