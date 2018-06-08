require.config({
    //Creeaza alias-uri pentru referintele externe, pentru a evita sa le referim prin cai relative de fiecare data cand avem nevoie de ele
    paths: {
        "EventDispatcher": '../common/event-dispatcher/EventDispatcher',
        "Container": "../common/container/Container"
    }
});

requirejs([
    "./Ball",
    "../context-menu/context-menu/ContextMenu",
    "../context-menu/context-menu/ContextMenuButton"
], function (Ball, ContextMenu, ContextMenuButton) {

    var world = {
        //Acceleratia gravitationala
        gravity: 250
    };
    
    
    var canvas = document.getElementById("canvas");
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    var ctx = canvas.getContext("2d");
    var balls = [];
    
    
    window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    
        draw();
    });
    
    
    function draw(delta) {
        ctx.beginPath();
        ctx.rect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fill();
    
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            ball.draw(ctx);
        }
    }
    
    function update(delta) {
        for (var i = 0; i < balls.length; i++) {
            var ball = balls[i];
            ball.addAcceleration(0, world.gravity, delta);
            ball.update(delta);
        }
    }
    
    
    var lastTimestamp = performance.now();
    
    function loop(timestamp) {
    
        var delta = (timestamp - lastTimestamp) / 1000;
    
        update(delta);
        draw(delta);
    
    
        requestAnimationFrame(loop);
        lastTimestamp = timestamp;
    }
    requestAnimationFrame(loop);

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    function spawnBall(x, y) {
        var ball = new Ball(x || 0, y || 0, getRandom(25, 50));
        ball.bounciness = getRandom(0, 1.0);

        var colors = ["#ff5252", "#ff793f", "#d1ccc0", "#ffb142", "white", "#33d9b2", "#474787", "#706fd3", "#34ace0"];
        ball.color = colors[Math.floor(getRandom(0, colors.length))];
        ball.mass = Math.pow(ball.radius / 25, 2);

        balls.push(ball);
    }
    spawnBall(window.innerWidth/2, 0);

    function addExplosion(x, y, radius, force) {

        for (var i = 0; i < balls.length; i++) {
            
            var ball = balls[i];
            var distToBall = ball.dist(x, y);
            var falloff = 1 - Math.min(distToBall/radius, 1);

            var dirX = distToBall > 0 ? (ball.position.x - x) / distToBall : 0;
            var dirY = distToBall > 0 ? (ball.position.y - y) / distToBall : 1;

            var f = force * falloff;

            ball.addForce(dirX * f, dirY * f);
        }
    };

    var explosionTool = function(x, y) {
        addExplosion(x, y, 200, 1000);
    };
    var spawnTool = function (x, y) {
        spawnBall(event.x, event.y);
    };
    var currentTool = spawnTool;


    window.addEventListener("click", function(event) {
        if (event.target === canvas) {
            currentTool(event.x, event.y);
        }
    });
    

    var menu = new ContextMenu(document.documentElement, 160);

    var spawnToolItem = new ContextMenuButton("Unealta creare", "fa-plus");
    spawnToolItem.on("click", function(){
        currentTool = spawnTool;
        this.closeMenu();
    });
    menu.addItem(spawnToolItem);

    var explosionToolItem = new ContextMenuButton("Unealta boom", "fa-bomb");
    explosionToolItem.on("click", function(){
        currentTool = explosionTool;
        this.closeMenu();
    });
    menu.addItem(explosionToolItem);

    menu.addDivider();

    //Navigheaza inapoi la pagina de demonstratie a meniului contextual
    var backItem = new ContextMenuButton("Pagina anterioara", "fa-arrow-left");
    backItem.on("click", function() {
        window.location.href = "../context-menu/index.html";
        this.closeMenu();
    });
    menu.addItem(backItem);

    menu.addDivider();
    var closeItem = new ContextMenuButton("Inchide", "fa-times");
    closeItem.on("click", function() {
        this.closeMenu();
    });
    menu.addItem(closeItem);

});