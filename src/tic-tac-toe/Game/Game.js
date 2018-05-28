define([
    '../Board/Board',
    "./Players/Human",
    "./Players/AI",
    "./WinStrategies/FullLineWinStrategy"
], function (Board, Human, AI, FullLineWinStrategy) {

    var Game = function(gameNode, size, players, gameStrategy) {

        this.node = gameNode;
        this.winner = null;
        this.state = "going";
        this.isInitialized = false;

        this.players = players ? players.slice() : [new Human("X"), new AI("O")];
        this.turn = 0;

        this.gameStrategy = gameStrategy || new FullLineWinStrategy();

        var resetBtn = this.node.getElementsByClassName("reset-btn")[0];
        resetBtn.addEventListener("click", function (event) {
            this.reset();
        }.bind(this));

        this.statusInfo = this.node.getElementsByClassName("status-info")[0];

        this.init(size);
    };

    var fn = Game.prototype = {};

    fn.init = function (size) {

        if (this.size !== size) {

            if (this.board != null) {
                this.board.destroy();
            }

            this.size = size;

            var boardNode = this.node.getElementsByClassName("board")[0];
            this.board = new Board(boardNode, size);

            //Seteaza simbolul player-ului curent pentru a fi afisat sub forma de ghost la hover
            //Simbolul este preluat de clasa de CSS .tile prin functia attr()
            this.board.on("tile-mouseenter", function (tile, event) {
                var currentPlayer = this.getCurrentPlayer();
                tile.node.setAttribute("data-symbol", currentPlayer.symbol);
            }.bind(this));

            this.board.on("tile-click", function (tile, event) {

                if (this.state !== "going") {
                    return;
                }

                var currentPlayer = this.getCurrentPlayer();

                if (currentPlayer.handleClick) {
                    currentPlayer.handleClick(tile, this);
                }

            }.bind(this));

            this.isInitialized = true;
            this.beginTurn();
        }
    };

    fn.evaluateGame = function () {
        return this.gameStrategy.evaluateBoard(this.board);
    };

    fn.getCurrentPlayer = function () {
        return this.players[this.turn % this.players.length];
    };

    fn.setPlayer = function (player, tile) {

        if (tile.isOccupied() || this.state !== "going") {
            return;
        }

        tile.setPlayer(player);
        var evalResult = this.evaluateGame();
        this.state = evalResult.state;
        if (this.state === "win") {

            for (var i = 0; i < evalResult.winningTiles.length; i++) {
                evalResult.winningTiles[i].markAsWinner();
            }

            this.declareWinner(evalResult.winner);
        } else if (this.state == "draw") {
            this.setStatusInfo("Remiză");
        } else {
            this.nextTurn();
        }
    };

    fn.nextTurn = function () {
        this.turn += 1;
        this.beginTurn();
    };

    fn.beginTurn = function () {
        var currentPlayer = this.getCurrentPlayer();

        this.setStatusInfo("Rândul lui <b>" + currentPlayer.symbol + "</b>...");

        if (currentPlayer.handleTurn) {
            currentPlayer.handleTurn(this);
        }
    };

    fn.declareWinner = function (player) {
        this.setStatusInfo("Câștigătorul este <b>" + player.symbol + "</b>");
        this.winner = player;
    };

    fn.setStatusInfo = function (text) {
        this.statusInfo.innerHTML = text;
    };

    fn.reset = function () {
        this.board.reset();
        this.winner = null;
        this.turn = 0;
        this.state = "going";

        this.beginTurn();
    };

    return Game;
});