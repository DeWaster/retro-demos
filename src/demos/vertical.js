/* Vertical lines Demo
 *
 * 
 * Huge thanks to this jsfiddle https://jsfiddle.net/epistemex/2w2u1rLg/
 * 
 *      /\
 *     /  \/\
 * ___/______\___________________________________________________
 * //_/__/___/____/_____/______|_____\_____\_____\____\___\__\_\\
 * /_/__/___/____/_____/_______|______\_____\_____\____\___\__\_\\
 *  /__/___/____/_____/________|_______\_____\_____\____\___\__\_\\
 * /__/___/____/_____/_________|________\_____\_____\____\___\__\_\\
 *   /   /    /     /          |         \     \     \    \   \  \ \\
 */
class VerticalLines {
  constructor(screenWidth, screenHeight, app) {
    this.app = app;
    this.width = screenWidth;
    this.height = screenHeight;
    this.screenCentre = {
      x: this.width / 2,
      y: this.height / 2
    }
    this.sprites = {};

    // Grid specific stuff
    this.fov = this.width;
    this.viewDist = 20;
    this.angle = -84;
    this.grid = 20;
    this.speedY = 0.09; // Speed which grid moves in Y-coordinate
    this.speedX = 0.01; // Speed which grid moves in X-coordinate
    this.gridY = 0;
    this.gridX = 0;
    this.horizonY = 0;

    this.horizontalGrid = [];
    this.verticalGrid = [];
   
    this.graphics = new PIXI.Graphics();
    
    // Glowfilter for the lines
    const glowFilter = new PIXI.filters.GlowFilter(12, 8, 0, 0x00004c, 0.1);
    this.graphics.filters = [
      glowFilter
    ];
  }

  init() {
    this.horizonY = this._rotateX(0, -this.grid)[1];

    // Get textures
    this.skylineTexture = this.sprites['skylineTexture'];
    this.skylineTexture2 = this.sprites['skylineTexture2'];
    this.moon = this.sprites['moon'];

    // Create tilingsprites
    this.backgroundCity = new PIXI.TilingSprite(this.skylineTexture,  3298, 320);
    this.backgroundCity.y = this.horizonY - 320;
    this.backgroundCity.tilePosition.x = 0;
    this.backgroundCity.tilePosition.y = -1;

    this.backgroundCity2 = new PIXI.TilingSprite(this.skylineTexture2,  2000, 244);
    this.backgroundCity2.y = this.horizonY - 250;

    this.backgroundCity2.tilePosition.x = 0;
    this.backgroundCity2.tilePosition.y = -1;

    this.moon.anchor.set(0.5);
    this.moon.x = this.screenCentre.x;
    this.moon.y = this.screenCentre.y - 50;

    let p1, p2;
    // Create vertical grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(i, -this.grid);
      p2 = this._rotateX(i, this.grid);
      this.verticalGrid.push([p1, p2]);
    }

