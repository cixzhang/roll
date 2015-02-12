/*
 * roll
 * by Cindy Zhang
*/

var input = "";
// Omnibox
chrome.omnibox.setDefaultSuggestion({description: "<dim>Type some dice notation. Example: 1d20+5</dim>"});
chrome.omnibox.onInputEntered.addListener(
	function (entered) {
    input = entered;
		chrome.tabs.create({url: chrome.extension.getURL("roll.html")});
	}
);