/* globals chrome */
var Roll = require('./roll.js');

function getState(callback) {
  chrome.storage.local.get(['state']).then((result) => {
    if (result != null && result.state != null) {
      return callback(Roll.fromJSON(result.state));
    }
    return callback(undefined);
  });
}

module.exports = {
  getState,
};
