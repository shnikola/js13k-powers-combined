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
};

var canvas = null;
var context = null;

// User Controls
var mouse = {
  x: 0,
  y: 0,
  pressed: 0
};
var pressedKeys = {};

// User
var particles = [];
var maker = null;
var makerSelectable = true;

function init() {
  canvas = document.getElementById("canvas");
  context = canvas.getContext('2d');

  canvas.width = world.width;
	canvas.height = world.height;

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
		delete pressedKeys[event.keyCode];
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

  selectMaker();

  if (maker) {
    maker.updatePosition();
    maker.draw();
  }

  // Particles
  for (var i = 0; i < particles.length; i++) {
    particles[i].updatePosition();
    particles[i].draw();
    if (outOfWorld(particles[i])) {
      particles.splice(i, 1);
      i--;
    }
  }

  requestAnimFrame(animate);
}

function selectMaker() {
  if (pressedKeys[49]) { withLock(function(){ maker = new WaterMaker(); }, 500, "maker-switch", window); }
  else if (pressedKeys[50]) { withLock(function(){ maker = new FireMaker(); }, 500, "maker-switch", window); }
}

// Basic point

function Point(x, y) {
	this.x = x;
  this.y = y;
}
Point.prototype.distanceTo = function(p) {
	var dx = p.x-this.x;
	var dy = p.y-this.y;
	return Math.sqrt(dx*dx + dy*dy);
};

// ================ WATER ================

function WaterMaker() {
	this.x = world.width * Math.random();
  this.y = world.height;
	this.velocity = 10;
  this.charging = false;
  this.direction = {x: 0, y: -1}; // smjer u kojem puca
  this.rotation = 1; // smjer u kojem će bježati
  this.rotationSet = false;
	this.topSpeed = 90;
  this.sensorRadius = 180;
	this.size = 10;
	this.sizeAngle = 0;
}
WaterMaker.prototype = new Point();
WaterMaker.prototype.updatePosition = function() {
  var movement = this.velocity;
  while (movement > 0) {
    movement = this.move(movement);
  }
  var md = this.distanceTo(mouse);
  if (md < this.sensorRadius) {
    if (!this.rotationSet) {
      this.rotation = Math.sign(Math.random() - 0.5);
      this.rotationSet = true;
    }
    // Linearno po udaljenosti od kursora, min brzina je 4
    this.velocity = (1 - md / this.sensorRadius) * this.topSpeed +
                    4 * md / this.sensorRadius;
  } else if (this.velocity > 1) {
    this.velocity *= 0.9;
  } else {
    this.rotationSet = false;
    this.velocity = 0;
  }

  if (mouse.pressed) {
    this.charging = true;
  }

  if (this.charging) {
    this.size += Math.sin(this.sizeAngle) * 4;
    this.sizeAngle = modulo(this.sizeAngle + 0.3, 2 * Math.PI);
  }

  if (this.charging && !mouse.pressed) {
    withLock(this.shoot, 400, "water-shoot", this);
  }
};

WaterMaker.prototype.move = function(movement) {
  if (movement <= 0) return movement;
  var a = (this.direction.x === 0) ? "x" : "y";
  var limit = (this.direction.x === 0) ? world.width : world.height;
  var dir = this.rotation * (-this.direction.x + this.direction.y);
  var pos = this[a] + dir*movement;
  if (pos < 0) {
    movement = movement - this[a];
    this[a] = 0;
    this.rotate();
    return movement;
  } else if (pos > limit) {
    movement -= (limit - this[a]);
    this[a] = limit;
    this.rotate();
    return movement;
  } else {
    this[a] = pos;
    return 0;
  }
};
WaterMaker.prototype.rotate = function() {
  this.direction = {x: -1 * this.rotation * this.direction.y, y: this.rotation * this.direction.x};
};
WaterMaker.prototype.draw = function() {
	context.fillStyle = "#2096e5";
  if (this.direction.x === 0) {
	  context.fillRect(this.x - this.size, this.y - 5, this.size * 2, 10);
  } else {
	  context.fillRect(this.x - 5, this.y - this.size, 10, this.size * 2);
  }
};
WaterMaker.prototype.shoot = function() {
  this.charging = false;
  var q = this.size;
	while (--q >= 0) {
    var x = this.x + (Math.random() - 0.5) * 2 * this.size;
    var y = this.y + (Math.random() - 0.5) * 2 * this.size;
		var p = new WaterParticle(x, y);
		p.velocity = {
      x: this.direction.x * 10 * (1 - Math.random() * 0.2),
      y: this.direction.y * 10 * (1 - Math.random() * 0.2)
    };
		particles.push( p );
	}
};
WaterMaker.prototype.sound = function(t) {
  var f = this.velocity > 5 ? (this.velocity * 300) : 0;
  return 0.2 * Math.sin(f * t * Math.PI * 2);
};

