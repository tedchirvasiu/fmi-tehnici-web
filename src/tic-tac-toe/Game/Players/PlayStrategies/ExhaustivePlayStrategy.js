define([
    './PlayStrategy',
    '../../../Board/Board'
], function (PlayStrategy, Board) {

    var ExhaustivePlayStrategy = function (maxDepth) {
        PlayStrategy.call(this);

        this.maxDepth = maxDepth;
    };

    var fn = ExhaustivePlayStrategy.prototype = Object.create(PlayStrategy.prototype);
    fn.constructor = ExhaustivePlayStrategy;

    fn.calculateScore = function (board, player, game, turn, depth) {

        if (this.maxDepth != null && depth > this.maxDepth) {
            return 0;
        }

        var evaluationResult = game.gameStrategy.evaluateBoard(board);

        if (evaluationResult.state === "draw") {
            return 0;
        } else if (evaluationResult.state === "win") {
            if (evaluationResult.winner === player) {
                if (depth === 0) {
                    return Number.POSITIVE_INFINITY;
                } else {
                    return 1 / Math.pow(2, depth);
                }
            } else {
                return -1 / Math.pow(2, depth);
            }
        }
        //else if going...
        var score = 0;
        var currentPlayer = game.players[turn % game.players.length];

        for (var y = 0; y < board.size; y++) {
            for (var x = 0; x < board.size; x++) {
                var tile = board.getTile(x, y);
                if (tile.player == null) {
                    var newBoard = new Board(null, board.size);
                    newBoard.copyStateFrom(board);
                    newBoard.getTile(x, y).setPlayer(currentPlayer);
                    
                    score += this.calculateScore(newBoard, player, game, turn+1, depth+1);
                }
            }
        }

        return score;
    }

    fn.handleTurn = function (game, player) {

        return window.setTimeout(function () {

            if (game.getCurrentPlayer() !== player) {
                return;
            }

            var size = game.board.size;
            var board = game.board;
            var bestTileScore = Number.NEGATIVE_INFINITY;
            var bestTile = null;

            for (var y = 0; y < size; y++) {
                for (var x = 0; x < size; x++) {
                    var tile = board.getTile(x, y);
                    if (tile.player == null) {
                        var newBoard = new Board(null, size);
                        newBoard.copyStateFrom(board);
                        newBoard.getTile(x, y).setPlayer(player);
                        
                        var score = this.calculateScore(newBoard, player, game, game.turn + 1, 0);

                        if (score > bestTileScore) {
                            bestTileScore = score;
                            bestTile = board.getTile(x, y);
                        }
                    }
                }
            }

            game.setPlayer(player, bestTile);
        }.bind(this), 1000);
    };

    return ExhaustivePlayStrategy;
});