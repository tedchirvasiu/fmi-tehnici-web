define([], function () {

	var PlayStrategy = function () {};

    var fn = PlayStrategy.prototype = {};

	fn.handleTurn = function (game, player) {
		throw new Error("Not implemented");
	};

	return PlayStrategy;
});
