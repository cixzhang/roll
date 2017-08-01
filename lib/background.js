/*
 * roll
 * by Cindy Zhang
*/
/* globals chrome */

var Roll = require('./roll.js');

var RollState = new Roll({
  input: '1d20',
  entered: '1d20',
  command: null,
  error: null,
  result: null,
  intermediates: null,
});
window.RollState = RollState;

var suggestTimeout = null;
var suggestRolled = false;

// Omnibox
chrome.omnibox.setDefaultSuggestion({
  description: '<dim>Type some dice notation. Example: 1d20+5</dim>'
});
chrome.omnibox.onInputEntered.addListener(function (entered) {
  if (!suggestRolled) RollState.roll(entered);

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

var suggestTimeout = null;
chrome.omnibox.onInputChanged.addListener(function (entered, suggest) {
  clearTimeout(suggestTimeout);
  suggestRolled = false;
  suggest([{ content: `${entered} `, description: "Rolling..." }]);

  suggestTimeout = setTimeout(function () {
    RollState.roll(entered);
    suggestRolled = true;
    var result = RollState.state.result || RollState.state.error.message;
    suggest([{
      content: `${entered} `,
      description: `<match>${result}</match>`
    }]);
  }, 888);
});
