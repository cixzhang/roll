/*
 * roll
 * by Cindy Zhang
*/

var Roll = {};
// Omnibox
chrome.omnibox.setDefaultSuggestion({
  description: "<dim>Type some dice notation. Example: 1d20+5</dim>"
});
chrome.omnibox.onInputEntered.addListener(
  function (entered) {
    Roll.input = entered;

    var tabProps = {url: chrome.extension.getURL("roll.html")};
    var tabQuery = {active: true, currentWindow: true};
    chrome.tabs.query(tabQuery, function (tabs) {
      if (tabs.length) {
        var tab = tabs[0];
        chrome.tabs.update(tab.id, tabProps)
      }
      else
        chrome.tabs.create(tabProps);
    });
  }
);
