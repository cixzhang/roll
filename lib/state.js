/* globals chrome */

function getState() {
  var bgPage = chrome.extension.getBackgroundPage();
  if (!bgPage) return {};
  return bgPage.RollState;
}

module.exports = {
  getState,
};
