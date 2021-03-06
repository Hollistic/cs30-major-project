// CS30 Major Project
// Umair Khan
// 10/19/2021
//
// Extra for Experts:
// - used a new library called p5.play, used virtual camera to create open experience
// - created my own pixel art for sprites
// - implemented sound effects
// - used class objects with the p5.play Group() feature along with the sprites function
// - created boss asteroids (more enemies)
// - created coins and bullet upgrades
//
// Notes:
// - Audio bug should be fixed but it still occurs ocasionally, I tried my best to fix it using createAudio() rather then loadAudio()
// - debug mode can be accessed by pressing P
//
// Instructions:
// - Try to avoid the asteroids by shooting and get the highest score possible! 
// - Asteroids respawn every 60 seconds, boss asteroids spawn every 45 seconds (they take 10 hits to explode), all of these spawn at the top 
// - Press W to thrust your ship and press A/D to rotate
// - Press Spacebar to shoot
// - You can upgrade your bullets by pressing the number 1 key, they will shoot further (cost 20 coins)
// - Have fun!


//screen values
let sceneW;
let sceneH;
let marginW;
let marginH;

//game 
let gameStart = false;
let gameOver = false;
let debugMode = false;
let score = 0;
let money = 0;
let shipHP = 10;
let bulletLife = 40;
let hpBarWidth;

//game timer
let timer = 1000;
let addPoints = timer;
let spawnMoreAsteroids = timer*60;
let spawnBossAsteroid = timer*45;
let asteroidAmount = 3;

//game objects
let ship;
let asteroids;
let bossAsteroids;
let playerBullets;
let enemyBullets;
let coins;
let particles;



//------------------------------------------------------------------------//

function preload() {
  soundFormats("mp3", "wav");

  //load ship
  shipRestImg = loadImage("assets/images/player_ship.png");
  shipThrustImg = loadImage("assets/images/player_ship_thrust.png");
  shipThrustImg2 = loadImage("assets/images/player_ship_thrust_2.png");
  thrustSFX = loadSound("assets/audio/thrust.wav");
  shootSFX = createAudio("assets/audio/shoot.wav");
  hitSFX = createAudio("assets/audio/hit.wav");
  collectSFX = createAudio("assets/audio/collect.wav");
  upgradeSFX = createAudio("assets/audio/upgrade.wav");

  //load asteroid
  asteroidImg = loadImage("assets/images/asteroid_grey.png");
  asteroidImg2 = loadImage("assets/images/asteroid_blue.png");
  bossAsteroidImg = loadImage("assets/images/big_asteroid.png");
  astParticleImg = loadImage("assets/images/asteroid_particles.png");
  explodeSFX = createAudio("assets/audio/explode.wav");

  //load bullets
  bulletsImg = loadImage("assets/images/bullet.png");

  //load coin
  coinImg = loadImage("assets/images/coin.png");
  coinPlusImg = loadImage("assets/images/plus_one.png");

  //load background
  starsImg = loadImage("assets/images/star.png");
  smallStarsImg = loadImage("assets/images/small_star.png");
  galaxyImg = loadImage("assets/images/galaxy.png");

  //load upgrade
  bulletUpgradeImg = loadImage("assets/images/bullet_upgrade.png");
  bulletUpgradeMaxImg = loadImage("assets/images/bullet_upgrade_finished.png");

  //music
  musicLoop = createAudio("assets/audio/madlibs_assignment_reference.mp3");
  musicLoopSecret = loadSound("assets/audio/wunna.mp3");
  gameOverMusic = loadSound("assets/audio/gameOver.mp3");
}

