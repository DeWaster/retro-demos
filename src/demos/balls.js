/* Balls Demo
 *
 *(c) Joonas Reinikka 2017
 *
 *
 */
import * as PIXI from "pixi.js";

class Ball {
  constructor(x, y, color, transparency, speed) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.transparency = transparency;
    this.speed = speed;
  }
}

class Balls {
  constructor(screenWidth, screenHeight, app) {
    this.app = app;
    this.graphics = new PIXI.Graphics();
    const blurFilter = new PIXI.filters.BlurFilter(2);

    this.graphics.filters = [blurFilter];

    this.width = screenWidth;
    this.height = screenHeight;
    this.screenCentre = {
      x: this.width / 2,
      y: this.height / 2
    };
    this.ballAmount = 25;
    this.padding = 2;
    this.movementSpeed = 2;
    this.colors = ["b30000", "ff9900", "009900", "0000ff"];

    this.balls = [];
    this.ballRadius = this.width / (this.ballAmount * 2);
    this.ballAmountY = Math.round(this.height / this.ballRadius);
    this.lastY = 0;
  }

  init() {
    // Calculate colors for the rows
    const rowColors = [this.colors[0]];
    let mainColorRow = Math.floor(this.ballAmount / this.colors.length);
    let currentColor = this.colors.splice(0, 1)[0];
    let lastColor = "";

    for (let i = 1; i < this.ballAmount; i++) {
      if (i === mainColorRow) {
        lastColor = currentColor;
        currentColor = this.colors.splice(0, 1)[0];
        rowColors[i] = currentColor;
        mainColorRow += mainColorRow;
      } else {
        lastColor = currentColor;
        currentColor = this.calculateMiddleColor(currentColor, this.colors[0]);
        rowColors[i] = currentColor;
      }
    }

    // Let's create some baaaaaallls
    for (let i = 0; i < this.ballAmount; i++) {
      const row = [];
      for (let k = 0; k < this.ballAmountY; k++) {
        const transparency = Math.random() * 1 + 0.05;
        const transparencySpeed = Math.random() * 0.01 + 0.001;
        row.push(
          new Ball(
            i * this.ballRadius * 2 + this.ballRadius,
            k * this.ballRadius * 2,
            "0x" + rowColors[i],
            transparency,
            transparencySpeed
          )
        );
      }
      this.balls.push(row);
    }
    this.lastY = this.balls[0][this.balls[0].length - 1].y;
  }

  start() {
    // Remove all children from the stage
    for (var i = this.app.stage.children.length - 1; i >= 0; i--) {
      this.app.stage.removeChild(this.app.stage.children[i]);
    }
  }

  draw() {
    for (let i = 0; i < this.balls.length; i++) {
      for (let k = 0; k < this.balls[i].length; k++) {
        const ball = this.balls[i][k];

        this.graphics.lineStyle(0);
        this.graphics.beginFill(ball.color, ball.transparency);
        this.graphics.drawCircle(
          ball.x,
          ball.y,
          this.ballRadius - this.padding
        );
        this.graphics.endFill();
      }
    }
    this.app.stage.addChild(this.graphics);
  }

  update() {
    this.graphics.clear();
    for (let i = 0; i < this.balls.length; i++) {
      for (let k = 0; k < this.balls[i].length; k++) {
        this.balls[i][k].y -= this.movementSpeed;
        this.balls[i][k].transparency += this.balls[i][k].speed;
        if (
          this.balls[i][k].transparency >= 1 ||
          this.balls[i][k].transparency <= 0
        ) {
          this.balls[i][k].speed = -this.balls[i][k].speed;
        }

        if (this.balls[i][k].y < -(this.ballRadius * 2)) {
          this.balls[i][k].y = this.lastY;
        }
      }
    }
  }

  // https://stackoverflow.com/questions/16360533/calculate-color-hex-having-2-colors-and-percent-position
  calculateMiddleColor(color1, color2) {
    const ratio = 0.9;
    const hex = function(x) {
      x = x.toString(16);
      return x.length == 1 ? "0" + x : x;
    };
    var r = Math.ceil(
      parseInt(color1.substring(0, 2), 16) * ratio +
        parseInt(color2.substring(0, 2), 16) * (1 - ratio)
    );
    var g = Math.ceil(
      parseInt(color1.substring(2, 4), 16) * ratio +
        parseInt(color2.substring(2, 4), 16) * (1 - ratio)
    );
    var b = Math.ceil(
      parseInt(color1.substring(4, 6), 16) * ratio +
        parseInt(color2.substring(4, 6), 16) * (1 - ratio)
    );
    var middle = hex(r) + hex(g) + hex(b);
    return middle;
  }
}

module.exports = Balls;
