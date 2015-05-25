;(function () {

  var Roll = function (dice, input) {
    this.dice = dice;
    this.roll(input);
    return this;
  };

  Roll.prototype.roll = function (entered) {
    this.setTitle(entered);

    // First, try parsing without spaces
    var words = entered.split(' '),
        input = words.join(''),
        result = this.parse(input),
        command, commandInput;

    if (result instanceof Error) {
      command = words.length > 1 ? words.pop() : '';
      input = words.join('');

      // If the input is one word, check if it's a command.
      if (!command) {
        command = input;
        commandInput = localStorage.getItem(command);
        // Swap with the stored input if the command was stored.
        if (commandInput) input = commandInput;
      }

      result = this.parse(input);
    }

    // If there's still an error, display it.
    if (result instanceof Error) {
      this.displayError(result, input);
    } else {
    // Otherwise, store the command (if applicable) and show the results.
      if (command) localStorage.setItem(command, input);
      this.setInput(input, command);
      this.setResult(result, this.dice.intermediates);
    }
  };

  Roll.prototype.parse = function (input) {
    try {
      var result = this.dice.parse(input);
      return result;
    } catch (e) {
      return e;
    }
  };

  Roll.prototype.setTitle = function (text) { $('title').html('Roll ' + text); };

  Roll.prototype.setInput = function (input, command) {
    $('#input').html(input);
    if (command) $('#input').prev().html('roll ' + command + ':');
  };

  Roll.prototype.setResult = function (result, intermediates) {
    $('#result').html(result);
    if (Object.keys(intermediates).length > 0) {
      var $intermediates = $('#intermediates').html(''), i = 1;
      $.each(intermediates, function (key, intermediate) {
        $intermediates.append(this.intermediateTemplate(intermediate, i++));
      }.bind(this));
    }
  };

  Roll.prototype.displayError = function (e, input) {
    var $message = $('<header>').html('Sorry, Roll didn\'t understand <strong>' + input + '</strong>.'),
        $output = $('<pre>').html(e.message);

    if (e instanceof dice.SyntaxError) {
      var spaces = '',
          message = 'Expected one of the following: <em>' + e.expected.join('</em>, <em>') + '</em>' + '\n';
      for (var i = 0; i < e.offset; i++) spaces = spaces + ' ';
      message = message + '\t' + input.substr(0, e.offset) + '<strong>' + input.substr(e.offset) + '</strong>' +
          '\n\t' + spaces + '<strong>^</strong>';
      $output.html(message);
    }
    $('section').addClass('error').html($message).append($output);
  };

  Roll.prototype.intermediateTemplate = function (intermediate, index) {
    var $item = $('<li></li>').addClass('d' + index),
      $rolls = $('<span></span>'),
      $d = $('<span></span>').append('d' + intermediate.d + ': ');
    
    $.each(intermediate.rolls, function (i, roll) {
      $rolls.append(roll + (i < (intermediate.rolls.length - 1) ? ', ' : ''));
    });
    
    $item.append($d);
    $item.append($rolls);
    return $item;
  };

  window.onload = function () {
    new Roll(dice, chrome.extension.getBackgroundPage().input);
    return;
  };
})();
