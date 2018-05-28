//Folosim containerul pentru a incarca ContextMenuItem.
//Din cauza referintei circulare, ContextMenuItem s-ar putea sa nu fie incarcat in momentul apelarii functiei de initializare.
define([
    "Container",
    "./Util",
    "./ContextMenuItem"
], function(Container, Util) {
    
    //Clasa meniului de context.
    var ContextMenu = function (target, width) {

        this.target = target;
        this.width = width;

        this.items = [];

        this.isOpen = false;

        this.element = document.createElement("div");
        this.element.classList.add("context-menu");
        this.element.style.width = width + "px";

        //Capteaza evenimentul de click dreapta si previne deschiderea meniului context implicit al browserului.
        document.addEventListener("contextmenu", function (ev) {

            if (ev.target === this.target || Util.hasParent(ev.target, this.target)) {
                ev.preventDefault();

                this.open(ev.x + document.documentElement.scrollLeft, ev.y + document.documentElement.scrollTop);

                return false;
            } else if (ev.target === this.element || Util.hasParent(ev.target, this.element)) {
                ev.preventDefault();
                return false;
            } else {
                this.close();
            }
        }.bind(this));

        //Inchide meniul daca se face click oriunde in afara meniului.
        document.addEventListener("click", function (ev) {
            if (this.element !== ev.target && !Util.hasParent(ev.target, this.element)) {
                this.close();
            }
        }.bind(this));

        //Inchide meniul daca se apasa tasta Esc;
        document.addEventListener("keydown", function (ev) {
            var isEscape = ev.key == "Escape" || ev.key == "Esc";

            if (isEscape) {
                this.close();
            }
        }.bind(this));

        //Inchide meniul la redimensionarea ferestrei.
        window.addEventListener('resize', function () {
            this.close();
        }.bind(this));

    };

    var fn = ContextMenu.prototype = {};

    //Deschide meniul.
    fn.open = function (x, y) {
        
        if (!this.isOpen) {
            document.body.appendChild(this.element);
        }

        var windowWidth = document.documentElement.scrollLeft + document.documentElement.clientWidth;
        this.element.style.left = Math.min(x, windowWidth - this.width) + "px";

        var contextHeight = this.element.offsetHeight;
        var windowHeight = Math.min(document.documentElement.offsetHeight, document.documentElement.scrollTop + window.innerHeight);
        
        this.element.style.top = ((y + contextHeight > windowHeight) ? (y - contextHeight) : y) + "px";

        if (!this.isOpen) {
            var fadeIn = function () {
                this.element.classList.add("open");
            }.bind(this);

            //Adauga clasa dupa ce un ciclu de redare a fost executat de la adaugarea elementului
            //in DOM.
            requestAnimationFrame(function () {
                requestAnimationFrame(fadeIn);
            });
            this.isOpen = true;
        }
    };

    //Inchide meniul.
    fn.close = function () {

        if (this.isOpen) {
            this.element.parentNode.removeChild(this.element);
            this.element.classList.remove("open");

            this.isOpen = false;
        }
    };

    //Adauga un obiect in meniu.
    fn.addItem = function (item) {
        if (this.items.indexOf(item) === -1) {
            this.element.appendChild(item.element);
            this.items.push(item);

            if (item.setMenu) {
                item.setMenu(this);
            }
        }
    };

    //Elimina un obiect din meniu.
    fn.removeItem = function (item) {
        var index = this.items.indexOf(item);
        if (index !== -1) {
            this.element.removeChild(item);
            this.items.splice(index, 1);

            if (item.setMenu) {
                item.setMenu(null);
            }
        }
    };

    //Creeaza o linie de despartire orizontala intre obiectele din meniu.
    fn.addDivider = function () {
        var divider = new Container.ContextMenuItem(document.createElement("hr"));
        this.addItem(divider);

        return divider;
    };

    Container.ContextMenu = ContextMenu;
    return ContextMenu;
});