/* globals chrome */

function getState(callback) {
  chrome.runtime.getBackgroundPage(function (bgPage) {
    callback(bgPage.RollState);
  });
}

module.exports = {
  getState,
};
