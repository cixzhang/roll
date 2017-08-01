/* globals $ chrome Handlebars */
var dice = require('./dice/dice.js');

var Roll = function (state) {
  this.dice = dice;
  this.state = state;
  return this;
};

Roll.prototype.roll = function (entered) {
  // First, try parsing without spaces
  var words = entered.split(' '),
      input = words.join(''),
      result = this.parse(input),
      command, commandInput;

  if (result instanceof Error) {
    command = words.length > 1 ? words.pop() : '';
    input = words.join('');

    // If the input is one word, check if it's a command.
    if (!command) {
      command = input;
      commandInput = localStorage.getItem(command);
      // Swap with the stored input if the command was stored.
      if (commandInput) input = commandInput;
    }

    result = this.parse(input);
  }

  this.state.input = input;
  this.state.entered = entered;
  this.state.command = command;
  this.state.error = null;
  this.state.result = null;
  this.state.intermediates = null;

  // If there's still an error, display it.
  if (result instanceof Error) {
    this.state.error = result;
  } else {
  // Otherwise, store the command (if applicable) and show the results.
    if (command) localStorage.setItem(command, input);
    this.state.result = result;
    this.state.intermediates = this.dice.intermediates;
  }
};

Roll.prototype.parse = function (input) {
  try {
    var result = this.dice.parse(input);
    return result;
  } catch (error) {
    return error;
  }
};

module.exports = Roll;
