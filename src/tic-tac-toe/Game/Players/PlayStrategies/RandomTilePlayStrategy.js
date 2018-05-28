define(['./PlayStrategy'], function (PlayStrategy) {

    var RandomTilePlayStrategy = function () {
        PlayStrategy.call(this);
    };

    var fn = RandomTilePlayStrategy.prototype = Object.create(PlayStrategy.prototype);
    fn.constructor = RandomTilePlayStrategy;

    fn.handleTurn = function (game, player) {
        return window.setTimeout(function () {
            
            if (game.getCurrentPlayer() !== player) {
                return;
            }

            var size = game.board.size;
            var emptyTiles = [];

            for (var x = 0; x < size; x++) {
                for (var y = 0; y < size; y++) {
                    var tile = game.board.getTile(x, y);
                    if (!tile.isOccupied()) {
                        emptyTiles.push(tile);
                    }
                }
            }
            
            if (emptyTiles.length === 0) {
                throw new Error("No free tile found!");
            }

            var randomIndex = Math.floor(Math.random() * emptyTiles.length);

            var tile = emptyTiles[randomIndex];
            game.setPlayer(player, tile);
        }, 1000);
    };

    return RandomTilePlayStrategy;
});