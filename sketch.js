
// Global Stack
var stack=[];

// Array to store all points
var points=[];

// Adjecency matrix
var matrix;

// Lock Varible so that other points do not hide the cursor from hand
// i.e in object Point, if mouse in in the circle it shows a HAND
// however, if mouse is inside '0' it is outside '5' and this '5'
// changes the cursor from HAND to ARROW which is not what we want.
// With this variable we lock so that cursor changes only when mouse
// leaves '0' and it is unaffected by '5'
var curLock;

// Initilizing prims table
var primsDistance = new Array(Infinity, Infinity, Infinity, Infinity, Infinity, Infinity);
var neighbour = new Array(0, 0, 0, 0, 0, 0);


// Helper function to create a 2D array easily
function create2DArray(numRows, numColumns) {
	let array = new Array(numRows); 
	for(let i = 0; i < numColumns; i++) {
		array[i] = new Array(numColumns); 
	}
	return array; 
}

// Function to make prims table
function calculatePrims(value, points){
  // Re-initialize prims table
  primsDistance=[Infinity, Infinity, Infinity, Infinity, Infinity, Infinity];
  neighbour=[value, value, value, value, value, value];
  points.forEach((point)=>{
    point.visited=false;
  });

  stack.push(value);
  while(stack.length>0){
    let node = stack.pop();
    points[node].visited=true;
    for(let i=0; i<points.length; i++){
      if(matrix[node][i] && !points[i].visited){
        stack.push(i);
        if(matrix[node][i]<primsDistance[i]){
          primsDistance[i]=matrix[node][i];
          neighbour[i]=node;
        }
      }
    }
  }
}

// ==============
// SETUP Function
// ==============
function setup(){
  createCanvas(1000, 600);

  // creating adjecency matrix by random
  matrix=create2DArray(6, 6);
  for(let i=5; i>=0; i--){
    for(let j=0; j<=i; j++){
      if(i===j)
        matrix[i][j]=0;
      else
        matrix[i][j]=random()>0.4?1:0;
      matrix[j][i]=matrix[i][j];
    }
  }

  // Make random Points
  for(i=0; i<6; i++)
    points[i]=new Point(random(50,550), random(50, 550),i, matrix);
  
  // Fill matrix with distances instead of 0 or 1 wrt the points
  for(let i=5; i>=0; i--){
    for(let j=0; j<=i; j++){
      if(matrix[i][j]){
        matrix[i][j]=Math.sqrt(sq(points[i].x-points[j].x)+sq(points[i].y-points[j].y));
        matrix[j][i]=matrix[i][j];
      }
    }
  }

  // Prims algorithm for first time wrt '0'
  calculatePrims(0, points);
}

// =============
// DRAW Function
// =============
function draw(){
  background(25);
  drawLines(matrix, neighbour);
  for(var i=0; i<6; i++)
    points[i].render();
  primsTable();
}

// Function to draw lines between adjacent points
function drawLines(matrix){
  push();
  stroke(255);
  for(let i=5; i>=0; i--)
    for(let j=0; j<i; j++){
      if(matrix[i][j]){
        // If the point is a prims neighbour, color it red else white
        if(neighbour[i]===j || neighbour[j]===i)
          stroke(255,0,0);
        else
          stroke(255);
        line(points[i].x, points[i].y, points[j].x, points[j].y);
      }
    }
  pop();
}

// Display information
function primsTable(){
  push();
  fill(255);
  stroke(255);
  // Names
  textSize(20);
  text("Prims Table", 750, 25, 750, 25);
  text("Name",700,45,700,45)
  for(let i=0; i<6; i++){
    text(i,720,70+i*20,720,70+i*20);
  }

  // Neighbours
  text("Neighbour",780,45,780,45);
  for(let i=0; i<6; i++){
    text(neighbour[i],800,70+i*20,800,70+i*20);
  }

  // Distance
  text("Distance",890,45,890,45);
  for(let i=0; i<6; i++){
    text(round(primsDistance[i]*100)/100,900,70+i*20,900,70+i*20);
  }

  // Adjecency Matrix
  text("Adjecency Matrix", 750, 220);
  for(let i=0; i<6; i++){
    text(i,750+i*40,250);
  }
  line(700,260,970,260);
  for(let i=0; i<6; i++){
    text(i,720,280+i*40);
  }
  line(740,230,740,500);
  for(let i=0; i<6; i++){
    for(let j=0; j<6; j++){
      noStroke();
      if(matrix[i][j]>0)
        fill(255,50,50);
      else
        fill(255);
      text(matrix[i][j]>0?1:0, 750+j*40, 280+i*40);
    }
  }
  pop();
}

// ============
// Object Point
// ============
var Point = function(x, y, i){
  this.i=i;
  this.visited=false;

  this.x=x;
  this.y=y;
  this.rgb=[random(0, 255), random(0, 255), random(0, 255)];
  this.neighbours=[];

  this.render=function(){
    this.checkClick();
    push();
    noStroke();
    fill(this.rgb[0], this.rgb[1], this.rgb[2]);
    ellipse(this.x, this.y, 30, 30);
    stroke(0);
    if(this.rgb.reduce((a,b)=>a+b, 0)/3>100)
      fill(0);
    else
      fill(255);
    text(this.i, this.x-4, this.y+4);
    pop();
  };

  this.checkClick=function(){
    if(Math.abs(mouseX-this.x)<15 && Math.abs(mouseY-this.y)<15){
      cursor(HAND);
      curLock=this.i;
      if(mouseIsPressed){
        console.log(this.i);
        calculatePrims(this.i, points);
      }
    }
    else
      if(curLock===this.i)
        cursor(ARROW);
  }
};