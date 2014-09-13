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
  height: DEFAULT_HEIGHT,
  x: 0,
  y: 0
};

var canvas = null;
var context = null;
var menuContext = null;

// User Controls
var mouse = {
  x: 0,
  y: 0,
  pressed: 0
};
var pressedKeys = {};

// Objects
var currentMaker = null;
var makers = [ 
  { enabled: false, key: 49, color: "#2096e5", constructor: WaterMaker},
  { enabled: false, key: 50, color: "#f64f0a", constructor: FireMaker},
  { enabled: false, key: 51, color: "#fff", constructor: AirMaker},
  { enabled: false, key: 52, color: "#552616", constructor: EarthMaker}
];

var log = null;
var peeps = [];
var particles = [];

var shaking = false;

var game = {
  lives: 3,
  loseLife: function() { 
    game.lives--; 
    if (game.lives <= 0) lose();
  },
  score: 0,
  addScore: function(a) { game.score += a; game.checkScore();},
  checkScore: function() {
    if (game.score === 1) { game.stage2(); } 
    else if (game.score === 2) { game.stage3(); } 
    else if (game.score === 4) { game.stage4(); } 
  },
  stage1: function() {
    var p = new Peep(world.width / 2 - 25, world.height / 2 - 25, 50, -1);
    peeps.push(p)
    setTimeout(function() { 
      p.need = 1; 
      p.needCounter = 8; 
      enableMaker(1);
    }, 3000);
  },
  stage2: function() {
    setTimeout(function() {
      log = new Log(peeps[0].x - 80, peeps[0].y + 38);
      setTimeout(function() { peeps[0].need = 2; peeps[0].needCounter = 8; }, 2000);
    }, 5000);
  },
  stage3: function() {
  },
  stage4: function() {
  },
  lose: function() {
    
  }
};

function initGame() {
  canvas = document.getElementById("world");
  context = canvas.getContext('2d');

  canvas.width = world.width;
	canvas.height = world.height;
  
  windowResizeHandler();
  
	document.addEventListener('mousemove', documentMouseMoveHandler, false);
	document.addEventListener('mousedown', documentMouseDownHandler, false);
	document.addEventListener('mouseup', documentMouseUpHandler, false);
	document.addEventListener('keydown', documentKeyDownHandler, false);
	document.addEventListener('keyup', documentKeyUpHandler, false);
	
  window.addEventListener('resize', windowResizeHandler, false);
  
	function documentMouseMoveHandler(event){
		mouse.x = event.clientX - world.x - BORDER_WIDTH;
		mouse.y = event.clientY - world.y - BORDER_WIDTH;
	}

	function documentMouseDownHandler(event){
		mouse.pressed = true;
	}

	function documentMouseUpHandler(event) {
		mouse.pressed = false;
    console.log(mouse.x, mouse.y)
	}

	function documentKeyDownHandler(event) {
	  pressedKeys[event.keyCode] = true;
	}

	function documentKeyUpHandler(event) {
		delete pressedKeys[event.keyCode];
	}
  
  function windowResizeHandler(event) {
    var rect = canvas.getBoundingClientRect();
    world.x = rect.left;
    world.y = rect.top;    
  }
  

  game.stage1();
  animate();
}

function initMenus() {
  var cnv = document.getElementById("menu");
  menuContext = cnv.getContext('2d');
  
  cnv.width = 200;
  cnv.height = world.height;
  
  menuContext.fillStyle = "#fff";
  menuContext.fillRect(20, 70, 160, 1);
  menuContext.fillRect(20, 340, 160, 1);
  
  drawMenu();
  enableMaker(1)
  enableMaker(2)
  enableMaker(3)
    enableMaker(4)
}

