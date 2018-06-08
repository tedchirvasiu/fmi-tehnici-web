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
    item.on("click", function(){
        alert("Comanda 1");
        this.closeMenu();
    });
    menu.addItem(item);
    
    item = new ContextMenuButton("Command 2", "fa-minus");
    item.on("click", function(){
        alert("Comanda 2");
        this.closeMenu();
    });
    item.setMenu(menu);
    
    menu.addDivider();
    

    //Navigheaza inapoi la pagina de X si O
    item = new ContextMenuButton("X si O", "fa-arrow-left");
    item.on("click", function(){
        window.location.href = "../tic-tac-toe/TicTacToe.html"
        this.closeMenu();
    });
    item.setMenu(menu);

    //Navigheaza inainte spre pagina de mingii saltarete
    item = new ContextMenuButton("Mingii saltarete", "fa-arrow-right");
    item.on("click", function(){
        window.location.href = "../bouncing-ball/index.html"
        this.closeMenu();
    });
    item.setMenu(menu);

    menu.addDivider();
    
    item = new ContextMenuButton("Command 3", "fa-adjust", "gray");
    item.on("click", function () {
        this.closeMenu();
    });
    
    menu.addItem(item);
});