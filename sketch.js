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

//asteroids
let asteroids;

function setup() {
  //create window
  if (windowHeight < windowWidth) {
    createCanvas(windowHeight*0.9, windowHeight*0.9);
  }
  else {
    createCanvas(windowWidth*0.9, windowWidth*0.9);
  }

  sceneW = width + width*0.75;
  sceneH = height + height*0.75;


  //load ship
  shipRestImg = loadImage("assets/playership.png");
  shipThrustImg = loadImage("assets/playershipthrust.png");
  createShip(width/2, height/2, 50, 50, 5);

  //create asteroids group
  asteroidImg = loadImage("assets/asteroid_big.png");
  asteroids = new Group();

  //create background group
  starsImg = loadImage("assets/star.png");
  smallStarsImg = loadImage("assets/smallstar.png");
  bg = new Group();

  createBG();

  for (let i=0; i<30; i++) {
    createAsteroid(random(width), random(height));
  }
}

function draw() {
  clear();
  background(0);

  controlCamera();

  shipControls();
  ship.bounce(asteroids);

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

function createAsteroid(x, y) {
  let asteroid = createSprite(x, y);
  asteroid.addImage("big-asteroids", asteroidImg);
  asteroid.setCollider("circle", 0, 0, 2);
  asteroid.mass = 2;
  asteroid.setSpeed(2, random(360));
  asteroid.rotationSpeed = 1;


  //push to group
  asteroids.add(asteroid);
  return asteroid;
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
  for (let i=0; i<100; i++) {
    let stars = createSprite(random(-width, sceneW+width), random(-height, sceneH+height));
    stars.addImage("stars", starsImg);
    bg.add(stars);
  }
  for (let i=0; i<400; i++) {
    let smallStars = createSprite(random(-width, sceneW+width), random(-height, sceneH+height));
    smallStars.addImage("small-stars", smallStarsImg);
    bg.add(smallStars);
  }
}

function controlCamera() {
  //camera follows ship
  camera.on();
  camera.zoom = 1.5;
  camera.position.x = ship.position.x;
  camera.position.y = ship.position.y;

  if (ship.position.y < 0) {
    ship.position.y = 0;
  }
  if (ship.position.y > height) {
    ship.position.y = height;
  }
  if (ship.position.x < 0) {
    ship.position.x = 0;
  }
  if (ship.position.x > width) {
    ship.position.x = width;
  }
}
