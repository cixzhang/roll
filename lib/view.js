/* globals $ chrome */

var getState = require('./state.js').getState;

// Load template helpers and templates
require('./templates/helpers.js');
require('./templates/templates.js');

window.onload = function () {
  var $el = $('body');
  getState(function (roll) {
    render($el, roll);
    console.log('ROLL', roll);

    $el.on('submit', '#roll-form', function (e) {
      e.preventDefault();
      var input = $('#roll-input').val();
      roll.roll(input);
      render($el, roll, true);
    });
  });
};

function render($el, roll, willFlash) {
  var data = roll.state;
  var title = data.entered;
  var mainTmp = Handlebars.templates._main;
  var resultTmp = Handlebars.templates._result;
  var errorTmp = Handlebars.templates._error;

  var content = '';

  chrome.action.setBadgeText({ text: '' });
  if (data.result) {
    content = resultTmp({
      result: data.result,
      intermediates: data.intermediates
    });
    title = title + ' || ' + data.result;
    chrome.action.setBadgeText({ text: String(data.result) });
    chrome.action.setBadgeBackgroundColor({ color: '#BFD4C7' });
  } else if (data.error) {
    content = errorTmp({
      input: data.input,
      error: getErrorMessage(roll, data.error, data.input)
    });
    chrome.action.setBadgeText({ text: ' ' });
    chrome.action.setBadgeBackgroundColor({ color: '#D16A6A' });
  }

  $el.html(mainTmp({
    error: data.error,
    input: data.input,
    command: data.command,
    content: content
  }));
  $('#roll-input').focus();

  setTitle(title);

  if (willFlash) {
    // Flash the module to show a change occurred.
    setTimeout(function () { $('section').addClass('changed'); }, 10);
    setTimeout(function () { $('section').removeClass('changed'); }, 200);
  }
}

function setTitle(text) {
  $('title').html('roll ' + text);
}

function getErrorMessage(roll, error, input) {
  var message = error.message;

  if (error instanceof roll.dice.SyntaxError) {
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
