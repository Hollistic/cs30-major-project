// CS30 Major Project
// Umair Khan
// 10/19/2021
//
// Extra for Experts:
// - used a new library called p5.play
// - used a virtual camera to create an "open" experience
// - created my own pixel art for sprites
// - implemented sound effects
// - used class objects with the p5.play Group() feature along with the sprites function
// - 
//
// To-Do:
// - implement a points system
// - add a shop/upgrade ui
// - add another enemy?

//screen values
let sceneW;
let sceneH;
let marginW;
let marginH;

//game values
let score = 0;
let money = 0;


//ship values
let ship;

//asteroids
let asteroids;
let shootSFX;
let thrustSFX;
let hitSFX;
let explodeSFX;
let collectSFX;

//let bullets
let bullets;

let coins;

let particles;


function preload() {
  //load ship
  shipRestImg = loadImage("assets/playership.png");
  shipThrustImg = loadImage("assets/playershipthrust.png");
  shipThrustImg2 = loadImage("assets/playershipthrust2.png");
  thrustSFX = loadSound("assets/thrust.wav");
  shootSFX = loadSound("assets/shoot.wav");
  hitSFX = loadSound("assets/hit.wav");
  collectSFX = loadSound("assets/collect.wav");

  //load asteroid
  asteroidImg = loadImage("assets/bigasteroid.png");
  asteroidImg2 = loadImage("assets/bigasteroid2.png");
  astParticleImg = loadImage("assets/asteroid_particles.png");
  explodeSFX = loadSound("assets/explode.wav");

  //load bullets
  bulletsImg = loadImage("assets/bullet.png");

  //load coin
  coinImg = loadImage("assets/coin.png");
  coinPlusImg = loadImage("assets/plusone.png");

  //music
  musicLoop = loadSound("assets/wunna.mp3");
}

function setup() {
  //create window
  // if (windowHeight < windowWidth) {
  //   createCanvas(windowHeight*0.9, windowHeight*0.9);
  // }
  // else {
  //   createCanvas(windowWidth*0.9, windowWidth*0.9);
  // }

  // createCanvas(1280*0.9, 800*0.9);
  createCanvas(windowWidth, windowHeight);

  //defines the extended camera scene for the player ship
  sceneW = width + width*0.4;
  sceneH = height + height*0.4;

  //defines the small value outside the player ship's boundary area (width and heights)
  marginW = width*0.4;
  marginH = height*0.4;

  
  createShip(width/2, height/2, 50, 50, 5, 100);

  //create bullets
  
  bullets = new Group();
  
  //create asteroids group
  
  asteroids = new Group();
  for (let i=0; i<30; i++) {
    createAsteroid(random(width), random(height), 3);
  } 

  //particles
  particles = new Group();

  coins = new Group();

  //create background group
  starsImg = loadImage("assets/star.png");
  smallStarsImg = loadImage("assets/smallstar.png");
  galaxyImg = loadImage("assets/galaxy.png");
  bg = new Group();
  createBG();
  
  // musicLoop.loop();
}

function draw() {
  clear();
  background(0);

  controlCamera();

  shipControls();
  
  //all sprites are drawn, goes by layer order
  drawSprites(bg);
  drawSprites(asteroids);
  drawSprites(coins);
  drawSprites(particles);
  drawSprites(bullets);
  drawSprite(ship);
  
  //object collision
  asteroids.bounce(asteroids);
  asteroids.bounce(coins);
  ship.overlap(asteroids, shipHitAsteroid);
  bullets.overlap(asteroids, bulletsHitAsteroid);
  ship.overlap(coins, shipTouchCoin);
  
  //checks if object is off screen
  checkOffScreen();

  //displays framerate
  displayUI();
  // createMiniMap();
}

function createMiniMap() {
  
  let miniMapW = 200;
  let miniMapH = 200;
  copy(0, 0, width, height, width-miniMapW, height - miniMapH, miniMapW, miniMapH);
}

//creates a new ship
function createShip(x, y, w, h, speed, hp) {
  ship = createSprite(x, y, w, h);
  ship.addImage("resting", shipRestImg);
  ship.addAnimation("accelerating", shipThrustImg, shipThrustImg2);
  ship.setCollider("rectangle", 0, 0, w/2, h/2);
  ship.maxSpeed = speed;
  ship.health = hp;
  ship.friction = 0.015;
  ship.debug = true;
}

function createAsteroid(x, y, size) {
  let asteroid = createSprite(x, y);
  asteroidSprite = random([asteroidImg, asteroidImg2]);
  asteroid.addImage(asteroidSprite);
  asteroid.setCollider("circle", 0, 0, 25);

  asteroid.size = size;
  if (size === 2) {
    asteroid.scale = 0.75;
  }
  if (size === 1) {
    asteroid.scale = 0.4;
  }

  asteroid.mass = random(1, 2);
  asteroid.setSpeed(random(0.5, 2), random(360));
  asteroid.rotationSpeed = random(0.2, 1);
  asteroid.useQuadTree = true;
  asteroid.debug = true;
  
  //size detection  

  //push to group
  asteroids.add(asteroid);
  return asteroid;
}

function createBullets() {
  let bullet = createSprite(ship.position.x, ship.position.y);
  bullet.addImage(bulletsImg);
  bullet.life = 50;
  bullet.rotateToDirection = true;
  bullet.setSpeed(ship.getSpeed()+6, ship.rotation);
  bullet.debug = true;
  bullets.add(bullet);
}