function setup() {
  
  // if (windowHeight < windowWidth) {
  //   createCanvas(windowHeight*0.9, windowHeight*0.9);
  // }
  // else {
  //   createCanvas(windowWidth*0.9, windowWidth*0.9);
  // }

  // createCanvas(1280*0.9, 800*0.9);

  createCanvas(windowWidth, windowHeight);

  //defines the extended camera scene for the player ship, you can extend these values for a bigger play area
  sceneW = width + width*0.2;
  sceneH = height + height*0.2;

  //defines the small value outside the player ship's boundary area (width and heights)
  marginW = width*0.4;
  marginH = height*0.4;

  //SHIP HEALTH
  hpBarWidth = width*0.4;

  //creates player ship
  createShip(width/2, height/2, 50, 50, 5, shipHP);

  //create bullets
  playerBullets = new Group();
  enemyBullets = new Group();
  
  //create asteroids group, spawn 30 asteroids at start of game
  asteroids = new Group();
  bossAsteroids = new Group();
  for (let i=0; i<30; i++) {
    createAsteroid(random(width), random(height), 3);
  } 

  //particles
  particles = new Group();

  //coins
  coins = new Group();

  //create background group
  bg = new Group();
  createBG();
  
  
}

function draw() {
  // clear();
  background(0);

  if (gameOver === true) {
    drawSprites(bg);
    gameOverScreen();
  }
  else {
    
    controlCamera();

    shipControls();
    
    //all sprites are drawn, goes by layer order
    drawSprites(bg);
    drawSprites(coins);
    drawSprites(asteroids);
    drawSprites(bossAsteroids);
    drawSprites(particles);
    drawSprites(playerBullets);
    drawSprite(ship);
    
    //checks for collision
    checkCollision();

    //checks if object is off screen
    checkOffScreen();

    //game timer
    gameTimer();

    //displays ui elements
    displayUI();

    //check for game over
    if (ship.health <= 0) {
      gameOver = true;
    } 
    
  } 
}

//unused minimap idea
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
  ship.debug = debugMode;
}

function createAsteroid(x, y, size) {
  //create an asteroid and defining values
  let asteroid = createSprite(x, y);
  asteroidSprite = random([asteroidImg, asteroidImg2]);
  asteroid.addImage(asteroidSprite);
  asteroid.setCollider("circle", 0, 0, 25);

  //asteroid sizes when splitting
  asteroid.size = size;
  if (size === 2) {
    asteroid.scale = 0.75;
  }
  if (size === 1) {
    asteroid.scale = 0.4;
  }
  //defining values
  asteroid.mass = random(1, 2);
  asteroid.setSpeed(random(2, 5), random(360));
  asteroid.rotationSpeed = random(0.2, 1);
  asteroid.useQuadTree = true;
  asteroid.debug = debugMode;
  
  //push to group
  asteroids.add(asteroid);
  return asteroid;
}

//big boss asteroid
function createBossAsteroid(x, y, hp) {
  let asteroid = createSprite(x, y);
  asteroid.addImage(bossAsteroidImg);
  asteroid.setCollider("circle", 0, 0, 45);
  asteroid.scale = 1.5;
  asteroid.mass = 5;
  asteroid.setSpeed(3, random(360));
  asteroid.rotationSpeed = random(0.5, 1);
  asteroid.useQuadTree = true;
  asteroid.health = hp;
  //push to group
  bossAsteroids.add(asteroid);
  return asteroid;
} 

function createBullets(type) {
  //create a bullet sprite and assign values
  if (type === "player") {
    let bullet = createSprite(ship.position.x, ship.position.y);
    bullet.addImage(bulletsImg);
    bullet.life = bulletLife;
    bullet.rotateToDirection = true;
    bullet.setSpeed(ship.getSpeed()+6, ship.rotation);
    bullet.debug = debugMode;
    playerBullets.add(bullet);
  }
}

function checkCollision() {
  //checking for object collision, bouncing and overlaps which use a callback function
  asteroids.bounce(asteroids);
  bossAsteroids.bounce(bossAsteroids);
  bossAsteroids.bounce(asteroids);
  ship.overlap(asteroids, shipHitAsteroid);
  ship.overlap(bossAsteroids, shipHitBossAsteroid);
  playerBullets.overlap(asteroids, bulletsHitAsteroid);
  playerBullets.overlap(bossAsteroids, bulletsHitBossAsteroid);
  ship.overlap(coins, shipTouchCoin);
  
}

