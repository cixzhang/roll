;(function () {

	var Roll = function (dice, input, el) {
		this.dice = dice;
		this.$el = el ? $(el) : $('body');
		this.$ = this.$el.find.bind(this.$el);

		this.roll(input);
		return this;
	};

	Roll.prototype.roll = function (entered) {
		var words = entered.split(' '),
				command = words.length > 1 ? words.pop() : '',
				input = words.join(''),
				result = this.parse(input);

		this.setTitle(entered);

		if (result instanceof Error && !command) { // command
			command = input;
	    input = localStorage.getItem(command);
	    if (input) result = this.parse(input);
		}

		if (result instanceof Error) {
			this.displayError(result, input);
		} else {
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

	Roll.prototype.setTitle = function (text) { this.$('title').html('Roll ' + text); };

	Roll.prototype.setInput = function (input, command) {
		this.$('#input').html(input);
		if (command) this.$('#input').append($('<strong>').html(command));
	};

	Roll.prototype.setResult = function (result, intermediates) {
		this.$('#result').html(result);
		if (Object.keys(intermediates).length > 0) {
			var $intermediates = this.$('#intermediates').html(''), i = 1;
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
		this.$('section').addClass('error').html($message).append($output);
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
		var input = chrome.extension.getBackgroundPage().input;
		var roll = new Roll(dice, input);
		return;
	};
})();
