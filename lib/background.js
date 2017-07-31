/*
 * roll
 * by Cindy Zhang
*/
/* globals chrome */

var Roll = require('./roll.js');

var RollState = {
  rollOnLoad: false,
  input: '1d20',
  command: null,
  error: null,
  result: null,
  intermediates: null,
};

// Omnibox
chrome.omnibox.setDefaultSuggestion({
  description: '<dim>Type some dice notation. Example: 1d20+5</dim>'
});
chrome.omnibox.onInputEntered.addListener(function (entered) {
  RollState.input = entered;
  RollState.rollOnLoad = true;

  var tabProps = {url: chrome.extension.getURL('roll.html')};
  var tabQuery = {active: true, currentWindow: true};
  chrome.tabs.query(tabQuery, function (tabs) {
    if (tabs.length) {
      var tab = tabs[0];
      chrome.tabs.update(tab.id, tabProps);
    }
    else
      chrome.tabs.create(tabProps);
  });
});
chrome.omnibox.onInputChanged.addListener(function (text, suggest) {
  // TODO: roll if user pauses at suggestions
  // TODO: separate rendering from Roll to reduce size of background.js
  // TODO: display errors in onInputChanged
});