function bulletsHitAsteroid(bullets, asteroids) {
  
  //spawns broken asteroids
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
  coin.scale = 0.8;
  coin.life = 1000;
  coin.setCollider("circle", 0 , 0, 75);
  coins.add(coin);

  //add points to score
  if (asteroids.size === 3) {
    score += 100;
  }
  else if (asteroids.size === 2) {
    score += 50;
  }
  else if (asteroids.size === 1) {
    score += 25;
  }
  
  //remove bullets and asteroids
  bullets.remove();
  asteroids.remove();
}

function bulletsHitBossAsteroid(bullets, bossAsteroids) {
  //the boss asteroid loses health when shot at
  if (bossAsteroids.health > 0) {
    bossAsteroids.health -=1;
  }
  //if health dropes to 0 or below the following runs
  if (bossAsteroids.health <= 0) {
    explodeSFX.play();
    score += 300;
    bossAsteroids.remove();
    //drops 5 coins
    for (let i=0; i<5; i++) {
      coin = createSprite(bossAsteroids.position.x+random(-10, 10), bossAsteroids.position.y+random(-10, 10));
      coin.addImage(coinImg);
      coin.setSpeed(0, random(360));
      coin.friction = 0.5;
      coin.scale = 0.8;
      coin.life = 1000;
      coin.setCollider("circle", 0 , 0, 75);
      coins.add(coin);
    } 
  }
  bullets.remove();
}

