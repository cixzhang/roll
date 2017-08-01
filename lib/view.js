/* globals $ chrome */

var getState = require('./state.js').getState;

// Load template helpers and templates
require('./templates/helpers.js');
require('./templates/templates.js');

window.onload = function () {
  var $el = $('body');
  var roll = getState();
  render($el, roll.state);

  $el.on('submit', '#roll-form', function (e) {
    e.preventDefault();
    var input = $('#roll-input').val();
    roll.roll(input);
    render($el, roll.state, true);
  });
};

function render($el, data, willFlash) {
  var title = data.entered;
  var mainTmp = Handlebars.templates._main;
  var resultTmp = Handlebars.templates._result;
  var errorTmp = Handlebars.templates._error;

  var content = '';

  chrome.browserAction.setBadgeText({ text: '' });
  if (data.result) {
    content = resultTmp({
      result: data.result,
      intermediates: data.intermediates
    });
    title = title + ' || ' + data.result;
    chrome.browserAction.setBadgeText({ text: String(data.result) });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#799283' });
  } else if (data.error) {
    content = errorTmp({ error: getErrorMessage(data.error, data.input) });
    chrome.browserAction.setBadgeText({ text: ' ' });
    chrome.browserAction.setBadgeBackgroundColor({ color: '#D16A6A' });
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

function getErrorMessage(error, input) {
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
