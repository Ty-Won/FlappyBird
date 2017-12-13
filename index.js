var flappyBird;
var myScore;
var pillars = [];
var flapAudio = new Audio('Sounds/sfx_wing.wav');
var hit = new Audio ('Sounds/sfx_hit.wav');
var gameOverAud = new Audio('Sounds/sfx_die.wav');


function startGame() {
    flappyBird = new component(60, 40, "Images/FlapMid.png", 250, window.innerHeight / 2, "img");
    myScore = new component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.start();
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
            myGameArea.keys[e.keyCode] = (e.type === "keydown");
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
        if (flappyBird.crashWith(pillars[i]) || flappyBird.x <0 || flappyBird.y > window.innerHeight) {
            myGameArea.stop();
            hit.play();
            gameOverAud.play();
            if(confirm("Play Again?")){
                pillars=[];
                startGame();
            }

        }

        else if(pillars[0].x<-200 ){
            pillars.shift();


        }
    }


    myGameArea.clear();

    myGameArea.frameNo += 1;
    if (myGameArea.frameNo === 1 || everyInterval(150)) {
        x = myGameArea.canvas.width;
        minHeight=0;
        maxHeight = 200;
        height= Math.floor(Math.random()*(maxHeight-minHeight+1)+minHeight);
        minGap = 125;
        maxGap=250;
        gap = Math.floor(Math.random()*(maxGap-minGap)+minGap);
        y = myGameArea.canvas.height - 200;
        pillars.push(new component(50, height, "Images/pipeDown.png", x, 0,"img"));
        pillars.push(new component(50, x-height-gap, "Images/pipeDown.png", x, height+gap,"img"));

    }

    if (myGameArea.frameNo % 30 === 0){
        flappyBird.image.src="Images/FlapDown.png"
    }
    else if (myGameArea.frameNo % 20 === 0){
        flappyBird.image.src="Images/FlapMid.png"
    }
    else if (myGameArea.frameNo % 10 === 0){
        flappyBird.image.src="Images/FlapUp.png"
    }


    for (var i = 0; i < pillars.length; i += 1) {
        pillars[i].x += -2;
        pillars[i].update();
    }

    flappyBird.speedX = 0;
    flappyBird.speedY = 0;
    flappyBird.gravity=0.35;

    if (myGameArea.keys && myGameArea.keys[38]) {
        flappyBird.gravity=-0.5;
        flapAudio.play();
        flapAudio.currentTime=0;
    }
    myScore.text="Score:" + myGameArea.frameNo;
    myScore.update();
    flappyBird.newPos();
    flappyBird.update();

}

function component(width, height, fill, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity=0.01;
    this.gravitySpeed=0;
    this.type=type;
    if(this.type === "img"){
        this.image = new Image();
        this.image.src = fill;

    }

    this.update = function () {
        ctx = myGameArea.context;
        if (this.type === "text"){
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = "white";
            ctx.fillText(this.text, this.x, this.y);

        }
        else if(this.type === "img"){
            ctx.drawImage(this.image, this.x,this.y,this.width,this.height);
        }
        else
        {
            ctx.fillStyle = fill;
            ctx.fillRect(this.x, this.y, this.width, this.height);

        }};
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY+this.gravitySpeed;
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
    return ((myGameArea.frameNo) % n === 0);
}




