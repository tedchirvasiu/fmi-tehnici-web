define(['EventDispatcher'], function (EventDispatcher) {

    //Template pentru o celula
    var tileTemplate = document.createElement("td");
    tileTemplate.classList.add("tile");

    var Tile = function (row, index, createView) {

        this.node = null;
        this.row = row;
        this.index = index;
        this.player = null;
        this.isWinner = false;

        if (createView === true) {
            this.createView();
        }
    };

    var fn = Tile.prototype = {};

    //Ataseaza functiile de dispecerizare a evenimentelor direct de prototipul tile-ului (on, off, trigger, etc.)
    EventDispatcher.prototype.attachToObject.call(null, fn);

    //Creeaza elementul HTML pentru aceasta celula
    fn.createView = function () {

        this.eventDispatcher = new EventDispatcher();

        this.node = tileTemplate.cloneNode(true);

        this.node.addEventListener("click", this);
        this.node.addEventListener("mouseenter", this);
        this.node.addEventListener("mouseout", this);

        if (this.player != null) {
            this.node.classList.add("occupied");
            this.node.innerHTML = this.player.symbol;
        }

        if (this.isWinner) {
            this.node.classList.add("winner");
        }
    };

    fn.reset = function () {
        this.player = null;
        this.isWinner = false;
        if (this.node != null) {
            this.node.classList.remove("occupied");
            this.node.classList.remove("winner");
            this.node.innerHTML = "";
        }
    };

    fn.setPlayer = function (player) {

        if (player == null) {
            this.reset();
        } else {
            this.player = player;
            if (this.node != null) {
                this.node.classList.add("occupied");
                this.node.innerHTML = player.symbol;
            }
        }
    };

    fn.markAsWinner = function () {
        this.isWinner = true;
        if (this.node != null) {
            this.node.classList.add("winner");
        }
    }

    fn.isOccupied = function () {
        return this.player != null;
    };

    fn.getPosition = function () {

        return {
            x: this.index,
            y: this.row.index
        };
    };

    fn.handleEvent = function (event) {
        //'this' in cazul de fata face referire la obiectul de tip Tile
        switch (event.type) {
            case 'click':
                this.trigger('click', event);
                break;
            case 'mouseenter':
                this.trigger('mouseenter', event);
                break;
            case 'mouseout':
                this.trigger('mouseout', event);
                break;
        }
    };

    //Distruge tile-ul si detaseaza-l din DOM
    fn.destroy = function () {
        this.eventDispatcher.clear();

        if (this.node != null) {
            this.node.removeEventListener(this);
            this.node.parentNode.removeChild(this.node);
            this.node = null;
        }
    };

    return Tile;
});
