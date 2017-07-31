/* globals chrome */

window.onload = function onLoad() {
  var storageArea = chrome.storage.local;
  var alwaysPopup = document.getElementById('always_popup');
  var submit = document.getElementById('submit');
  var status = document.getElementById('status');

  function save_options() {
    storageArea.set({ alwaysPopup: alwaysPopup.checked });
    status.innerHTML = 'Saved!';
  }

  submit.addEventListener('click', save_options);
  storageArea.get('alwaysPopup', function(value) {
    alwaysPopup.checked = value;
  });
};
