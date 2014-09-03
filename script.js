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
var waterMaker = null;
var fireMaker = null;

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');

  canvas.width = world.width;
	canvas.height = world.height;
  
  waterMaker = new WaterMaker();
  fireMaker = new FireMaker();
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
    console.log("M: ", mouse.x, mouse.y);
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
  
  // Water maker
  waterMaker.updatePosition();
	waterMaker.draw();

  if (mouse.pressed) {
    waterMaker.shoot();
  }
  
  // Fire maker
  fireMaker.updatePosition();
  fireMaker.draw();
  
  // Particles
  for (var i = 0; i < particles.length; i++) {
    particles[i].updatePosition();
    particles[i].draw();
    if (particles[i].dead) {
      particles.splice(i, 1);
      i--;
    }
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

// ================ WATER ================

function WaterParticle() {
	this.position = { x: 0, y: 0 };
}
WaterParticle.prototype = new Point();
WaterParticle.prototype.updatePosition = function() {
  this.position.x = this.position.x + this.velocity.x;
  this.position.y = this.position.y + this.velocity.y;
  this.dead = outOfWorld(this.position)
}
WaterParticle.prototype.draw = function() {
	context.fillStyle = "#2076f5";
  context.fillRect(this.position.x, this.position.y, 5, 5);
}


function WaterMaker() {
	this.position = { x: world.width * Math.random(), y: world.height };
	this.velocity = 0;
  this.direction = {x: 0, y: -1};
  this.rotation = 1;
  this.rotationSet = false;
	this.size = 20;
	this.topSpeed = 90;
  this.sensorRadius = 180;
}
WaterMaker.prototype = new Point();
WaterMaker.prototype.updatePosition = function() {
  var movement = this.velocity;
  while (movement > 0) {
    movement = this.move(movement);
  }
  var md = this.distanceTo(mouse);
  if (md < this.sensorRadius) {
    if (!this.rotationSet) { this.rotation = Math.sign(Math.random() - 0.5); this.rotationSet = true }
    // Linearno po udaljenosti od kursora, min brzina je 4
    this.velocity = (1 - md / this.sensorRadius) * this.topSpeed + 4 * md / this.sensorRadius; 
  } else if (this.velocity > 1) {
    this.velocity = this.velocity * 0.9;
  } else {
    this.rotationSet = false;
    this.velocity = 0;
  }
  
};

WaterMaker.prototype.move = function(movement) {
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
WaterMaker.prototype.rotate = function() {
  this.direction = {x: -1 * this.rotation * this.direction.y, y: this.rotation * this.direction.x};
};
WaterMaker.prototype.draw = function() {
	context.fillStyle = "#2096e5";
  if (this.direction.x == 0) {
	  context.fillRect(this.position.x - 10, this.position.y - 5, 20, 10);
  } else {
	  context.fillRect(this.position.x - 5, this.position.y - 10, 10, 20);
  }
};
WaterMaker.prototype.shoot = function() {
	if (particles.length > 40) return;
  var q = 20;
	while (--q >= 0) {
		var p = new WaterParticle();
		p.position.x = this.position.x + (Math.random() - 0.5) * 40 * this.direction.y;
		p.position.y = this.position.y + (Math.random() - 0.5) * 40 * this.direction.x;
		p.velocity = { x: this.direction.x * 10 * (1 - Math.random() * 0.2), y: this.direction.y * 10 * (1 - Math.random() * 0.2) };
		particles.push( p );
	}
}

// ================ FIRE ================

function FireMaker() {
	this.left = new Point(Math.random() * world.width / 2, Math.random() * world.height);
	this.right = new Point(world.width / 2 * (1 + Math.random()), Math.random() * world.height);
  this.radius = 5;
  this.angle = -Math.PI/2;
}
FireMaker.prototype.updatePosition = function() {
  this.left.position.x = (this.left.position.x + 3 * Math.sin(this.angle/2)) % world.width
  this.left.position.y = (this.left.position.y + 3 * Math.cos(this.angle))% world.height

  this.right.position.x = (this.right.position.x + 3 * Math.cos(this.angle*1.2  )) % world.width
  this.right.position.y = (this.right.position.y + 3 * Math.sin(this.angle)) % world.height


  this.angle = (this.angle + 0.1) % (2 * Math.PI);
};

FireMaker.prototype.draw = function() {
	context.beginPath();
  context.strokeStyle = "#ca3220";
	context.lineWidth = 3;
	context.arc(this.left.position.x, this.left.position.y, this.radius, this.angle, this.angle + Math.PI, true);
	context.stroke();
	context.beginPath();
	context.arc(this.right.position.x, this.right.position.y, this.radius, this.angle, this.angle + Math.PI);
	context.stroke();
};


// ======= AUDIO =========

var actx = new (window.AudioContext || window.webkitAudioContext)();
var audioNodes = {
  src:  actx.createScriptProcessor(4096, 0, 1),
  vol: actx.createGain(),
  dest: actx.destination
}
audioNodes.src.onaudioprocess = function(e) {
  var ob = e.outputBuffer;
  for (var c = 0; c < ob.numberOfChannels; c++) {
    var od = ob.getChannelData(c);
    for (var s = 0; s < ob.length; s++) {
      od[s] = sound(actx.currentTime + ob.duration * s / ob.length);
    }
  }
}

audioNodes.vol.gain.value = 1; // Change for sound
audioNodes.src.connect(audioNodes.vol);
audioNodes.vol.connect(audioNodes.dest);

function sound(t) {
  return 0.2 * Math.sin(mouse.x * t * Math.PI * 2) + 0.2 * Math.sin(mouse.y * t * Math.PI * 2);
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
