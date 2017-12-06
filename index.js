var flappyBird;
var pillars = [];

function startGame() {
    flappyBird = new component(30, 30, "red", 100, window.innerHeight / 2);
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
    console.log(window.innerHeight);
}

var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.frameNo = 0;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type == "keydown");

        });

        window.addEventListener('keyup', function (e) {
            myGameArea.keys[e.keyCode] = (e.type == "keydown");
        });
    },
    clear: function () {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    stop: function () {
        clearInterval(this.interval);
    }
};

function updateGameArea() {
    var x, y;

    for (i = 0; i < pillars.length; i++) {
        if (flappyBird.crashWith(pillars[i])) {
            myGameArea.stop();
            alert("GAME OVER");
            return;

        }
        else if (flappyBird.x <0 || flappyBird.y > window.innerHeight){
            myGameArea.stop();
            alert("GAME OVER");
            return;
        }
        else if(pillars[0].x<0 ){
            pillars.shift();


        }
    }


    myGameArea.clear();
    myGameArea.frameNo += 1;
    if (myGameArea.frameNo == 1 || everyInterval(150)) {
        x = myGameArea.canvas.width;
        minHeight=0;
        maxHeight = 200;
        height= Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 50;
        maxGap=200;
        gap = Math.floor(Math.random()*(maxGap-minGap)+minGap);
        y = myGameArea.canvas.height - 200;
        pillars.push(new component(10, height, "green", x, 0));
        pillars.push(new component(10, x-height-gap, "green", x, height+gap));
    }

    for (i = 0; i < pillars.length; i += 1) {
        pillars[i].x += -2;
        pillars[i].update();
    }

    flappyBird.speedX = -0.25;
    flappyBird.speedY = 0;
    if (myGameArea.keys && myGameArea.keys[37]) {
        flappyBird.speedX = -1;
    }
    if (myGameArea.keys && myGameArea.keys[39]) {
        flappyBird.speedX = 1;
    }
    if (myGameArea.keys && myGameArea.keys[38]) {
        flappyBird.speedY = -1;
    }
    if (myGameArea.keys && myGameArea.keys[40]) {
        flappyBird.speedY = 1;
    }
    myScore.text="Score:" + myGameArea.frameNo;
    myScore.update();
    flappyBird.newPos();
    flappyBird.update();

}

function component(width, height, color, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.type=type;
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type == "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = "blue";
            ctx.fillText(this.text, this.x, this.y);

        }
        else
        {
            ctx.fillStyle = color;
            ctx.fillRect(this.x, this.y, this.width, this.height);

        }};
    this.newPos = function () {
        this.x += this.speedX;
        this.y += this.speedY;
    };
    this.crashWith = function (otherobj) {
        var objLeft = this.x;
        var objright = this.x + this.width;
        var objtop = this.y;
        var objbottom = this.y + this.height;

        var obstacleLeft = otherobj.x;
        var obstacleright = otherobj.x + otherobj.width;
        var obstacletop = otherobj.y;
        var obstaclebottom = otherobj.y + otherobj.height;
        var crash = true;
        if ((objright < obstacleLeft) ||
            objLeft > obstacleright ||
            objtop > obstaclebottom ||
            objbottom < obstacletop ||
            objbottom > window.innerHeight) {
            crash = false;
        }
        return crash;
    }

}

function everyInterval(n) {
    return ((myGameArea.frameNo / n) % 1 === 0);
}



