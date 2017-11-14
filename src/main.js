const app = new PIXI.Application(800, 600, {transparent: true, antialias: true });
const animationWrapper = document.getElementById('animation');
const loader = PIXI.loader;

// Demos
const VerticalLines = require('./demos/vertical');
const Balls = require('./demos/balls');
const Starfield = require('./demos/starfield');

animationWrapper.appendChild(app.view);

const verticalLines = new VerticalLines(window.innerWidth, window.innerHeight, app);
const starfield = new Starfield(window.innerWidth, window.innerHeight, app);
const balls = new Balls(window.innerWidth, window.innerHeight, app);

const demoReel = [verticalLines, starfield, balls];

// Current demo
let current = 0;

// All sprites used in demos
const sprites = {};

const ticker = function () {
  demoReel[current].update();
  demoReel[current].draw();
};

// Load all textures
loader.add('skylineTexture', './assets/vertical/skyline.png')
  .add('skylineTexture2', './assets/vertical/skyline2.png')
  .add('moon', './assets/vertical/moon.png')
  .add('starTexture', './assets/starfield/star.png')
  .add('nebula', './assets/starfield/nebula.jpg')

loader.load((loader, resources) => {
  // Connect sprites
  verticalLines.setSprite('skylineTexture', new PIXI.Texture(resources.skylineTexture.texture))
  verticalLines.setSprite('skylineTexture2', new PIXI.Texture(resources.skylineTexture2.texture))
  verticalLines.setSprite('moon', new PIXI.Sprite(resources.moon.texture))
  verticalLines.setSprite('starTexture', new PIXI.Sprite(resources.starTexture.texture))  
  starfield.setSprite('nebula', new PIXI.Sprite(resources.nebula.texture))
  starfield.setSprite('starTexture', new PIXI.Texture(resources.starTexture.texture))
  init();
});

loader.onError.add(() => {
  console.log("Error while loading assets");
});

// Initialize all
function init(width = window.innerWidth, height = window.innerHeight) {
  app.renderer.resize(width, height);
  
  for (let i = 0; i < demoReel.length; i++) {
    demoReel[i].init();
  }

  start();
}

// Start new demo
function start() {
  demoReel[current].start();
  demoReel[current].draw();
  
  // Remove old ticker
  app.ticker.remove(ticker);
  // The main loop (ticker)
  app.ticker.add(ticker);
}


// Resize function (will be launched when window is resized)
window.onresize = (event) => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  app.renderer.resize(w, h);
  current.resize(w, h);
}

window.addEventListener("click", () => changeDemo()); 

// Change next demo on the reel
function changeDemo() {
  current++;

  if (current >= demoReel.length) {
    current = 0;
  }
  start();
}