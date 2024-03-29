var flappyBird;
var myScore;
var pillars = [];
var flapAudio = new Audio('static/Sounds/sfx_wing.wav');
var hit = new Audio('static/Sounds/sfx_hit.wav');
var gameOverAud = new Audio('static/Sounds/sfx_die.wav');

/**
 * The myGameArea object is used to create the game canvas and is responsible for all the rendering
 * of the game visuals.
 *
 * @type {{canvas: HTMLCanvasElement | HTMLCanvasElement, render: myGameArea.render, clear: myGameArea.clear, stop: myGameArea.stop}}
 */
var myGameArea = {

    canvas: document.createElement("canvas"),


    render: function () {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.frameNo = 0;
        this.context = this.canvas.getContext("2d");
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(renderFlappy, 20);
        window.addEventListener('keydown', function (e) {
            myGameArea.keys = (myGameArea.keys || []);
            myGameArea.keys[e.keyCode] = (e.type === "keydown");


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


/**
 * The updateGameArea function
 */
function updateGameArea() {
    var x;
    var minHeight = 0;
    var maxHeight = 200;
    var height = Math.floor(Math.random() * (maxHeight - minHeight + 1) + minHeight);
    var minGap = 200;
    var maxGap = 350;
    var gap = Math.floor(Math.random() * (maxGap - minGap) + minGap);
    flappyBird.gravity = 1.25;

    if (myGameArea.keys && myGameArea.keys[38]) {
        flappyBird.gravity = -1.5;
        flapAudio.play();
        flapAudio.currentTime = 0;
        flappyBird.begin = true;
    }


    myGameArea.clear();

    myGameArea.frameNo += 1;
    if (everyInterval(125)) {
        x = myGameArea.canvas.width;
        pillars.push(new Component(50, height, "static/Images/pipeDown.png", x, 0, "img"));
        pillars.push(new Component(50, x - height - gap, "static/Images/pipeDown.png", x, height + gap, "img"));

    }


    for (var i = 0; i < pillars.length; i += 1) {
        pillars[i].x += -3;
        pillars[i].update();
        if (flappyBird.crashWith(pillars[i]) || flappyBird.x < 0 || flappyBird.y > window.innerHeight) {
            myGameArea.stop();
            hit.play();
            gameOverAud.play();
            if (confirm("Play Again?")) {
                pillars = [];
                myGameArea.clear();
                myGameArea.frameNo=0;
                startGame();
            }

        }

        else if (pillars[0].x < -200) {
            pillars.shift();
        }
    }


    myScore.text = "Score:" + myGameArea.frameNo;
    myScore.update();


}

/**
 * The renderFlappy function is responsible for the initial game start rendering of the flappy bird
 * and the animation. Upon start, this function will call upon updateGameArea to generate the pillars
 */
function renderFlappy() {

    myGameArea.clear();

    myGameArea.frameNo += 1;
    flappyBird.gravity = 0;
    if (myGameArea.frameNo % 35 === 0) {
        flappyBird.image.src = "static/Images/FlapDown.png"
    }
    else if (myGameArea.frameNo % 15 === 0) {
        flappyBird.image.src = "static/Images/FlapMid.png"
    }
    else if (myGameArea.frameNo % 5 === 0) {
        flappyBird.image.src = "static/Images/FlapUp.png"
    }


    if (myGameArea.keys && myGameArea.keys[38] && flappyBird.ignore) {

        flappyBird.ignore = false;
        flappyBird.begin = true;
    }

    if (flappyBird.begin) {
        updateGameArea();
    }

    if (flappyBird.y < 0){
        flappyBird.y=0;
    }

    flappyBird.newPos();
    flappyBird.update();

}

/**
 * The Component constructor is responsible for generating objects within the canvas.
 *
 * @param width
 * @param height
 * @param fill - determines the display content of the component
 * @param x - initial x position of the component following the x axis of an html page
 * @param y - initial y position of the component following the x axis of an html page
 * @param type - specifies the type of component to be generated, bird, score, pipe etc
 * @constructor
 */
function Component(width, height, fill, x, y, type) {
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speedX = 0;
    this.speedY = 0;
    this.gravity = 0;
    this.gravitySpeed = 0;
    this.type = type;
    if (this.type === "img") {
        this.image = new Image();
        this.image.src = fill;

    }


    /**
     * 
     */
    this.update = function () {
        ctx = myGameArea.context;
        if (this.type === "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = "white";
            ctx.fillText(this.text, this.x, this.y);

        }
        else if (this.type === "img") {
            ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
        }
        else {
            ctx.fillStyle = fill;
            ctx.fillRect(this.x, this.y, this.width, this.height);

        }
    };

    /**
     *
     */
    this.newPos = function () {
        this.gravitySpeed += this.gravity;
        this.x += this.speedX;
        this.y += this.speedY + this.gravitySpeed;
    };


    /**
     *
     * @param otherobj
     * @returns {boolean}
     */
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



function startGame() {
    flappyBird = new Component(60, 40, "static/Images/FlapMid.png", 250, window.innerHeight / 2, "img");
    flappyBird.begin = false;
    flappyBird.ignore = true;
    myScore = new Component("30px", "Consolas", "black", 280, 40, "text");
    myGameArea.render();
}




