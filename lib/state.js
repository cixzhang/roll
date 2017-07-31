/* globals chrome */

function getBGState() {
  var bgPage = chrome.extension.getBackgroundPage();
  if (!bgPage) return {};
  return bgPage.RollState;
}

function saveState(state) {
  var bgRoll = getBGState();
  Object.assign(bgRoll, state);
}

module.exports = {
    getBGState,
    saveState,
};
