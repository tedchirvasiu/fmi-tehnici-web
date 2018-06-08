define([], function() {

    var Ball = function (x, y, radius) {
        this.position = {
            x: x,
            y: y
        };
    
        this.velocity = {
            x: 0,
            y: 0
        };

        this.bounciness = 1.0;
        this.radius = radius;
        this.mass = 1.0;

        this.color = "white";
    };
    
    var fn = Ball.prototype = {};
    
    fn.draw = function (context) {
        context.beginPath();
        context.arc(this.position.x, this.position.y, this.radius, 0, 2 * Math.PI);
        context.fillStyle = this.color;
        context.fill();
        context.strokeStyle = "gray";
        context.stroke();
    };
    
    fn.update = function (delta) {
        this.position.x += this.velocity.x * delta;
        this.position.y += this.velocity.y * delta;
    
        var limitLeft = this.radius;
        var limitRight = window.innerWidth - this.radius;
        var limitTop = this.radius;
        var limitBottom = window.innerHeight - this.radius;
    
        if (this.position.x < limitLeft) {
            this.setVelocity(Math.abs(this.velocity.x) * this.bounciness, this.velocity.y);
        } else if (this.position.x > limitRight) {
            this.setVelocity(-Math.abs(this.velocity.x) * this.bounciness, this.velocity.y);
        }
    
        if (this.position.y < limitTop) {
            this.setVelocity(this.velocity.x, Math.abs(this.velocity.y) * this.bounciness);
        } else if (this.position.y > limitBottom) {
            this.setVelocity(this.velocity.x, -Math.abs(this.velocity.y) * this.bounciness);
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
    
    fn.addAcceleration = function (x, y, deltaTime) {
        deltaTime = deltaTime == null ? 1 : deltaTime;
        this.addVelocity(x * deltaTime, y * deltaTime);
    };

    fn.addForce = function (x, y, deltaTime) {
        //F = m * a => a = F / m
        var accelerationX = x / this.mass;
        var accelerationY = y / this.mass;
        deltaTime = deltaTime == null ? 1.0 : deltaTime;
        this.addAcceleration(accelerationX, accelerationY, deltaTime);
    };

    fn.dist = function (x, y) {
        var diffX = this.position.x - x;
        var diffY = this.position.y - y;
        return Math.sqrt(diffX*diffX + diffY*diffY);
    };

    return Ball;
});