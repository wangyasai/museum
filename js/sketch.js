var data;
var rows;
var particles = [];
var degree = [];
var degree_ = [];//每一类别排在该类别的名次
var name = [];
var jiggle = false;
var s = 0;
var alpha = 200;
var counts = [];
var color1 ,color2, color3, color4;

var temp = 1;
var num1 = 0;
var num2 = 0;
var num3 = 0;
var num4 = 0;
var mapimg;
var lat = [];
var lon = [];

var ww = 1224;
var hh = window.innerHeight;
var zoom = 9;
var clat = 31.2;
var clon = 121.5;


function preload(){
  data = loadTable("data/museum.csv","header");

  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/light-v8/static/' +
  clon + ',' + clat + ',' + zoom + '/' +
  ww + 'x' + hh +
  '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');

  fontRegular = loadFont("data/NotoSansSC-Medium.otf");
}

function setup(){
  createCanvas(windowWidth, windowHeight);

  rows = data.getRowCount();
  for(var i = 0; i < rows; i++ ){
    particles[i] = new Particle();
    degree[i] = data.getNum(i,0);
    counts[i] = 0;
    lat[i] = data.getNum(i,3);
    lon[i] = data.getNum(i,2); 
    name[i] = data.getString(i,1);
  }

  allcounts();

  color1 = color( 'rgba(44, 80, 176, 0.8)' );
  color2 = color( 'rgba(36, 190, 128,0.8)' );
  color3 = color( 'rgba(255, 222, 84,0.8)' );
  color4 = color( 'rgba(255, 78, 125,0.8)' );
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}


function draw(){
  background(255);


  translate(width/2-(width-ww)/2,height/2);
  if(s == 0){   
    case1();
  }else if( s == 1 ){ 
    case4();
  }
  else if( s == 2 ){
    case3( 1 ,num1);
    case3( 2 ,num2 );
    case3( 3 ,num3 );
    case3( 4 ,num4 );
  }
  else if( s == 3){
    case2(1,-300,100); 
    case2(2,-100,100);
    case2(3, 100,100);
    case2(4, 300,100);
  }
}


function case1(){
  for(var i = 0; i < rows; i++ ){
    push();
    translate(-260,-150);
    particles[i].react(particles,200);
    particles[i].move();
    particles[i].display(degree[i]);
    particles[i].infor(name[i]);
    pop();
    }
}


function case2(n,posX,d){
  for(var i = 0; i < rows; i++ ){
    if(degree[i] == n){
      push();
      translate(posX,0);
      particles[i].react(particles,d);
      particles[i].move();
      particles[i].display(degree[i]);
      // particles[i].infor(name[i]);
      pop();
    }
  }
}  

function case3(n,counts){
  for(var i = 0; i<rows; i++){
    if(degree[i] == n){
      particles[i].display(degree[i]);
      particles[i].move1(degree_[i], n,counts);
      particles[i].infor(name[i]);
    }
  }
  textFont(fontRegular);
  textSize(20);
  fill(20);
  textAlign(LEFT);
  text(counts,60+(n-3)*250,-200);

  fill(20,60);
  textSize(80);
  text("博物馆",60+(1-3)*250,-200);
}

function case4(){
  push();
  imageMode(CENTER);
  image(mapimg, 0, 0);

  for(var i = 0; i<rows; i++){
    particles[i].display(degree[i]);
    particles[i].mapmove(lon[i], lat[i]);
    particles[i].infor(name[i]);
  }
  pop();
}

function mousePressed(){
  s++;
  print(s);
  if(s>4){
    s=0;
  }
}

//计算每一个等级的数量
function allcounts(){

  // for(var j = 0; j<rows; j++){  
  //   if(degree[j] == degree[temp]){
  //     counts[temp]++;
  //   }else if(degree[j] > degree[temp]){
  //     counts[temp]++;
  //     temp = j;
  //   }  
  // } 

  //计算不同震级的数量
  for(var k = 0; k<rows; k++){
    if(degree[k] == 1){
      num1++;
      degree_[k] = num1;
      
    }else if(degree[k] == 2){
      num2++;
      degree_[k] = num2;
      
    }else if(degree[k] == 3){
      num3++;
      degree_[k] = num3;
      
    }else if(degree[k] == 4){
      num4++;
      degree_[k] = num4;      
    }

  }
}


function Particle() {
  this.pos = createVector(random(width),random(height));
  this.vel = createVector(random(-1,1),random(-1,1));
  this.diameter = 10;
  this.dir;
  this.easing = 0.1;

  this.react = function(chain,r){
    for(var i =0; i<rows;i++){
      if(chain[i] != this){
        var d = p5.Vector.dist(this.pos,chain[i].pos);//this.pos与对象数组的距离
        var x = d - r;
        this.dir = p5.Vector.sub(chain[i].pos, this.pos) ;
        this.dir.normalize();

        this.dir.mult(x/20000);
        this.vel.add(this.dir);
      }
    }
    this.bounce();
    this.vel.mult(0.95);
  }


  this.move = function(){
    this.pos.add(this.vel);
  }


  this.display = function(degree){
    noStroke();
    if(degree == 1){
      fill(color1);
    }else if(degree == 2){
      fill(color2);
    }else if(degree == 3){
      fill(color3); 
    }else if(degree == 4){
      fill(color4);
    }
    ellipse(this.pos.x,this.pos.y,this.diameter,this.diameter);
  }


  this.bounce = function(){
    if((this.pos.x < this.diameter && this.vel.x < 0 )|| (this.pos.x > width - this.diameter && this.vel.x > 0)){
      this.vel.x = -this.vel.x*0.15;
    }
    if((this.pos.y < this.diameter && this.vel.y < 0 )||(this.pos.y > height - this.diameter && this.vel.y > 0)){
      this.vel.y = -this.vel.y*0.15;
    }
  }


  this.jiggle = function(){
    this.vel = createVector(random(-10,10),random(-10,10));
  }


  //分类柱状
  this.move1 = function(degree,num,counts){
    var x = int((degree-1)%10);
    var y = int((degree-1)/10);
    var s = 15;

    this.pos.x += ( 60+(num-3)*250 +  x*s - this.pos.x)*this.easing;
    this.pos.y += ( -200 + y*s - this.pos.y)*this.easing;
    

  }


  this.mapmove = function(lon,lat){
    var x = mercX(lon) - mercX(clon);
    var y = mercY(lat) - mercY(clat);

    this.pos.x += (x-this.pos.x)*this.easing;
    this.pos.y += (y-this.pos.y)*this.easing;
  } 


  this.infor = function(name){
    var d = dist(mouseX-width/2, mouseY-height/2, this.pos.x, this.pos.y);

    if(d<5){
      textSize(12);
      fill(50);
      noStroke();
      var s = name;
      text(1, mouseX-width/2+10, mouseY-height/2);
    
      fill(0,50);
      noStroke();
      ellipse(this.pos.x,this.pos.y,2*this.diameter,2*this.diameter);
      }
  }

}
