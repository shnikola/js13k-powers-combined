/* 
Here begins a beautiful story...

  ██▓███   ▒█████   █     █░▓█████  ██▀███    ██████     ▄████▄   ▒█████   ███▄ ▄███▓ ▄▄▄▄    ██▓ ███▄    █ ▓█████ ▓█████▄
 ▓██░  ██▒▒██▒  ██▒▓█░ █ ░█░▓█   ▀ ▓██ ▒ ██▒▒██    ▒    ▒██▀ ▀█  ▒██▒  ██▒▓██▒▀█▀ ██▒▓█████▄ ▓██▒ ██ ▀█   █ ▓█   ▀ ▒██▀ ██▌
 ▓██░ ██▓▒▒██░  ██▒▒█░ █ ░█ ▒███   ▓██ ░▄█ ▒░ ▓██▄      ▒▓█    ▄ ▒██░  ██▒▓██    ▓██░▒██▒ ▄██▒██▒▓██  ▀█ ██▒▒███   ░██   █▌
 ▒██▄█▓▒ ▒▒██   ██░░█░ █ ░█ ▒▓█  ▄ ▒██▀▀█▄    ▒   ██▒   ▒▓▓▄ ▄██▒▒██   ██░▒██    ▒██ ▒██░█▀  ░██░▓██▒  ▐▌██▒▒▓█  ▄ ░▓█▄   ▌
 ▒██▒ ░  ░░ ████▓▒░░░██▒██▓ ░▒████▒░██▓ ▒██▒▒██████▒▒   ▒ ▓███▀ ░░ ████▓▒░▒██▒   ░██▒░▓█  ▀█▓░██░▒██░   ▓██░░▒████▒░▒████▓
 ▒▓▒░ ░  ░░ ▒░▒░▒░ ░ ▓░▒ ▒  ░░ ▒░ ░░ ▒▓ ░▒▓░▒ ▒▓▒ ▒ ░   ░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒░   ░  ░░▒▓███▀▒░▓  ░ ▒░   ▒ ▒ ░░ ▒░ ░ ▒▒▓  ▒
 ░▒ ░       ░ ▒ ▒░   ▒ ░ ░   ░ ░  ░  ░▒ ░ ▒░░ ░▒  ░ ░     ░  ▒     ░ ▒ ▒░ ░  ░      ░▒░▒   ░  ▒ ░░ ░░   ░ ▒░ ░ ░  ░ ░ ▒  ▒
 ░░       ░ ░ ░ ▒    ░   ░     ░     ░░   ░ ░  ░  ░     ░        ░ ░ ░ ▒  ░      ░    ░    ░  ▒ ░   ░   ░ ░    ░    ░ ░  ░
              ░ ░      ░       ░  ░   ░           ░     ░ ░          ░ ░         ░    ░       ░           ░    ░  ░   ░
                                                        ░                                  ░                        ░
(A game by Beta, Ita, Jopa & Nikola)
*/

var DEFAULT_WIDTH = 640;
var DEFAULT_HEIGHT = 480;
var BORDER_WIDTH = 0;
var FRAMERATE = 60;

var world = {
	width: DEFAULT_WIDTH,
	height: DEFAULT_HEIGHT
}

var canvas = null;
var context = null;

// User Controls
var mouse = {
  x: 0,
  y: 0,
  pressed: 0
}
var pressedKeys = {};

// User 
var particles = [];
var waterMarker = null;

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');

  canvas.width = world.width;
	canvas.height = world.height;
  
  waterMarker = new WaterMarker();
  
	document.addEventListener('mousemove', documentMouseMoveHandler, false);
	document.addEventListener('mousedown', documentMouseDownHandler, false);
	document.addEventListener('mouseup', documentMouseUpHandler, false);
	document.addEventListener('keydown', documentKeyDownHandler, false);
	document.addEventListener('keyup', documentKeyUpHandler, false);
  
	function documentMouseMoveHandler(event){
		mouse.x = event.clientX - (window.innerWidth - world.width) * 0.5 - BORDER_WIDTH;
		mouse.y = event.clientY - (window.innerHeight - world.height) * 0.5 - BORDER_WIDTH;
	}
	
	function documentMouseDownHandler(event){
		mouse.pressed = true;
	}
	
	function documentMouseUpHandler(event) {
		mouse.pressed = false;
    console.log("M: ", waterMarker.position.x, waterMarker.position.y);
	}
  
	function documentKeyDownHandler(event) {
	  pressedKeys[event.keyCode] = true;
	}
  
	function documentKeyUpHandler(event) {
		delete pressedKeys[event.keyCode]
	}  
  
  animate();
}


