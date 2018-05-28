
var world = {
    gravity: 9.81
};


var canvas = document.getElementById("canvas");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var ctx = canvas.getContext("2d");

var balls = [];

function Ball(x, y, radius) {
    this.position = {
        x: x,
        y: y
    };

    this.velocity = {
        x: 0,
        y: 0
    };

    this.radius = radius;
}

var fn = Ball.prototype = {};

fn.draw = function () {
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
    ctx.fillStyle = "white";
    ctx.fill();
};

fn.update = function (delta) {
    this.position.x += this.velocity.x * delta;
    this.position.y += this.velocity.y * delta;

    let limitLeft = this.radius;
    let limitRight = window.innerWidth - this.radius;
    let limitTop = this.radius;
    let limitBottom = window.innerHeight - this.radius;

    if (this.position.x < limitLeft) {
        this.setVelocity(Math.abs(this.velocity.x), this.velocity.y);
    } else if (this.position.x > limitRight) {
        this.setVelocity(-Math.abs(this.velocity.x), this.velocity.y);
    }

    if (this.position.y < limitTop) {
        this.setVelocity(this.velocity.x, Math.abs(this.velocity.y));
    } else if (this.position.y > limitBottom) {
        this.setVelocity(this.velocity.x, -Math.abs(this.velocity.y));
    }

    this.position.x = Math.min(Math.max(this.position.x, limitLeft), limitRight);
    this.position.y = Math.min(Math.max(this.position.y, limitTop), limitBottom);
};

fn.addVelocity = function (x, y) {
    this.velocity.x += x;
    this.velocity.y += y;
};

fn.setVelocity = function (x, y) {
    this.velocity.x = x;
    this.velocity.y = y;
};


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

    for (var ball of balls) {
        ball.draw();
    }
}

function update(delta) {
    for (var ball of balls) {
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


balls.push(new Ball(0, 0, 50));
balls[0].addVelocity(100, 100);
balls.push(new Ball(0, 50, 55));
balls[1].addVelocity(10, 15);

requestAnimationFrame(loop);