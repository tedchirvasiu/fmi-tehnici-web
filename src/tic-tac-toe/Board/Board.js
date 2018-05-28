define([
    './Row',
    'EventDispatcher'
], function (Row, EventDispatcher) {

    var Board = function (boardNode, size) {

        this.node = boardNode;
        this.size = size;
        this.rows = [];

        if (this.node != null) {
            this.eventDispatcher = new EventDispatcher();
        }

        //Creaza randurile si tile-urile
        for (var i = 0; i < size; i++) {
            var row = new Row(size, i, this.node != null);
            this.rows.push(row);
            if (this.node != null) {
                this.node.appendChild(row.node);

                //Inregistreaza evenimentele pe tile-uri si centralizeaza-le
                for (var j = 0; j < size; j++) {
                    var tile = row.tiles[j];
                    tile.on("click", this.trigger.bind(this, 'tile-click', tile));
                    tile.on("mouseenter", this.trigger.bind(this, 'tile-mouseenter', tile));
                    tile.on("mouseout", this.trigger.bind(this, 'tile-mouseout', tile));
                }
            }
        }
    };


    var fn = Board.prototype = {};

    //Ataseaza functiile de dispecerizare a evenimentelor direct de prototipul board-ului (on, off, trigger, etc.)
    EventDispatcher.prototype.attachToObject.call(null, fn);

    fn.copyStateFrom = function (board) {

        if (board.size !== this.size) {
            throw new Error("Board sizes do not match.");
        }

        for (var y = 0; y < this.size; y++) {
            for (var x = 0; x < this.size; x++) {
                this.getTile(x, y).setPlayer(board.getTile(x, y).player);
            }
        }
    }

    fn.getTile = function (x, y) {
        return this.rows[y].tiles[x];
    };

    fn.isFull = function () {

        for (var y = 0; y < this.rows.length; y++) {
            var row = this.rows[y];

            for (var x = 0; x < row.tiles.length; x++) {
                var tile = row.tiles[x];
                if (!tile.isOccupied()) {
                    return false;
                }
            }
        }

        return true;
    };

    fn.reset = function () {
        for (var i = 0; i < this.rows.length; i++) {
            var row = this.rows[i];
            row.reset();
        }
    };

    fn.destroy = function () {

        var len = this.rows.length;
        for (var i = 0; i < len; i++) {
            var row = this.rows.pop();
            row.destroy();
        }
    };

    return Board;
});
