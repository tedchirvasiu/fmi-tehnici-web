//Folosim containerul pentru a incarca ContextMenu.
//Din cauza referintei circulare, ContextMenu s-ar putea sa nu fie incarcat in momentul apelarii functiei de initializare.
define([
    'Container',
    './ContextMenu'
], function(Container) {

    //Clasa de baza pentru obiectele din meniul de context.
    var ContextMenuItem = function (element) {

        this.element = element;
        this.contextMenu = null;

    };

    var fn = ContextMenuItem.prototype = {};

    //Adauga item-ul intr-un meniu de context.
    fn.setMenu = function (contextMenu) {
        if (contextMenu == null || contextMenu instanceof Container.ContextMenu) {

            if (this.contextMenu !== contextMenu) {

                var oldContextMenu = this.contextMenu;
                this.contextMenu = contextMenu;

                if (oldContextMenu != null) {
                    oldContextMenu.removeItem(this);
                }

                if (contextMenu != null) {
                    contextMenu.addItem(this);
                }
            }
        } else {
            throw new Error("contextMenu is not an instance of ContextMenu");
        }
    };

    //Inchide meniul de context asociat item-ului.
    fn.closeMenu = function () {
        if (this.contextMenu) {
            this.contextMenu.close();
        }
    };

    Container.ContextMenuItem = ContextMenuItem;
    return ContextMenuItem;
});