/**
 * Called on every frame to update the game properties
 * and render the current state to the canvas.
 */
function animate() {
	// Clear the canvas of all old pixel data
	context.clearRect(0, 0, canvas.width, canvas.height);
  
  // Water marker
  waterMarker.updatePosition();
	waterMarker.draw();
  if (mouse.pressed) {
    waterMarker.shoot();
  }

  // Particles
  for (var i = 0; i < particles.length; i++) {
    particles[i].updatePosition();
    particles[i].draw();
    if (particles[i].dead) particles.splice(i, 1); // hoće li for petlja raditi ok nakon ovog?
  }
  
  requestAnimFrame(animate);
}


// Basic point 

function Point(x, y) {
	this.position = { x: x, y: y };
}
Point.prototype.distanceTo = function(p) {
	var dx = p.x-this.position.x;
	var dy = p.y-this.position.y;
	return Math.sqrt(dx*dx + dy*dy);
};
Point.prototype.clonePosition = function() {
	return { x: this.position.x, y: this.position.y };
};

function WaterParticle() {
}
WaterParticle.prototype = new Point();
WaterParticle.prototype.updatePosition = function() {
  this.position.x = this.position.x + this.velocity.x;
  this.position.y = this.position.y + this.velocity.y;
  this.dead = outOfWorld(this.position)
  console.log(this.velocity)
  
}
WaterParticle.prototype.draw = function() {
	context.fillStyle = "#2076f5";
  context.fillRect(this.position.x, this.position.y, 5, 5);
}

// Water marker

function WaterMarker() {
	this.position = { x: world.width * Math.random(), y: world.height };
	this.velocity = 0;
  this.direction = {x: 0, y: -1};
  this.rotation = 1;
  this.rotationSet = false;
	this.size = 6;
	this.topSpeed = 90;
  this.sensorRadius = 220;
}
WaterMarker.prototype = new Point();
WaterMarker.prototype.updatePosition = function() {
  var movement = this.velocity;
  while (movement > 0) {
    movement = this.move(movement);
  }
  var md = this.distanceTo(mouse);
  if (md < this.sensorRadius) {
    if (!this.rotationSet) { this.rotation = Math.sign(Math.random() - 0.5); this.rotationSet = true }
    this.velocity = (1 - md / this.sensorRadius) * this.topSpeed;
  } else if (this.velocity > 1) {
    this.velocity = this.velocity * 0.8;
  } else {
    this.rotationSet = false;
    this.velocity = 0;
  } 
  
};

WaterMarker.prototype.move = function(movement) {
  if (movement <= 0) return movement;
  var a = (this.direction.x == 0) ? "x" : "y";
  var limit = (this.direction.x == 0) ? world.width : world.height;
  var dir = this.rotation * (-this.direction.x + this.direction.y);
  var pos = this.position[a] + dir*movement;
  if (pos < 0) {
    movement = movement - this.position[a]; 
    this.position[a] = 0;
    this.rotate();
    return movement;
  } else if (pos > limit) {
    movement = movement - (limit - this.position[a]);
    this.position[a] = limit
    this.rotate();
    return movement;
  } else {
    this.position[a] = pos;
    return 0;
  }
}
WaterMarker.prototype.rotate = function() {
  this.direction = {x: -1 * this.rotation * this.direction.y, y: this.rotation * this.direction.x};
};
WaterMarker.prototype.draw = function() {
	context.fillStyle = "#2096e5";
  context.beginPath();
	context.arc(this.position.x, this.position.y, this.size, 0, Math.PI*2, true);
	context.fill();
};
WaterMarker.prototype.shoot = function() {
  console.log(particles)
	if (particles.length > 40) return;
  var q = 20;	
	while (--q >= 0) {
		var p = new WaterParticle();
		p.position.x = this.position.x + (Math.random() - 0.5) * 40;
		p.position.y = this.position.y;
		p.velocity = { x: this.direction.x *  (Math.random() + 0.5), y: this.direction.y * (Math.random() + 0.5) };
    console.log(p.velocity)
		particles.push( p );
	}
}

function outOfWorld(position) { return position.x < 0 || position.x > world.width || position.y < 0 || position.y > world.height; }
function limitedX(value) { return Math.min(world.width, Math.max(0, value)); }
function limitedY(value) { return Math.min(world.height, Math.max(0, value)); }

Math.sign = function(n) { return n?n<0?-1:1:0 }
// shim with setTimeout fallback from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
          window.webkitRequestAnimationFrame || 
          window.mozRequestAnimationFrame    || 
          window.oRequestAnimationFrame      || 
          window.msRequestAnimationFrame     || 
          function(/* function */ callback, /* DOMElement */ element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

init();
