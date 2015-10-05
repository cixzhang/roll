var dice = require('./dice/dice.js');

// Load template helpers and templates
require('./templates/helpers.js');
require('./templates/templates.js');

var Roll = function (dice, input) {
  this.$el = $('body');
  this.dice = dice;
  this.roll(input);
  this.initialize();
  return this;
};

Roll.prototype.initialize = function () {
  this.$el.on('submit', '#roll-form', function (e) {
    e.preventDefault();
    var input = $('#roll-input').val();
    this.roll(input);
  }.bind(this));
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

  // If there's still an error, display it.
  if (result instanceof Error) {
    this.setTitle(entered);
    this.render({
      input: input,
      command: command,
      error: this.getErrorMessage(result, input)
    });
  } else {
  // Otherwise, store the command (if applicable) and show the results.
    if (command) localStorage.setItem(command, input);
    this.setTitle(entered + ' || ' + result);
    this.render({
      input: input,
      command: command,
      result: result,
      intermediates: this.dice.intermediates
    });
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

Roll.prototype.setTitle = function (text) { $('title').html('roll ' + text); };

Roll.prototype.getErrorMessage = function (error, input) {
  var message = error.message;

  if (error instanceof dice.SyntaxError) {
    var spaces = '',
        message = 'Expected one of the following: <em>' +
            error.expected.join('</em>, <em>') + '</em>' + '\n';

    for (var i = 0; i < error.offset; i++) spaces += ' ';

    message = message + '\t' + input.substr(0, error.offset) +
        '<strong>' + input.substr(error.offset) + '</strong>' +
        '\n\t' + spaces + '<strong>^</strong>';
  }

  return message;
};

Roll.prototype.render = function (data) {
  var $el = this.$el;
  var main = Handlebars.templates._main;
  var result = Handlebars.templates._result;

  if (data.error)
    result = Handlebars.templates._error;

  data.content = result(data);
  $el.html(main(data));

  // Flash the module to show a change occurred.
  setTimeout(function () { $('section').removeClass('changed'); }, 200);
};

window.onload = function () {
  new Roll(dice, chrome.extension.getBackgroundPage().input);
  return;
};