function enableMaker(id) {
  var i = id - 1;
  makers[i].enabled = true;
  menuContext.font = '10px Consolas, monaco, monospace';
  menuContext.textAlign = "center";
  menuContext.fillStyle = makers[i].color;
  menuContext.fillRect(30, 100 + i*60, 30, 30);
  menuContext.fillStyle = "#fff";
  menuContext.fillText(i+1, 23, 130 + i*60);
  
  if (id === 1) {
    drawMouseButton(80, 120);
  } else if (id === 2){
    drawKeyButton(80,  162, "W");
    drawKeyButton(115, 162, "E");
    drawKeyButton(150, 162, "R");
  } else if (id === 3) {
    drawMouseButton(80, 240);
  } else if (id === 4) {
    drawKeyButton(80,  282, "I");
    drawKeyButton(115, 282, "O");
  }
  
  function drawMouseButton(x, y) {
    menuContext.font = '16px Consolas, monaco, monospace';
    menuContext.fillStyle = "#ccc";
    menuContext.textAlign = "left";
    menuContext.fillText("Mouse", x, y);
  }

  function drawKeyButton(x, y, key) {
    menuContext.font = '14px Consolas, monaco, monospace';
    menuContext.textAlign = "center";  
    menuContext.strokeStyle = "#fff"
    menuContext.beginPath();
    menuContext.rect(x, y, 26, 26);
    menuContext.stroke();
    menuContext.fillStyle = "#ccc";
    menuContext.fillText(key, x + 13, y + 18);
  }
}

function selectMakerMenu(id) {
  menuContext.fillStyle = "#f9ee90";
  for (var i = 0; i < makers.length; i++) {
    menuContext.clearRect(63, 100 + i * 60, 3, 30);
  }
  menuContext.fillRect(63, 100 + (id - 1)*60, 3, 30);
}

function drawMenu() {
	menuContext.clearRect(0, 30, 200, 20);
  
  menuContext.fillStyle = "#fff";
  for (var i = 0; i < game.lives; i++) {
    menuContext.fillRect(45 + 45*i, 30, 20, 20);
  }
  
	menuContext.clearRect(0, 380, 200, 25);
  
  menuContext.fillStyle = "#fff";
  menuContext.textAlign = "center";
  menuContext.font = '20px Consolas, monaco, monospace';
  menuContext.fillText(game.score, 100, 400);
  
  requestAnimFrame(drawMenu);
}


// TODO: bolji raspored

function populate() {
  for (var i = 50; i < world.height - 100; i+=world.height / 5) {
    for (var j = 50; j < world.width - 100; j+= world.width / 4) {
      if (Math.random() < 0.2) continue;
      var x = j + 70 * Math.random();
      var y = i + 70 * Math.random();
      var s = 20 + Math.random() * 45;
      var p = new Peep(x, y, s);
      peeps.push(p);
    }
  }
}

/**
 * Called on every frame to update the game properties
 * and render the current state to the canvas.
 */
function animate() {
	// Clear the canvas of all old pixel data
	context.clearRect(0, 0, canvas.width, canvas.height);

  for (var i = peeps.length - 1; i >= 0; i--) {
    peeps[i].updatePosition();
    peeps[i].draw();
    if (peeps[i].dead) {
      peeps.splice(i, 1);
    }
  }

  selectMaker();

  if (currentMaker) {
    currentMaker.updatePosition();
    currentMaker.draw();
  }
  
  if (log) {
    log.updatePosition();
    log.draw();    
  }

  // Particles
  for (var i = particles.length - 1; i >= 0; i--) {
    particles[i].updatePosition();
    particles[i].draw();
    if (particles[i].dead || outOfWorld(particles[i])) {
      particles.splice(i, 1);
    }
  }
  //console.log("x:" + mouse.x + " y:" + mouse.y);
  requestAnimFrame(animate);
}

