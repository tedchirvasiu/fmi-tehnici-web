define([], function () {

    var WinStrategy = function () { };

    var fn = WinStrategy.prototype = {};

    fn.evaluateBoard = function (board) {
        throw new Error("Not implemented");
    };

    fn.result = function (state, winner, winningTiles) {
        //State in ["going", "win", "draw"]
        return {
            state: state,
            winner: winner,
            winningTiles: winningTiles
        };
    };

    return WinStrategy;
});