function WaterParticle(x, y) {
	this.x = x;
  this.y = y;
  this.size = 5;
}
WaterParticle.prototype = new Point();
WaterParticle.prototype.updatePosition = function() {
  this.x += this.velocity.x;
  this.y += this.velocity.y;
};
WaterParticle.prototype.draw = function() {
	context.fillStyle = "#2076f5";
  context.fillRect(this.x, this.y, this.size, this.size);
};

// ================ FIRE ================

function FireMaker() {
	this.left = new Point(Math.random() * world.width / 2, Math.random() * world.height);
	this.right = new Point(world.width / 2 * (1 + Math.random()), Math.random() * world.height);
  this.radius = 5;
  this.angle = -Math.PI/2;
  this.speed = [3, 10, false, false]; // normal, turbo, left on, right on
}
FireMaker.prototype.updatePosition = function() {
  if (pressedKeys[87]) {
    withLock(function() { this.speed[2] = !this.speed[2]; }, 200, "fire-left-switch", this);
  }
  if (pressedKeys[82]) {
    withLock(function() { this.speed[3] = !this.speed[3]; }, 200, "fire-right-switch", this);
  }
  if (pressedKeys[69]) {
    withLock(this.shoot, 1000, "fire-shoot", this);
  }

  var ls = this.speed[this.speed[2] ? 1 : 0];
  var rs = this.speed[this.speed[3] ? 1 : 0];
  this.left.x = modulo(this.left.x + ls * Math.sin(this.angle), world.width);
  this.left.y = modulo(this.left.y + ls * Math.cos(this.angle), world.height);
  this.right.x = modulo(this.right.x + rs * Math.cos(this.angle), world.width);
  this.right.y = modulo(this.right.y + rs * Math.sin(this.angle), world.height);

  this.angle = modulo(this.angle + 0.1, 2 * Math.PI);
};

FireMaker.prototype.draw = function() {
  context.strokeStyle = "#ca3220";
	context.lineWidth = 3;
	context.beginPath();
	context.arc(this.left.x, this.left.y, this.radius, this.angle, this.angle + Math.PI, true);
	context.stroke();
	context.beginPath();
	context.arc(this.right.x, this.right.y, this.radius, this.angle, this.angle + Math.PI);
	context.stroke();
};

FireMaker.prototype.shoot = function() {
  var d = this.left.distanceTo(this.right);
	for (var i = 0; i < d; i++) {
    var c = Math.random();
    var x = this.left.x + c * (this.right.x - this.left.x) + Math.random() * d / 100;
    var y = this.left.y + c * (this.right.y - this.left.y) + Math.random() * d / 100;
		var p = new FireParticle(x, y);
		particles.push( p );
	}
};

FireMaker.prototype.sound = function(t) {
  var f1 = this.left.x;
  var f2 = this.right.y;
  return 0.2 * Math.sin(f1 * t * Math.PI * 2) + 0.2 * Math.sin(f2 * t * Math.PI * 2);
};

function FireParticle(x, y) {
	this.x = x;
  this.y = y;
  this.size = 3;
}
FireParticle.prototype = new Point();
FireParticle.prototype.updatePosition = function() {
  this.x += (Math.random() - 0.5) * 2;
  this.y += (Math.random() - 0.2) * 2;
};
FireParticle.prototype.draw = function() {
	context.fillStyle = "#f64f0a";
  context.fillRect(this.x, this.y, this.size, this.size);
};


// ================ AIR ================

function AirMaker() {

}
AirMaker.prototype = new Point();
AirMaker.prototype.draw = function() {};
AirMaker.prototype.sound = function(t) {
  var f1 = Math.round(mouse.x/10)*10;
  var f2 = Math.round(mouse.y/10)*10;
  return 0.2 * Math.sin(f1 * t * Math.PI * 2) + 0.2 * Math.sin(f2 * t * Math.PI * 2);
};


// ================ AUDIO ================

var actx = window.AudioContext || window.webkitAudioContext;
var audioNodes = {
  src:  actx.createScriptProcessor(4096, 0, 1),
  vol: actx.createGain(),
  dest: actx.destination
};
audioNodes.src.onaudioprocess = function(e) {
  var ob = e.outputBuffer;
  for (var c = 0; c < ob.numberOfChannels; c++) {
    var od = ob.getChannelData(c);
    for (var s = 0; s < ob.length; s++) {
      od[s] = maker && maker.sound(actx.currentTime + ob.duration * s / ob.length) || 0;
    }
  }
};

audioNodes.vol.gain.value = 1; // Change for sound
audioNodes.src.connect(audioNodes.vol);
audioNodes.vol.connect(audioNodes.dest);



function withLock(func, ms, key, that) {
  if (that[key + "-locked"]) return;
  func.call(that);
  that[key + "-locked"] = true;
  setTimeout(function() { that[key + "-locked"] = false; }, ms);
}

function modulo(v, n) { return ((v%n)+n)%n; }
function outOfWorld(p) { return p.x < 0 || p.x > world.width || p.y < 0 || p.y > world.height; }

Math.sign = function(n) { return n?n<0?-1:1:0; };
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