function selectMaker() {
  for (var i = 0; i < makers.length; i++) {
    if (makers[i].enabled && pressedKeys[makers[i].key]) {
      withLock(function() { 
        currentMaker = new makers[i].constructor();
        selectMakerMenu(i + 1)
      }, 500, "maker-switch", window);
      break;
    }
  }
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
Point.prototype.collidesWith = function(o) {
  return !(
    ((this.y + this.size) < (o.y)) ||
    (this.y > (o.y + (o.height || o.size))) ||
    ((this.x + this.size) < o.x) ||
    (this.x > (o.x + (o.width || o.size)))
  );
};

// ================ PEEPS ================

function Peep(x, y, s, d) {
  this.x = x;
  this.y = y;
  this.v = {x: 0, y: 0, max: 20};
  this.size = s || 10;
  this.health = 255;
  
  this.direction = d || (Math.random() > 0.5 ? -1 : 1);
  this.w = {x: 0, y: 0};
  this.walkNudge = 0;
  this.walkNudgePeriod = Math.round(5 + Math.random() * 5);
  this.walk();
  
  this.eyeWidth = this.size/4;
  this.blinking = true;
  this.blink();
  
  this.need = null;
  this.needCounter = 0;
  
  this.burningHealth = 0;
  this.flames = [];
}
Peep.prototype = new Point();

Peep.prototype.updatePosition = function() {
  
  // Collision with particles
  for (var i = particles.length - 1; i >= 0; i--) {
    if (particles[i].collidesWith(this)) {
      particles[i].collide(this);
    }
  }
  
  // Log checking
  if (log) {
    withLock(this.warmth, 1000, 'warmth', this);
    for (var i = log.flames.length - 1; i >= 0; i--) {
      if (log.flames[i].collidesWith(this)) {
        log.flames[i].collide(this);
      }
    }
  }
  
  // Wall bumping
  if (this.x < 0) { this.direction = 1; this.v.x = Math.abs(this.v.x); }
  if (this.x > world.width - this.size) { this.direction = -1; this.v.x = -Math.abs(this.v.x); }
  if (this.y < 0) { this.v.y = Math.abs(this.v.y); }
  if (this.y > world.height - this.size) { this.v.y = -Math.abs(this.v.y); }
  
  // Shaky shaky~
  if (shaking) {
    this.blinking = true;
    this.w.x = 0;
    this.x += sign(simRand());
    this.y += sign(simRand());
  }
  
  // Burning
  if (this.burningHealth > 0) {
    this.blinking = true;
    var q = Math.max(this.burningHealth - this.flames.length, 0);
    while(q--) { this.flames.push(new FireParticle(this.x + this.size/2, this.y, 3 + Math.random() * 2)); }
    withLock(this.hurt, 500, 'huting', this);
  }
  for (var i = this.flames.length - 1; i >= 0; i--) {
    this.flames[i].updatePosition();
    if (this.flames[i].dead) { this.flames.splice(i, 1); }
  }
  
  // Walking
  if (this.burningHealth <= 0) {
    if (this.w.x > 1) { this.w.x *= 0.8; }
    else { this.w.x = 0; }
  }
  
  withLock(this.walk, 150, 'walking', this);
    
  // Final movement
  this.x += this.v.x;
  this.y += this.v.y;
  this.v.x *= 0.9;
  this.v.y *= 0.9;
};

Peep.prototype.draw = function() {
  context.fillStyle = "rgb(" + this.health + ", " + this.health + ", " + this.health + ")";
  context.fillRect(this.x, this.y, this.size, this.size);
  var eyeX = this.x + this.size/2 + this.direction * this.size/8;
  var eyeY = this.y + this.size*2/3;
  context.fillStyle = this.health > 100 ? "#000" : "#fff";
  if (this.blinking) {
    context.fillRect(eyeX, eyeY + 3, 4, 1);
    context.fillRect(eyeX + this.direction * this.eyeWidth, eyeY + 3, 4, 1);
  } else {
    context.fillRect(eyeX, eyeY, 4, 4);
    context.fillRect(eyeX + this.direction * this.eyeWidth, eyeY, 4, 4);
  }
  if (this.burningHealth >= 0) {
    // TODO: open mouth
    //context.fillRect(eyeX, this.y + this.size -2 , this.direction * (this.eyeWidth - 4) , -10);
  }
  if (this.need) this.drawNeed();
  for (var i = this.flames.length - 1; i >= 0; i--) {
    this.flames[i].draw();
  }
};

Peep.prototype.drawNeed = function() {
  var bubbleSize = 18;
  var bubbleX = this.x + this.size/2 - bubbleSize/2;
  var bubbleY = this.y - 10;
  context.fillStyle = "rgba(255, 255, 255, 0.3)";
  context.fillRect(bubbleX, bubbleY, bubbleSize, -bubbleSize);
  context.fillRect(this.x + this.size/2 - 1, bubbleY + 2, 4, 4);
  var dropSize = this.needCounter;
  var dropX = this.x + this.size/2 - dropSize/2;
  var dropY = bubbleY - 3;
  context.fillStyle = this.needColor();
  context.fillRect(dropX, dropY, dropSize, -dropSize);
};

Peep.prototype.needColor = function() {
  if      (this.need === 1) return "#2076f5";
  else if (this.need === 2) return "#f64f0a";
};

Peep.prototype.blink = function() {
  this.blinking = !this.blinking;
  setTimeout(this.blink.bind(this), this.blinking ? Math.random()*400 : Math.random()*3000);
};

Peep.prototype.walk = function() {
  if (this.w.x > 0) {
    this.walkNudge = modulo(this.walkNudge + 1, this.walkNudgePeriod);
    if (this.walkNudge % this.walkNudgePeriod == 0) this.y -= 2;
    if (this.walkNudge % this.walkNudgePeriod == 1) this.y += 2;
    this.x += this.direction * this.w.x;
  }
}

Peep.prototype.water = function() {
  this.blinking = true;
  this.burningHealth = Math.max(0, this.burningHealth-1);
  this.fulfilNeed(1);
  //obj.color[0] = stepTo(obj.color[0], 32, 5);
  //obj.color[1] = stepTo(obj.color[0], 118, 5);
  //obj.color[2] = stepTo(obj.color[0], 251, 5);
}

Peep.prototype.fulfilNeed = function(id) {
  if (this.need !== id) return;
  this.needCounter--;
  if (this.needCounter <= 0) {
    this.need = null;
    game.addScore(1);
  }
}

Peep.prototype.fire = function() {
  this.burningHealth = Math.min(10, this.burningHealth + 1);
  this.w.x = Math.min(15, this.w.x + 5);
  this.fulfilNeed(2);
}

Peep.prototype.warmth = function() {
  if (log && log.burningHealth > 0 && this.distanceTo(log) < 100) {
    this.fulfilNeed(2);
  } 
}

Peep.prototype.hurt = function() {
  this.health = Math.max(0, this.health - 10);
  if (!this.dead && this.health == 0) {
    this.dead = true;
    game.loseLife();
  }
}

function Log(x, y) {
  this.x = x;
  this.y = y;
  this.size = 50;
  this.width = 50;
  this.height = 12;
  this.v = {x: 0, y: 0};
  this.burningHealth = 0;
  this.flames = [];
}

Log.prototype.updatePosition = function() {
  
  // Collision with particles
  for (var i = particles.length - 1; i >= 0; i--) {
    if (particles[i].collidesWith(this)) {
      particles[i].collide(this);
    }
  }
  
  // Wall bumping
  if (this.x < 0) { this.v.x = Math.abs(this.v.x); }
  if (this.x > world.width - this.width) { this.v.x = -Math.abs(this.v.x); }
  if (this.y < 0) { this.v.y = Math.abs(this.v.y); }
  if (this.y > world.height - this.height) { this.v.y = -Math.abs(this.v.y); }

  // Shaky shaky
  if (shaking) {
    this.x += sign(simRand());
    this.y += sign(simRand());
  }
  
  // Burning
  if (this.burningHealth > 0) {
    var q = Math.max(this.burningHealth - this.flames.length, 0);
    while(q--) { 
      var p = new FireParticle(this.x + this.width/2 + simRand() * 20, this.y, 3 + Math.random() * 2)
      this.flames.push(p); 
    }
  }
  for (var i = this.flames.length - 1; i >= 0; i--) {
    this.flames[i].updatePosition();
    if (this.flames[i].dead) { this.flames.splice(i, 1); }
  }
      
  // Final movement
  this.x += this.v.x;
  this.y += this.v.y;
  this.v.x *= 0.8;
  this.v.y *= 0.8;
}

Log.prototype.draw = function() {
  context.fillStyle = "#793f1d";
  context.fillRect(this.x, this.y, this.width, this.height);
  context.fillRect(this.x + this.width/4, this.y, 8, -8);
  for (var i = this.flames.length - 1; i >= 0; i--) {
    this.flames[i].draw();
  }
}

Log.prototype.water = function() {
  // TODO: add smoke
  this.burningHealth = Math.max(0, this.burningHealth-1);
}

Log.prototype.fire = function() {
  this.burningHealth = Math.min(30, this.burningHealth + 1);
}

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
	this.sizeMin = 10;
  this.sizeMax = 40;
	this.sizeAngle = 0;
	this.size = 20;
}
WaterMaker.prototype = new Point();
WaterMaker.prototype.updatePosition = function() {
  var movement = this.velocity;
  while (movement > 0) {
    movement = this.move(movement);
  }
  var md = this.distanceTo(mouse);
  if (md < this.sensorRadius) {
    if (!this.rotationSet) { this.rotation = sign(simRand()); this.rotationSet = true; }
    // Linearno po udaljenosti od kursora, min brzina je 4
    this.velocity = (1 - md / this.sensorRadius) * this.topSpeed + 4 * md / this.sensorRadius;
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
    this.size = this.sizeMin + (this.sizeMax - this.sizeMin) * (1 + Math.sin(this.sizeAngle)) / 2;
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
  var q = 10;
  while (--q >= 0) {
    var x = this.x + simRand() * 2 * this.size * this.direction.y;
    var y = this.y + simRand() * 2 * this.size * this.direction.x;
    var p = new WaterParticle(x, y);
    var v = 5 + (this.sizeMax - this.size) / this.sizeMax * 10; // speed from 2 to 15
    v *= (1 - Math.random() * 0.2); // Make each one a bit random
    p.v = { x: this.direction.x * v, y: this.direction.y * v };
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
  this.x += this.v.x;
  this.y += this.v.y;
};
WaterParticle.prototype.draw = function() {
	context.fillStyle = "#2076f5";
  context.fillRect(this.x, this.y, this.size, this.size);
};
WaterParticle.prototype.collide = function(obj) {
  obj.v.x = (obj.v.x * (obj.size - this.size) + (2 * this.size * this.v.x)) / (obj.size + this.size);
  obj.v.y = (obj.v.y * (obj.size - this.size) + (2 * this.size * this.v.y)) / (obj.size + this.size);
  obj.water();
  this.dead = true;
};

// ================ FIRE ================

function FireMaker() {
  this.left = new Point(10 + Math.random() * world.width / 2, 10 + Math.random() * (world.height - 20));
  this.right = new Point(world.width / 2 * (1 + Math.random()) - 10, 10 + Math.random() * (world.height - 20));
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
  var q = d/3;
  for (var i = 0; i < q; i++) {
    var l = Math.random();
    var x = this.left.x + l * (this.right.x - this.left.x) + (0.5 - Math.random()) * d / 5;
    var y = this.left.y + l * (this.right.y - this.left.y) + (0.5 - Math.random()) * d / 5;
    var p = new FireParticle(x, y);
    particles.push( p );
  }
};

FireMaker.prototype.sound = function(t) {
  var f1 = this.left.x;
  var f2 = this.right.y;
  return 0.2 * Math.sin(f1 * t * Math.PI * 2) + 0.2 * Math.sin(f2 * t * Math.PI * 2);
};

function FireParticle(x, y, s) {
  this.x = x;
  this.y = y;
  this.size = s || 3;
}
FireParticle.prototype = new Point();
FireParticle.prototype.updatePosition = function() {
  this.x += simRand() * 2;
  this.y += (Math.random() - 0.8) * 2;
  this.dead = (Math.random() < 0.1);
};
FireParticle.prototype.draw = function() {
  context.fillStyle = "#f64f0a";
  context.fillRect(this.x, this.y, this.size, this.size);
};
FireParticle.prototype.collide = function(obj) {
  obj.fire();
  this.dead = true;
};

// ================ AIR ================

function AirMaker() {
  this.x = 4;
  this.y = 4;
  this.size = 1;
  this.pressOrigin = null;
  this.mousePressStarted = false;
}
AirMaker.prototype = new Point();
AirMaker.prototype.draw = function() {
  context.fillStyle = "#5BDBE0";
  context.fillRect(this.x, this.y, 1, 1);
  //just for  
  /*
  if (this.mousePressStarted){
    context.strokeStyle="blue";
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(this.pressOrigin.x, this.pressOrigin.y);
    context.lineTo(mouse.x, mouse.y);
    context.stroke();
  }*/
};
AirMaker.prototype.updatePosition = function() {
  this.x = mouse.x;
  this.y = mouse.y;

  if (mouse.pressed) {
    if (!this.mousePressStarted){
      this.pressOrigin = new Point(mouse.x, mouse.y);
      this.mousePressStarted = true;
    }
  }

  if (!mouse.pressed) {
    if (this.mousePressStarted) { 
   	  var shootPoint = new Point(mouse.x, mouse.y);
      var length = shootPoint.distanceTo(this.pressOrigin);	
      this.mousePressStarted = false;
      this.shoot(-0.13 + (0.02 * length/100), shootPoint);
    }
  }

};
AirMaker.prototype.shoot = function(life, shootPoint) {
  console.log("life:" + life);
  for(var i = 0; i < 20 ; i++){

    var airP = new AirParticle(this.pressOrigin.x, this.pressOrigin.y,
                                (shootPoint.x - this.pressOrigin.x) * (Math.floor(Math.random()*5) + 1) * 0.02 ,
                                (shootPoint.y - this.pressOrigin.y) * (Math.floor(Math.random()*5) + 1) * 0.02 , life);
    particles.push(airP);
  }
};

AirMaker.prototype.sound = function(t) {
  //var f1 = Math.round(mouse.x/10)*10;
  //var f2 = Math.round(mouse.y/10)*10;
  //return 0.2 * Math.sin(f1 * t * Math.PI * 2) + 0.2 * Math.sin(f2 * t * Math.PI * 2);
};

function AirParticle(x, y, movX, movY, alphaDelta){
  this.x = x;
  this.y = y;
  this.alpha = 1.0;
  this.alphaDelta = alphaDelta;
  this.size = 3;
  this.movementX = movX;
  this.movementY = movY;
  this.dead = false;
}
AirParticle.prototype = new Point();
AirParticle.prototype.draw = function() {
  context.fillStyle = "rgba(63, 220, 214, " + this.alpha + ")";
  this.alpha += this.alphaDelta;
  context.fillRect(this.x, this.y, this.size, this.size);
  if (this.alpha < 0 ) this.dead = true;
};
AirParticle.prototype.updatePosition = function() {
  this.x += this.movementX;
  this.y += this.movementY;
};
AirParticle.prototype.collide = function(obj) {
  obj.v.x += this.movementX * -0.001/this.alphaDelta;
  obj.v.y += this.movementY * -0.001/this.alphaDelta;
};


// ================ EARTH ================

function EarthMaker() {
  this.sizeMin = 5;
  this.sizeFull = 150;
  this.size = this.sizeMin;
  this.sequence = [79, 73]; // [80, 79, 73]
  this.sequenceIndex = 0;
  this.recedeSpeed = 100;
}
EarthMaker.prototype.updatePosition = function() {
  console.log(this.size, this.recedeSpeed);
  var nextSeq = modulo(this.sequenceIndex + 1, this.sequence.length);
  if (pressedKeys[this.sequence[this.sequenceIndex]] && !pressedKeys[this.sequence[nextSeq]]) {
    this.sequenceIndex = nextSeq;
    this.size += 5;
  }
  
  if (this.size >= this.sizeFull) {
    this.quake();
  } else if (this.size > 100) {
    this.recedeSpeed = 45;
  } else if (this.size > 50) {
    this.recedeSpeed = 60;
  } else {
    this.recedeSpeed = 100;
  }
  
  withLock(this.recede, this.recedeSpeed, "receding", this);
};

EarthMaker.prototype.recede = function() {
  if (this.size < this.sizeFull) {
    this.size = Math.max(this.sizeMin, this.size - 2);
  }
}

EarthMaker.prototype.draw = function() {
	context.fillStyle = "#552616";
  if (this.size > 0) {
    var lowerLength = world.width * Math.min(this.size / 50, 1);
    context.fillRect(world.width/2 - lowerLength/2, world.height - 5, lowerLength, 10);
  }
  if (this.size > 50) {
    var sideLength = world.height * Math.min((this.size - 50) / 50, 1);
    context.fillRect(0, world.height, 5, -sideLength);
    context.fillRect(world.width, world.height, -5, -sideLength);
  }
  if (this.size > 100) {
    var upperLength = world.width * Math.min((this.size - 100)/ 50, 1);
    context.fillRect(0, 0, upperLength/2, 5);
    context.fillRect(world.width, 0, -upperLength/2, 5);
  }
}

EarthMaker.prototype.quake = function() {
  shaking = true;
  var self = this;
  setTimeout(function() {
    shaking = false;
    self.size = self.sizeMin;
  }, 6000);
}

EarthMaker.prototype.sound = function(t) {
  var a = this.size / this.sizeFull;
  return a * (Math.sin(60 * t * Math.PI * 2) + Math.sin(100 * t * Math.PI * 2) + Math.sin(160 * t * Math.PI * 2));
}


// ================ AUDIO ================

var actx = new (window.AudioContext || window.webkitAudioContext)();
var audioNodes = {
  src:  actx.createScriptProcessor(4096, 0, 1),
  vol: actx.createGain(),
  dest: actx.destination
};
audioNodes.src.onaudioprocess = function(e) {
  if (!currentMaker || !currentMaker.sound) return;
  var ob = e.outputBuffer;
  for (var c = 0; c < ob.numberOfChannels; c++) {
    var od = ob.getChannelData(c);
    for (var s = 0; s < ob.length; s++) {
      od[s] = currentMaker.sound(actx.currentTime + ob.duration * s / ob.length) || 0;
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

function simRand() { return Math.random() - 0.5; }
function stepTo(val, target, step) { return Math.max(target, val + sign(target - val) * step); };
function sign(n) { return n?n<0?-1:1:0; };
function modulo(v, n) { return ((v%n)+n)%n; }
function outOfWorld(p) { return p.x < 0 || p.x > world.width || p.y < 0 || p.y > world.height; }

// shim with setTimeout fallback from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          window.oRequestAnimationFrame      ||
          window.msRequestAnimationFrame     ||
          function(callback, element){
            window.setTimeout(callback, 1000 / 60);
          };
})();

initGame();
initMenus();
