define(['./Player', './PlayStrategies/RandomTilePlayStrategy'], function (Player, RandomTilePlayStrategy) {

    var AI = function (symbol, strategy) {
        Player.call(this, symbol);

        this.strategy = strategy || new RandomTilePlayStrategy();
    };

    var fn = AI.prototype = Object.create(Player.prototype);
    fn.constructor = AI;

    fn.handleClick = function (tile, game) {
        alert("Nu deranja calculatorul! Gandeste...")
    };

    fn.handleTurn = function (game) {
        return this.strategy.handleTurn(game, this);
    };

    return AI;
});