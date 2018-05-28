define(['./PlayStrategy'], function (PlayStrategy) {

    var FirstEmptyPlayStrategy = function () {
        PlayStrategy.call(this);
    };

    var fn = FirstEmptyPlayStrategy.prototype = Object.create(PlayStrategy.prototype);
    fn.constructor = FirstEmptyPlayStrategy;

    fn.handleTurn = function (game, player) {
        return window.setTimeout(function () {

            if (game.getCurrentPlayer() !== player) {
                return;
            }

            var size = game.board.size;
            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    var tile = game.board.getTile(x, y);
                    if (!tile.isOccupied()) {
                        game.setPlayer(player, tile);
                        return;
                    }
                }
            }

            throw new Error("No free tile found!");
        }, 1000);
    };

    return FirstEmptyPlayStrategy;
});