    // Create horizontal grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(-this.grid, i);
      p2 = this._rotateX(this.grid, i);
      this.horizontalGrid.push([p1, p2]);
    }
    const glowFilter = new PIXI.filters.GlowFilter(20, 3, 0, 0x800080, 0.2);
  }

  start() {
    // Remove all children from the stage
    for (var i = this.app.stage.children.length - 1; i >= 0; i--) {	this.app.stage.removeChild(this.app.stage.children[i]);};
    this.app.stage.addChild(this.moon);
    this.app.stage.addChild(this.backgroundCity2);
    this.app.stage.addChild(this.graphics);
    this.app.stage.addChild(this.backgroundCity);
  }

  /* This method is missing from other demos. It's basically just a way to re-initialize 
   * width and height variables without messing with other ongoing stuff
   */
  resize(screenWidth, screenHeight) {
    this.horizonY = this._rotateX(0, -this.grid)[1];
    this.width = screenWidth;
    this.height = screenHeight;
    this.screenCentre = {
      x: this.width / 2,
      y: this.height / 2
    }
    this.fov = this.width;
    this.horizonY = this._rotateX(0, -this.grid)[1];
    
    this.backgroundCity.y = this.horizonY - 324;
    this.backgroundCity2.y = this.horizonY - 250;

    this.moon.x = this.screenCentre.x;
    this.moon.y = this.screenCentre.y - 50;

    this.horizontalGrid = [];
    this.verticalGrid = [];
    let p1, p2;

    // Create vertical grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(i, -this.grid);
      p2 = this._rotateX(i, this.grid);
      this.verticalGrid.push([p1, p2]);
    }

    // Create horizontal grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(-this.grid, i);
      p2 = this._rotateX(this.grid, i);
      this.horizontalGrid.push([p1, p2]);
    }

  } 

  draw() {
    this.graphics.clear();
    // Draw vertical grid
    this.graphics.lineStyle(2, 0x800080, 1);
    for(let i = 0; i < this.verticalGrid.length; i++) {
      const line = this.verticalGrid[i];

      this.graphics.moveTo(line[0][0], line[0][1]);
      this.graphics.lineTo(line[1][0], line[1][1]);
    }

    // Draw horizontal lines
    for(let i = 0; i < this.verticalGrid.length; i++) {
      const line = this.horizontalGrid[i];

      this.graphics.moveTo(line[0][0], line[0][1]);
      this.graphics.lineTo(line[1][0], line[1][1]);
    }

    // Draw horizon
    this.graphics.moveTo(0, this.horizonY);
    this.graphics.lineTo(this.width, this.horizonY);
  }

  update() {
    this.backgroundCity.tilePosition.x += (this.speedX * 10);
    this.backgroundCity2.tilePosition.x += (this.speedX * 5);

    this.moon.x +=  (this.speedX * 3);

    this.horizontalGrid = [];
    this.verticalGrid = [];

    // Move the grid
    this.gridY += this.speedY;
    if (this.gridY >= 1) {
      this.gridY = 0;
    }

    this.gridX += this.speedX;
    if (this.gridX >= 1 || this.gridX <= -1) {
      this.gridX = 0;
    } 

    let p1, p2;
    // Create vertical grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(i + this.gridX, -this.grid);
      p2 = this._rotateX(i + this.gridX, this.grid);
      this.verticalGrid.push([p1, p2]);
    }

    // Create horizontal grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(-this.grid, i + this.gridY);
      p2 = this._rotateX(this.grid, i + this.gridY);
      this.horizontalGrid.push([p1, p2]);
    }
  }

  setSprite(name, sprite) {
    this.sprites[name] = sprite;
  }

  // Speed setters
  setX(amount) {
    this.speedX = amount;
  }

  setY(amount) {
    this.speedY = amount;
  }

  _updateCoordinates(i) {
    this.horizontalGrid = [];
    this.verticalGrid = [];
    let p1, p2;
    // Create vertical grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(i, -this.grid);
      p2 = this._rotateX(i, this.grid);
      this.verticalGrid.push([p1, p2]);
    }

    // Create horizontal grid
    for(let i = -this.grid; i <= this.grid; i++) {
      p1 = this._rotateX(-this.grid, i);
      p2 = this._rotateX(this.grid, i);
      this.horizontalGrid.push([p1, p2]);
    }
  }

  _rotateX(x, y) {
    const radianAngles = this.angle * Math.PI / 180;
    const cosAngle = Math.cos(radianAngles);
    const sinAngle = Math.sin(radianAngles);

    const ry = y * cosAngle;
    const rz = y * sinAngle;

    const f = this.fov / (this.viewDist + rz);
    x = x * f + this.screenCentre.x;
    y = ry * f + this.screenCentre.y + (this.screenCentre.y / 2);

    return [x, y];
  }
}

module.exports = VerticalLines;