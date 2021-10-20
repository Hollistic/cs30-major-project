// CS30 Major Project
// Umair Khan
// 10/19/2021
//
// Extra for Experts:
// - used p5.play library

let sceneW;
let sceneH;

//ship values
let ship;
let shipImage;
let shipWidth = 50;
let shipHeight = 50;

function setup() {
  //create window
  if (windowHeight < windowWidth) {
    createCanvas(windowHeight*0.9, windowHeight*0.9);
  }
  else {
    createCanvas(windowWidth*0.9, windowWidth*0.9);
  }

  sceneW = width + width/2;
  sceneH = height + height/2;
  
  //load ship
  shipImage = loadImage("assets/ship1.png");
  createShip(width/2, height/2, 50, 50, 5);
}

function draw() {
  background(220);
  drawSprites();
}

function createShip(x, y, width, height, speed) {
  ship = createSprite(x, y, width, height);
  ship.addImage("static", shipImage);
  ship.addAnimation("accelerating", "assets/ship1.thrust");
  ship.setCollider("rectangle", 0, 0, shipWidth, shipHeight);
  ship.maxSpeed(speed);
  ship.friction(0.99);
}
