define([], function () {

    var Player = function (symbol) {

        symbol = symbol || null;
        if (typeof (symbol) !== 'string' || symbol.length !== 1) {
            throw 'Simbolul jucatorului nu poate fi decat un string de fix un caracter.';
        }

        this.symbol = symbol;
    };

    var fn = Player.prototype = {};

    fn.handleClick = function (tile, game) {
        throw new Error("Not implemented");
    };

    fn.handleTurn = function (game) {
        throw new Error("Not implemented");
    };

    return Player;
});
