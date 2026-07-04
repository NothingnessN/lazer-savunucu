import Phaser from 'phaser';
import { CONFIG } from '../config.js';

export class Ball extends Phaser.GameObjects.Arc {
  constructor(scene) {
    super(scene, -200, -200, CONFIG.BALL.RADIUS, 0, 360, false, 0xffffff, 1);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.body.setCircle(CONFIG.BALL.RADIUS);
    this.colorType = 'red';
    this.hasCrossed = false;
    this.trailTimer = 0;
    this.deactivate();
  }

  spawn(x, y, vy, colorType, colorHex) {
    this.setPosition(x, y);
    this.colorType = colorType;
    this.fillColor = colorHex;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.body.setVelocity(0, vy);
    this.hasCrossed = false;
    this.trailTimer = 0;
  }

  deactivate() {
    this.setActive(false);
    this.setVisible(false);
    if (this.body) {
      this.body.enable = false;
      this.body.setVelocity(0, 0);
    }
    this.setPosition(-200, -200);
  }

  isOutOfBounds() {
    return this.y < -100 || this.y > CONFIG.HEIGHT + 100;
  }
}
