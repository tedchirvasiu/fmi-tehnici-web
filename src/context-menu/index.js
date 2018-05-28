require.config({
    //Creeaza alias-uri pentru referintele externe, pentru a evita sa le referim prin cai relative de fiecare data cand avem nevoie de ele
    paths: {
        "EventDispatcher": '../common/event-dispatcher/EventDispatcher',
        "Container": "../common/container/Container"
    }
});

requirejs([
    "./context-menu/ContextMenu",
    "./context-menu/ContextMenuButton"
], function (ContextMenu, ContextMenuButton) {
    
    var menu = new ContextMenu(document.getElementById("area"), 150);
    
    var item = new ContextMenuButton("Command 1", "fa-plus");
    menu.addItem(item);
    
    item = new ContextMenuButton("Command 2", "fa-minus");
    item.setMenu(menu);
    
    menu.addDivider();
    
    
    item = new ContextMenuButton("Command 3", "fa-adjust", "gray");
    item.on("click", function () {
        this.closeMenu();
    });
    
    menu.addItem(item);
});