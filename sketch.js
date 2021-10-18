// Project Title
// Your Name
// Date
//
// Extra for Experts:
// - describe what you did to take this project "above and beyond"


function setup() {
  createCanvas(windowWidth, windowHeight);
}

function draw() {
  background(220);
  let choice = random(100);
  if (choice < 50) {
    rect(100, 100, 50, 50);
  }
  else {
    circle(100, 100, 50, 50);
  }
}
