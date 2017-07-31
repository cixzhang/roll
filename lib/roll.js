/* globals $ chrome Handlebars */
var dice = require('./dice/dice.js');

// Load template helpers and templates
require('./templates/helpers.js');
require('./templates/templates.js');

var Roll = function (dice, state) {
  this.$el = $('body');
  this.dice = dice;
  this.state = state;
  this.initialize();
  return this;
};

Roll.prototype.initialize = function () {
  this.$el.on('submit', '#roll-form', function (e) {
    e.preventDefault();
    var input = $('#roll-input').val();
    this.roll(input);
    this.render();
  }.bind(this));
};

Roll.prototype.roll = function (entered) {
  chrome.browserAction.setBadgeText({ text: '' });

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
  this.state.command = command;
  this.state.error = null;
  this.state.result = null;
  this.state.intermediates = null;

  // If there's still an error, display it.
  if (result instanceof Error) {
    this.setTitle(entered);
    this.state.error = this.getErrorMessage(result, input);
    chrome.browserAction.setBadgeText({ text: ' ' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#D16A6A' });
  } else {
  // Otherwise, store the command (if applicable) and show the results.
    if (command) localStorage.setItem(command, input);
    this.setTitle(entered + ' || ' + result);
    this.state.result = result;
    this.state.intermediates = this.dice.intermediates;
    chrome.browserAction.setBadgeText({ text: String(result) });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#799283' });
  }

  saveState(this.state);

  // Flash the module to show a change occurred.
  setTimeout(function () { $('section').addClass('changed'); }, 10);
  setTimeout(function () { $('section').removeClass('changed'); }, 200);
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
    var spaces = '';
    message = 'Expected one of the following: <em>' +
            error.expected.join('</em>, <em>') + '</em>' + '\n';

    for (var i = 0; i < error.offset; i++) spaces += ' ';

    message = message + '\t' + input.substr(0, error.offset) +
        '<strong>' + input.substr(error.offset) + '</strong>' +
        '\n\t' + spaces + '<strong>^</strong>';
  }

  return message;
};

Roll.prototype.render = function () {
  var data = this.state;
  var $el = this.$el;
  var mainTmp = Handlebars.templates._main;
  var resultTmp = Handlebars.templates._result;
  var errorTmp = Handlebars.templates._error;
  data.content = '';

  if (data.result) {
    data.content = resultTmp(data);
  } else if (data.error) {
    data.content = errorTmp(data);
  }

  $el.html(mainTmp(data));
};

function getBGState() {
  var bgPage = chrome.extension.getBackgroundPage();
  if (!bgPage) return {};
  return bgPage.Roll;
}

function saveState(state) {
  var bgRoll = getBGState();
  Object.assign(bgRoll, state);
}

window.onload = function () {
  var state = getBGState();
  var roll = new Roll(dice, state);
  if (state.rollOnLoad) {
    roll.roll(state.input);
  }
  roll.render();
  saveState({ rollOnLoad: false });
};
