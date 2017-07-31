/* globals $ chrome */

var Roll = require('./roll.js');

window.onload = function () {
  var state = getBGState();
  var $el = $('body');
  var roll = new Roll(dice, state);
  if (state.rollOnLoad) {
    roll.roll(state.input);
    roll.render($el, true);
  } else {
    roll.render($el);
  }

  $el.on('submit', '#roll-form', function (e) {
    e.preventDefault();
    var input = $('#roll-input').val();
    roll.roll(input);
    roll.render($el, true);
  });

  saveState({ rollOnLoad: false });
};
