define(['./Tile'], function (Tile) {

    function createTile(index) {
        var tile = new Tile(this, index);
        this.tiles.push(tile);

        return tile;
    }

    //Template pentru un rand
    var rowTemplate = document.createElement("tr");
    rowTemplate.classList.add("row");

    //Clasa Row
    var Row = function (size, index, createView) {

        this.size = size;
        this.index = index;
        this.tiles = [];

        for (var i = 0; i < size; i++) {
            createTile.call(this, i);
        }

        if (createView === true) {
            this.createView();
        }
    };

    var fn = Row.prototype = {};

    //Creeaza elementul HTML pentru aceast rand si pentru celulele sale (daca nu exista)
    fn.createView = function () {

        this.node = rowTemplate.cloneNode(true);

        for (var i = 0; i < this.size; i++) {
            var tile = this.tiles[i];
            if (tile.node == null) {
                tile.createView();
            }
            this.node.appendChild(tile.node);
        }
    };

    //Reseteaza tile-urile de pe acest rand
    fn.reset = function () {
        for (var i = 0; i < this.tiles.length; i++) {
            var tile = this.tiles[i];
            tile.reset();
        }
    };

    //Distruge randul si tile-urile asociate
    fn.destroy = function () {

        var len = this.tiles.length;
        for (var i = 0; i < len; i++) {
            var tile = this.tiles.pop();
            tile.destroy();
        }

        if (this.node != null) {
            this.node.parentNode.removeChild(this.node);
            this.node = null;
        }
    };

    return Row;
});
