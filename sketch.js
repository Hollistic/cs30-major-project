// CS30 Major Project
// Umair Khan
// 10/19/2021
//
// Extra for Experts:
// - used a new library called p5.play
// - used a virtual camera to create an "open world" experience
// - created my own pixel art for sprites

//screen values
let sceneW;
let sceneH;
let marginW;
let marginH;

//ship values
let ship;

//asteroids
let asteroids;

//let bullets
let bullets;

let particles;

function setup() {
  //create window
  // if (windowHeight < windowWidth) {
  //   createCanvas(windowHeight*0.9, windowHeight*0.9);
  // }
  // else {
  //   createCanvas(windowWidth*0.9, windowWidth*0.9);
  // }

  createCanvas(1280*0.9, 800*0.9);

  //defines the extended camera scene for the player ship
  sceneW = width + width*0.75;
  sceneH = height + height*0.75;

  //defines the small value outside the player ship's boundary area (width and heights)
  marginW = width*0.4;
  marginH = height*0.4;

  //load ship
  shipRestImg = loadImage("assets/playership.png");
  shipThrustImg = loadImage("assets/playershipthrust.png");
  shipThrustImg2 = loadImage("assets/playershipthrust2.png");
  createShip(width/2, height/2, 50, 50, 5);

  //create bullets
  bulletsImg = loadImage("assets/bullet.png");
  bullets = new Group();
  
  //create asteroids group
  asteroidImg = loadImage("assets/bigasteroid.png");
  asteroidImg2 = loadImage("assets/bigasteroid2.png");
  astParticleImg = loadImage("assets/asteroid_particles.png");
  asteroids = new Group();
  for (let i=0; i<20; i++) {
    createAsteroid(random(width), random(height));
  } 

  //oarticles
  particles = new Group();

  //create background group
  starsImg = loadImage("assets/star.png");
  smallStarsImg = loadImage("assets/smallstar.png");
  galaxyImg = loadImage("assets/galaxy.png");
  bg = new Group();
  createBG();
  
}

function draw() {
  clear();
  background(0);

  controlCamera();

  shipControls();
  
  //all sprites are drawn, goes by layer order
  drawSprites(bg);
  drawSprites(asteroids);
  drawSprites(particles);
  drawSprites(bullets);
  drawSprite(ship);
  
  //object collision
  asteroids.bounce(asteroids);
  ship.bounce(asteroids);
  bullets.overlap(asteroids, bulletsHitAsteroid);

  
  //checks if object is off screen
  checkOffScreen();

  //displays framerate
  displayFramerate();
  // createMiniMap();
}

function createMiniMap() {
  
  let miniMapW = 200;
  let miniMapH = 200;
  copy(0, 0, width, height, width-miniMapW, height - miniMapH, miniMapW, miniMapH);
}

//creates a new ship
function createShip(x, y, w, h, speed) {
  ship = createSprite(x, y, w, h);
  ship.addImage("resting", shipRestImg);
  ship.addAnimation("accelerating", shipThrustImg, shipThrustImg2);
  ship.setCollider("rectangle", 0, 0, w/2, h/2);
  ship.maxSpeed = speed;
  ship.friction = 0.015;
  ship.debug = true;
}

function createAsteroid(x, y) {
  let asteroid = createSprite(x, y);
  asteroidSprite = random([asteroidImg, asteroidImg2]);
  asteroid.addImage(asteroidSprite);
  asteroid.setCollider("circle", 0, 0, 25);
  // asteroid.type = type;
  // if (type === 2) {
  //   asteroid.size = 0.6;
  // }
  // if (type === 1) {
  //   asteroid.size = 0.3;
  // }
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

function bulletsHitAsteroid(asteroids, bullets) {
  if (createBullets.life === 0) {
    bullets.remove();
  }

  // let brokenType = asteroid.type-1;
  // if (brokenType>0) {
  //   createAsteroid(brokenType, asteroids.position.x, asteroids.position.y);
  //   createAsteroid(brokenType, asteroids.position.x, asteroids.position.y);
  // }

  //particle effects
  for (let i=0; i<10; i++) {
    particle = createSprite(asteroids.position.x, asteroids.position.y);
    particle.addImage(astParticleImg);
    particle.setSpeed(random(2, 9), random(360));
    particle.life = 10;
    particle.friction = 0.05;
    particle.scale = 0.25;
    particles.add(particle);

  }
  bullets.remove();
  asteroids.remove();
  createAsteroid(random(width), random(height));
}


function createParticles(type) {
  
  
}

function shipControls() {

  if (keyWentDown("SPACE")) {
    createBullets();
  }

  if (keyDown("W")) {
    ship.changeAnimation("accelerating");
    ship.addSpeed(0.1, ship.rotation);
  }
  else {
    ship.changeAnimation("resting");
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
    let stars = createSprite(random(0-marginW, width+marginW), random(0-marginH, height+marginH));
    stars.addImage("stars", starsImg);
    bg.add(stars);
  }
  for (let i=0; i<150; i++) {
    let smallStars = createSprite(random(0-marginW, width+marginW), random(0-marginH, height+marginH));
    smallStars.addImage("small-stars", smallStarsImg);
    bg.add(smallStars);
  }

  for (let i=0; i<10; i++) {
    let galaxies = createSprite(random(0-marginW, width+marginW), random(0-marginH, height+marginH));
    galaxies.addImage("galaxies", galaxyImg);
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

function checkOffScreen() {
  for (let i=0; i<asteroids.length; i++) {
    let s = asteroids[i];
    if (s.position.x < 0-marginW) {
      s.position.x = width+marginW;
    }
    if(s.position.x > width+marginW) {
      s.position.x = 0-marginW;
    }
    if (s.position.y < 0-marginH) {
      s.position.y = height+marginH;
    }
    if (s.position.y > height+marginH) {
      s.position.y = 0-marginH;
    }
  }
}

function displayFramerate() {
  camera.off();
  textAlign(CENTER);
  fill("limegreen");
  textSize(20);
  text("FPS: " + Math.floor(frameRate()), width/2, 50);
}