function shipHitAsteroid(ship, asteroids) {
  //ship hp lost
  if (ship.health > 0) {
    ship.health -= 1;
  }
  hpBarWidth -= width*0.4/shipHP;

  //hit sound effect, bounce
  hitSFX.play();
  ship.bounce(asteroids);
  

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

function shipHitBossAsteroid(ship, bossAsteroids) {
  bossAsteroids.health -=1;
  //ship hp lost
  if (ship.health > 0) {
    ship.health -= 1;
  }
  hpBarWidth -= width*0.4/shipHP;

  ship.bounce(bossAsteroids);
  hitSFX.play();
}

function shipTouchCoin(ship, coins) {
  //if ship is in coins collision box, coins will be attracted to ship, when overlapped with centre of ship collect
  coins.attractionPoint(5, ship.position.x, ship.position.y);
  if (coins.overlapPoint(ship.position.x, ship.position.y)) {
    collectSFX.play();

    money += 1;
    coins.remove();
    score += 20;
  }
  //creates small +1 particles effect
  let plusOne = createSprite(ship.position.x, ship.position.y-40);
  plusOne.addImage(coinPlusImg);
  plusOne.setSpeed(3, 0);
  plusOne.friction = 0.2;
  plusOne.life = 50;
  drawSprite(plusOne);
}

function shipControls() {
  //debug collision
  if (keyWentDown("P")) {
    if (!debugMode){
      debugMode = true;
    }
    else if (debugMode){
      debugMode = false;
    }
    for (let i=0; i<allSprites.length; i++) {
      allSprites[i].debug = debugMode;
    }
  }

  //upgrade bullets
  if (keyWentDown("1")) {
    if (money >= 20) {
      if (bulletLife < 100) {
        money-= 20;
        bulletLife += 10;
        upgradeSFX.play();
      }
    }
  }
  
  //shooting controls
  if (keyWentDown("SPACE")) { 
    createBullets("player");
    shootSFX.play();
  }

  //moving controls
  if (keyDown("W")) { //thrust
    ship.changeAnimation("accelerating");
    ship.addSpeed(0.1, ship.rotation);
    thrustSFX.playMode("restart");
    if (!thrustSFX.isPlaying()) {
      thrustSFX.play();
    }
    //plays game music
    musicLoop.volume(0.5);
    musicLoop.loop();
  }
  else {
    ship.changeAnimation("resting"); //resting
    thrustSFX.stop();    
  }
  
  if (keyDown("A")) { //turn left
    ship.rotation -= 2.5;
  }

  if (keyDown("D")) { //turn right
    ship.rotation += 2.5;
  }
}

function createBG() {
  //create background elements
  for (let i=0; i<50; i++) { //regular stars
    let stars = createSprite(random(0-marginW, sceneW+marginW), random(0-marginH, sceneH+marginH));
    stars.addImage("stars", starsImg);
    stars.scale = random(0.75, 1.25);
    bg.add(stars);
  }
  for (let i=0; i<200; i++) { //small stars
    let smallStars = createSprite(random(0-marginW, sceneW+marginW), random(0-marginH, sceneH+marginH));
    smallStars.addImage("small-stars", smallStarsImg);
    bg.add(smallStars);
  }

  for (let i=0; i<10; i++) { //galaxies
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
  //check if asteroids are off screen, if so teleport to other side
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
  for (let i=0; i<bossAsteroids.length; i++) {
    let s = bossAsteroids[i];
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


function gameTimer() {
  //adds 1 point every second
  if (millis() > addPoints) {
    addPoints = millis() + timer;
    console.log("time elapsed: " + Math.floor(millis() / 1000));
    score += 1;
  }

  //spawn more asteroids
  if (millis() > spawnMoreAsteroids) {
    for (let i=0; i<asteroidAmount; i++) {
      createAsteroid(random(0, width), random(30-marginH, -20), 3);
    } 
    asteroidAmount += 1;
    spawnMoreAsteroids = millis() + timer*60;
  }

  //spawn boss asteroids
  if (millis() > spawnBossAsteroid) {
    createBossAsteroid(random(0, width), random(30-marginH, -20), 10);
    spawnBossAsteroid = millis() + timer*45;
  }
}


function displayUI() {
  camera.off();
  textAlign(CENTER);
  imageMode(CENTER);
  // textFont("Press Start 2P");
  
  //fps
  textSize(20);
  fill("limegreen");
  text("FPS: " + Math.floor(frameRate()), width*0.95, height*0.05);

  //money
  // image(coinImg, 50, 50, 50, 50);\
  fill("yellow");
  text("Money: " + "$" + money, width*0.05, height*0.05);

  //Ship HP
  textSize(30);
  fill("red");
  text("HP: " + ship.health, width*0.5, height*0.925);
  //HP Bar
  noStroke();
  rect(width*0.5 - width*0.2, height*0.95, width*0.4, height*0.025);
  fill("green");
  rect(width*0.5 - width*0.2, height*0.95, hpBarWidth, height*0.025);
  
  //score
  fill("white");
  textSize(60);
  text("Score: " + score, width*0.5, height*0.1);

  //upgrade
  image(bulletUpgradeImg, width*0.1, height*0.9);
  textSize(15);
  text("Press 1: Upgrade Bullet", width*0.1, height*0.95);
}

function gameOverScreen() {
  camera.off();
  
  //music
  musicLoop.stop();
  if (!gameOverMusic.isPlaying()) {
    gameOverMusic.loop();
  }
  
  //create the game over screen
  textSize(70);
  fill("red");
  text("GAME OVER", width/2, height*0.4);
  fill("white");
  text("SCORE: " + score, width/2, height*0.5);
  fill("limegreen");
  text("Try again? Press R!", width/2, height*0.9);
  imageMode(CENTER);
  image(shipThrustImg, width*0.25, height/2, 200, 200);
  image(asteroidImg, width*0.75, height/2, 200, 200);

  //restart the game
  if (keyWentDown("R")) {
    //reset some values
    score = 0;
    money = 0;
    asteroidAmount = 10;
    gameOverMusic.stop();
    for (let i=0; i<allSprites.length; i++) {
      allSprites[i].remove();
    }

    //run setup
    setup();
    gameOver = false;
  }
}
