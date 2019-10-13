/* Starfield Demo
 *
 *(c) Joonas Reinikka 2017
 *
 *
 */
import * as PIXI from "pixi.js";

class Star extends PIXI.Sprite {
  constructor(
    texture,
    x,
    y,
    transparency,
    transparencySpeed,
    speed,
    direction,
    maxScale
  ) {
    super(texture);
    this.anchor = { x: 0.5, y: 0.5 };
    this.alpha = transparency;
    this.transparencySpeed = transparencySpeed;
    this.speed = speed;
    this.maxScale = Math.random() * (0.08 - 0.01) + 0.05;
    this.scale = { x: 0.02, y: 0.02 };
    this.direction = direction;
    this.distance = 1000;
    this.rotation = Math.random() * (360 - 0) * (Math.PI / 180);
    this.x = x;
    this.y = y;
  }

  setScale(size) {
    this.scale.x = size;
    this.scale.y = size;
  }

  move(amount) {
    this.x += this.direction.x * amount;
    this.y += this.direction.y * amount;
  }
}

class Starfield {
  constructor(screenWidth, screenHeight, app) {
    this.app = app;
    this.sprites = {};
    this.width = screenWidth;
    this.height = screenHeight;
    this.screenCentre = {
      x: this.width / 2,
      y: this.height / 2
    };

    this.starAmount = 625;

    this.stars = [];
  }

  init() {
    this.background = this.sprites.nebula;
    this.starTexture = this.sprites.starTexture;
    this.background.width = this.width;
    this.background.height = this.height;
    // Create stars
    for (let i = 0; i < this.starAmount; i++) {
      this.createStar();
      // Move stars some distance
      const distance = Math.floor(Math.random() * (this.width - 10) + 10);
      const scale =
        Math.random() * (this.stars[this.stars.length - 1].maxScale - 0.05) +
        0.05;
      this.stars[this.stars.length - 1].move(distance);
      this.stars[this.stars.length - 1].setScale(scale);
    }

    // Run update few hundred times
    for (let i = 0; i < 500; i++) {
      this.update();
    }
  }

  /* Draw method doesn't actually do anything in this demo, but it's still here so we
   * can use draw() as a standard way to call draw-updates
   */
  draw() {}

  start() {
    // Remove all children from the stage
    for (var i = this.app.stage.children.length - 1; i >= 0; i--) {
      this.app.stage.removeChild(this.app.stage.children[i]);
    }

    // Add background
    this.app.stage.addChild(this.background);
  }

  update() {
    for (let i = 0; i < this.stars.length; i++) {
      this.stars[i].move(this.stars[i].speed);

      this.stars[i].distance -= this.stars[i].speed / 400;
      if (this.stars[i].scale.y < this.stars[i].maxScale) {
        this.stars[i].setScale((1000 - this.stars[i].distance.toFixed(2)) / 20);
      }

      this.stars[i].alpha += this.stars[i].transparencySpeed;
      if (this.stars[i].alpha >= 1 || this.stars[i].alpha <= 0) {
        this.stars[i].transparencySpeed = -this.stars[i].transparencySpeed;
      }

      if (
        this.stars[i].y < 0 ||
        this.stars[i].y > this.height ||
        this.stars[i].x < 0 ||
        this.stars[i].x > this.width
      ) {
        this.app.stage.removeChild(this.stars[i]);
        this.stars.splice(i, 1);
        this.createStar();
      }
    }
  }

  setSprite(name, sprite) {
    this.sprites[name] = sprite;
  }

  createStar() {
    const speed = Math.floor(Math.random() * 3) + 0.5;

    const directionX = Math.random() * (1 - -1) + -1;
    const directionY = Math.random() * (1 - -1) + -1;
    const direction = { x: directionX, y: directionY };

    // Randomize starting point a little bit
    const randX = Math.random() * (100 - 0);
    const randY = Math.random() * (100 - 0);

    const transparency = Math.random() * (1 - 0.01) + 0.01;
    const transparencySpeed = Math.random() * (0.01 - 0.001) + 0.001;

    const star = new Star(
      this.starTexture,
      this.screenCentre.x,
      this.screenCentre.y,
      transparency,
      transparencySpeed,
      speed,
      direction
    );
    this.stars.push(star);
    this.app.stage.addChild(star);
  }
}

module.exports = Starfield;
