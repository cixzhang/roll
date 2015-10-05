var dice = require('../dice/dice.js');

Handlebars.registerHelper('list-intermediates', function (items, options) {
  var out = '',
      keys = Object.keys(items);

  keys.forEach(function (key, index) {
    var item = items[key];
    out += '<li class="d' + Number(index + 1) + '">';
    out += '<span>d' + item.d + ': </span>';
    out += '<span>' + item.rolls.join(', ') + '</span>';
    out += '</li>';
  });

  return out;
});
