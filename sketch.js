// CS30 Major Project
// Umair Khan
// 10/19/2021
//
// Extra for Experts:
// - used a new library called p5.play
// - used a virtual camera to create an "open world" experience
// - created my own pixel art for sprites

let sceneW;
let sceneH;

//ship values
let ship;
let shipImage;

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
  shipRestImg = loadImage("assets/ship1.png");
  shipThrustImg = loadImage("assets/ship1-thrust.png");
  createShip(width/2, height/2, 50, 50, 5);

  //create asteroids group
  asteroids = new Group();

  //create background group
  starsImg = loadImage("assets/star.png");
  bg = new Group();

  createBG();
}

function draw() {
  clear();
  background(0);

  controlCamera();
  shipControls();

  //ship is draw on top of background
  drawSprites(bg);
  drawSprite(ship);
}

//creates a new ship
function createShip(x, y, w, h, speed) {
  ship = createSprite(x, y, w, h);
  ship.addImage("resting", shipRestImg);
  ship.addAnimation("accelerating", shipThrustImg);
  ship.setCollider("rectangle", 0, 0, w, h);
  ship.maxSpeed = speed;
  ship.friction = 0.02;
}

function shipControls() {
  if (keyDown("W")) {
    ship.changeAnimation("accelerating");
    ship.addSpeed(0.1, ship.rotation);
  }
  else {
    ship.changeAnimation("resting");
  }
  
  if (keyDown("A")) {
    ship.rotation -= 3;
  }

  if (keyDown("D")) {
    ship.rotation += 3;
  }
}

function createBG() {
  //create background elements
  for (let i=0; i<200; i++) {
    let stars = createSprite(random(-width, sceneW+width), random(-height, sceneH+height));
    stars.addImage("stars", starsImg);
    bg.add(stars);
  }
}

function controlCamera() {
  //camera follows ship
  camera.on();
  camera.zoom = 1.5;
  camera.position.x = ship.position.x;
  camera.position.y = ship.position.y;
}
