"use strict";

//Variables

//Game Objects
let player;
let crosshair;
let grass;

//Player Movement Variables
let moveForward;
let moveBackwards;
let angle;
let movementSpeed = 0.5;

//Map boundaries
const mapBoundary = {
    minX: -1920,
    maxX: 640,
    minY: -1080,
    maxY: 360
};

//Animation variables
let playerSprite = "images/Boboterfly/boterfly/anims/idle/Staylang_0.png";
let imagesScale = 0.4;

let playerMovementAnimation = [];
for(let i = 0; i<3;i++)
{
    playerMovementAnimation.push(new Image());
    playerMovementAnimation[i].src = "images/Boboterfly/boterfly/anims/move/Galawcuh_"+i.toString()+".png";
}


let playerIdleAnimation = [];
for(let i = 0; i<3;i++)
{
    playerIdleAnimation.push(new Image());
    playerIdleAnimation[i].src = "images/Boboterfly/boterfly/anims/idle/Staylang_"+i.toString()+".png";
}

function startGame()
{
    GameArea.start();

    //Initialize Game Objects
    player = new Component(313*imagesScale,207*imagesScale,playerSprite,640-(313*imagesScale)/2,360-(202*imagesScale)/2,"player",0);
    grass = new Component(2560,1440,"images/grass.png",0,0,"grass");
    crosshair = new Component(40,40,"images/crosshair097.png",640,360,"image");

    //Get Input
    window.addEventListener("keydown", handleMovementPress);
    window.addEventListener("keyup", handleMovementRelease);
}

//Create Canvas
let GameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
        this.canvas.width = 1280;
        this.canvas.height = 720;
        this.context = this.canvas.getContext("2d");
        clearInterval(GameArea.interval);
        this.interval = setInterval(updateGameArea, 20);
        this.canvas.id = "Game-Window";

        //Put the canvas underneath the Game Title
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        let h1Element = document.querySelector("h1.Game-Title");
        h1Element.insertAdjacentElement("afterend", this.canvas);
    },

    clear: function() {
        this.context.clearRect(0,0,this.canvas.width, this.canvas.height);
    }
}

//Create Game Components
function Component(width, height, source, x, y, type, angle=0){
    this.type = type;
    this.angle = angle;

    if (type === "image" || type === "grass") {
        this.image = new Image();
        this.image.src = source;
    }
    else if (type === "player") {
        this.image = new Image();
        this.image.src = playerSprite;
    }
    this.width = width;
    this.height = height;

    this.x = x;
    this.y = y;

    this.update = function(){
        let ctx = GameArea.context;

        ctx.save();

        // Rotate the player image based on the angle
        ctx.translate(this.x + this.width / 2, this.y + this.height / 2);
        ctx.rotate(this.angle);

        //Images and Animated Images
        if(type === "image")
        {
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        else if(type === "player")
        {
            this.image.src = playerSprite;
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
        }
        else if(type === "grass")
        {
            ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);

            if(moveForward){
                // Movement & Idle animation
                playerMovementAnimationFunction();

                //Move player
                let newX = this.x - movementSpeed*10 * Math.cos(player.angle);
                let newY = this.y - movementSpeed*10 * Math.sin(player.angle);

                // Check boundaries
                if (newX > mapBoundary.minX && newX < mapBoundary.maxX) {
                    this.x = newX;
                }
                if (newY > mapBoundary.minY && newY < mapBoundary.maxY) {
                    this.y = newY;
                }
            }
            else if(moveBackwards){
                // Movement & Idle animation
                playerMovementAnimationFunction();

                //Move player
                let newX = this.x + movementSpeed * Math.cos(player.angle);
                let newY = this.y + movementSpeed * Math.sin(player.angle);

                // Check boundaries
                if (newX > mapBoundary.minX && newX < mapBoundary.maxX) {
                    this.x = newX;
                }
                if (newY > mapBoundary.minY && newY < mapBoundary.maxY) {
                    this.y = newY;
                }
            }
            else{
                //Idle Animation
                playerIdleAnimationFunction();
            }
        }
        ctx.restore();
    }
}

function updateGameArea(){
    GameArea.clear();

    //Game context
    let ctx = GameArea.context;

    //On mouse moved:
    onmousemove = function(e) {
        //Find players rotation
        let rect = GameArea.canvas.getBoundingClientRect();
        angle = Math.atan2(e.clientY-rect.top - player.y-150/2, e.clientX-rect.left - player.x-256/2);
        player.angle = angle;

        //Set crosshair's position
        crosshair.x = e.clientX-rect.left-20;
        crosshair.y = e.clientY-rect.top-17;
    };

    //Update Game Objects
    grass.update();
    player.update();
    crosshair.update();
}

//Enable Movement Input
function handleMovementPress(event) {
    let key = event.keyCode;
    if (key === 87) {
        moveForward = true;
    }
    else if (key === 83) {
        moveBackwards = true;
    }
}

//Disable Movement Input
function handleMovementRelease(event) {
    let key = event.keyCode;
    if (key === 87) {
        moveForward = false;
    }
    else if (key === 83) {
        moveBackwards = false;
    }
}

//Animation variables
let i = 0;
let waitTime = 10;

function playerMovementAnimationFunction()
{
    if(waitTime === 0)
    {
        playerSprite = playerMovementAnimation[i % playerMovementAnimation.length].src;
        i = (i + 1) % playerMovementAnimation.length;
        waitTime=10;
    }
    else{
        waitTime--;
    }
}

function playerIdleAnimationFunction()
{
    if(waitTime === 0)
    {
        playerSprite = playerIdleAnimation[i % playerIdleAnimation.length].src;
        i = (i + 1) % playerIdleAnimation.length;
        waitTime=30;
    }
    else{
        waitTime--;
    }
}