function bulletsHitAsteroid(bullets, asteroids) {
  
  let brokenSize = asteroids.size-1;
  if (brokenSize>0) {
    createAsteroid(asteroids.position.x, asteroids.position.y, brokenSize);
    createAsteroid(asteroids.position.x, asteroids.position.y, brokenSize);
  }

  //explode sound effect
  explodeSFX.play();

  //particle effect
  for (let i=0; i<10; i++) {
    particle = createSprite(asteroids.position.x, asteroids.position.y);
    particle.addImage(astParticleImg);
    particle.setSpeed(random(2, 9), random(360));
    particle.life = 10;
    particle.friction = 0.05;
    particle.scale = 0.25;
    particles.add(particle);
  }

  //drop a coin
  coin = createSprite(asteroids.position.x, asteroids.position.y);
  coin.addImage(coinImg);
  coin.setSpeed(0, random(360));
  coin.friction = 0.5;
  coin.scale = 0.4;
  coin.life = 1000;
  coin.setCollider("circle", 0 , 0, 75);
  coin.debug = true;
  coins.add(coin);
  
  bullets.remove();
  asteroids.remove();
  // createAsteroid(random(width), random(height));
}


function shipHitAsteroid(ship, asteroids) {
  if (ship.health>0) {
    ship.health -= 10;
  }
  ship.bounce(asteroids);


  //hit sound effect
  hitSFX.play();

  //particle effect
  for (let i=0; i<10; i++) {
    particle = createSprite(asteroids.position.x, asteroids.position.y);
    particle.addImage(astParticleImg);
    particle.setSpeed(random(2, 9), random(360));
    particle.life = 10;
    particle.friction = 0.05;
    particle.scale = 0.25;
    particles.add(particle);
  }

  asteroids.remove();
}

function shipTouchCoin(ship, coins) {
  coins.attractionPoint(5, ship.position.x, ship.position.y);
  if (coins.overlapPoint(ship.position.x, ship.position.y)) {
    collectSFX.play();
    money += 1;
    coins.remove();
  }
  let plusOne = createSprite(ship.position.x, ship.position.y-40);
  plusOne.addImage(coinPlusImg);
  plusOne.setSpeed(3, 0);
  plusOne.friction = 0.2;
  plusOne.life = 50;
  drawSprite(plusOne);
  // coins.add(plusOne);
}



function shipControls() {

  if (keyWentDown("SPACE")) {
    createBullets();
    shootSFX.play();
  }

  if (keyDown("W")) {
    ship.changeAnimation("accelerating");
    ship.addSpeed(0.1, ship.rotation);
    thrustSFX.playMode("restart");
    if (!thrustSFX.isPlaying()) {
      thrustSFX.play();
    }
  }
  else {
    ship.changeAnimation("resting");
    thrustSFX.stop();
  }
  
  if (keyDown("A")) {
    ship.rotation -= 2;
  }

  if (keyDown("D")) {
    ship.rotation += 2;
  }
}

function createBG() {
  //create background elements
  for (let i=0; i<50; i++) {
    let stars = createSprite(random(0-marginW, sceneW+marginW), random(0-marginH, sceneH+marginH));
    stars.addImage("stars", starsImg);
    stars.scale = random(0.75, 1.25);
    bg.add(stars);
  }
  for (let i=0; i<200; i++) {
    let smallStars = createSprite(random(0-marginW, sceneW+marginW), random(0-marginH, sceneH+marginH));
    smallStars.addImage("small-stars", smallStarsImg);
    bg.add(smallStars);
  }

  for (let i=0; i<10; i++) {
    let galaxies = createSprite(random(0-marginW, sceneW+marginW), random(0-marginH, sceneH+marginH));
    galaxies.addImage("galaxies", galaxyImg);
    galaxies.scale = random(1.0, 1.5);
    bg.add(galaxies);
  }
}

function controlCamera() {
  //camera follows ship
  camera.on();
  camera.zoom = 1.5;
  camera.position.x = ship.position.x;
  camera.position.y = ship.position.y;

  //ship's boundary
  if (ship.position.y < 0) {
    ship.position.y = 0;
  }
  if (ship.position.y > sceneH) {
    ship.position.y = sceneH;
  }
  if (ship.position.x < 0) {
    ship.position.x = 0;
  }
  if (ship.position.x > sceneW) {
    ship.position.x = sceneW;
  }
}

function checkOffScreen() {
  for (let i=0; i<asteroids.length; i++) {
    let s = asteroids[i];
    if (s.position.x < 0-marginW) {
      s.position.x = sceneW+marginW;
    }
    if(s.position.x > sceneW+marginW) {
      s.position.x = 0-marginW;
    }
    if (s.position.y < 0-marginH) {
      s.position.y = sceneH+marginH;
    }
    if (s.position.y > sceneH+marginH) {
      s.position.y = 0-marginH;
    }
  }
}

function displayUI() {
  camera.off();
  textAlign(CENTER);
  // textFont("Press Start 2P");
  
  //fps
  textSize(20);
  fill("limegreen");
  text("FPS: " + Math.floor(frameRate()), width*0.95, height*0.05);

  //hp
  textSize(30);
  fill("red");
  text("HP: " + ship.health, width*0.5, height*0.95);

  rect(width*0.5 - width*0.2, height*0.95, width*0.2*2, height*0.025);
  // if (ship.overlap(asteroids)) {
  //   widthHp -= width*0.4/10;
  // }
  fill("green");
  rect(width*0.5 - width*0.2, height*0.95, width*0.2*2, height*0.025);
  

  //money
  // image(coinImg, 50, 50, 50, 50);\
  fill("yellow");
  text("Money: " + "$" + money, width*0.05, height*0.05);

  //score
  fill("white");
  textSize(60);
  text("Score: " + score, width*0.5, height*0.1);
}

