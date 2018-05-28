define(['./WinStrategy'], function (WinStrategy) {

    //Pentru a castiga, un jucator trebuie sa aiba o coloana intreaga, o linie intreaga sau diagonala principala / secundara complet ocupata
    var FullLineWinStrategy = function () {
        WinStrategy.call(this);
    };

    var fn = FullLineWinStrategy.prototype = Object.create(WinStrategy.prototype);
    fn.constructor = FullLineWinStrategy;

    fn.evaluateBoard = function (board) {

        //Verifica pe randuri
        for (var y = 0; y < board.size; y++) {

            var firstTile = board.getTile(0, y);
            var winner = firstTile.player;
            var winningTiles = [firstTile];

            if (!winner) {
                continue;
            }
            var foundWinner = true;

            for (var x = 1; x < board.size; x++) {
                var tile = board.getTile(x, y);

                if (tile.player !== winner) {
                    foundWinner = false;
                    break;
                } else {
                    winningTiles.push(tile);
                }
            }

            if (foundWinner) {
                return this.result("win", winner, winningTiles);
            }
        }

        //Verifica pe coloane
        for (var x = 0; x < board.size; x++) {

            var firstTile = board.getTile(x, 0);
            var winner = firstTile.player;
            var winningTiles = [firstTile];

            if (!winner) {
                continue;
            }
            var foundWinner = true;

            for (var y = 1; y < board.size; y++) {
                var tile = board.getTile(x, y);

                if (tile.player !== winner) {
                    foundWinner = false;
                    break;
                } else {
                    winningTiles.push(tile);
                }
            }

            if (foundWinner) {
                return this.result("win", winner, winningTiles);
            }
        }

        //Verifica pe diagonale
        for (var corner = 0; corner < board.size; corner += board.size - 1) {

            var firstTile = board.getTile(0, 0 + corner);
            var winner = firstTile.player;
            var winningTiles = [firstTile];

            if (!winner) {
                continue;
            }
            var foundWinner = true;

            for (var x = 1; x < board.size; x++) {
                var y = corner === 0 ? x : corner - x;

                var tile = board.getTile(x, y);

                if (tile.player !== winner) {
                    foundWinner = false;
                    break;
                } else {
                    winningTiles.push(tile);
                }
            }

            if (foundWinner) {
                return this.result("win", winner, winningTiles);
            }
        }

        return this.result(board.isFull() ? "draw" : "going", null, null);
    };

    return FullLineWinStrategy;
});
