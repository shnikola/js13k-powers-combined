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
  
  // Position and draw water-marker
  waterMarker.updatePosition();
	waterMarker.draw();
  
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

// Water marker

function WaterMarker() {
	this.position = { x: world.width * Math.random(), y: world.height };
	this.velocity = { x: 0, y: 0 };
	this.size = 6;
	this.topSpeed = 1;
  this.sensorRadius = 30;
}
WaterMarker.prototype = new Point();
WaterMarker.prototype.updatePosition = function() {
  this.position.x = limitedX(this.position.x + this.velocity.x);
  this.position.y = limitedY(this.position.y + this.velocity.y);
  if (this.distanceTo(mouse) < this.sensorRadius) {
    this.velocity.x = (this.position.x - mouse.x) * this.topSpeed;
    this.velocity.y = (this.position.y - mouse.y) * this.topSpeed;
  } else {
    this.velocity.x = this.velocity.x * 0.9;
    this.velocity.y = this.velocity.y * 0.9;
  }
  return;
};
WaterMarker.prototype.draw = function() {
	context.fillStyle = "#0000ff";
  context.beginPath();
	context.arc(this.position.x, this.position.y, this.size, 0, Math.PI*2, true);
	context.fill();
};

function limitedX(value) { return Math.min(world.width, Math.max(0, value)); }
function limitedY(value) { return Math.min(world.height, Math.max(0, value)); }

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
