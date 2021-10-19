// CS30 Major Project
// Umair Khan
// 10/19/2021
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"

let sceneW;
let sceneH;
let playerShip;


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
  
  //load sprites

  //create ship
  playerShip = new Ship(0, 0);
  
  
}

function draw() {
  background(220);
}

class Ship {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.sprite = createSprite(this.x, this.y, 50, 50);

  }

  display() {

  }

}
