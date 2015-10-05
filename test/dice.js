MersenneTwister = require('../lib/scripts/mersenne-twister.js');

var expect = require('chai').expect,
    Dice = require('../lib/scripts/dice');

describe('a dice parser', function () {

  it('can parse dice notation', function () {
    var result = Dice.parse('1d20');
    expect(result).to.be.a('number');
  });

  it('can perform addition/substraction after a roll', function () {
    var result = Dice.parse('1d20+4');
    expect(result).to.be.a('number');
  });

  it('can perform multiple rolls', function () {
    var result = Dice.parse('1d20+2d4');
    expect(result).to.be.a('number');
  });

  it('can parse fudge dice', function () {
    var result = Dice.parse('1d20+4df');
    expect(result).to.be.a('number');
  });

  it('throws errors when not given dice notation', function () {
    var fn = function () { Dice.parse('asdf'); };
    expect(fn).to.throw(Error);
  });
});
