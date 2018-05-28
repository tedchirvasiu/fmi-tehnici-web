define(['./Player'], function (Player) {

    var Human = function (symbol) {
        Player.call(this, symbol);
    };

    var fn = Human.prototype = Object.create(Player.prototype);
    fn.constructor = Human;

    fn.handleClick = function (tile, game) {
        game.setPlayer(this, tile);
    };

    fn.handleTurn = function (game) { /*noop*/ };

    return Human;
});