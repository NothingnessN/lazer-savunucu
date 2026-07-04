import Phaser from 'phaser';
import { CONFIG } from '../config.js';

export class HeartPickup extends Phaser.GameObjects.Container {
  constructor(scene) {
    super(scene, -200, -200);
    scene.add.existing(this);

    this.circle = scene.add.circle(0, 0, CONFIG.HEART.RADIUS, 0xff0055, 1);
    this.label = scene.add.text(0, 0, '♥', {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);
    this.add([this.circle, this.label]);

    scene.physics.add.existing(this);
    this.body.setCircle(CONFIG.HEART.RADIUS);
    this.colorType = 'red';
    this.colorShiftEnabled = false;
    this.shiftTimer = 0;
    this.hasCrossed = false;
    this.setDepth(8);
    this.deactivate();
  }

  spawn(x, colorType, colorHex, colorShiftEnabled) {
    this.setPosition(x, CONFIG.HEART.RADIUS * -2);
    this.colorType = colorType;
    this.colorShiftEnabled = colorShiftEnabled;
    this.shiftTimer = 0;
    this.hasCrossed = false;
    this.circle.fillColor = colorHex;
    this.setActive(true);
    this.setVisible(true);
    this.body.enable = true;
    this.body.setVelocity(0, CONFIG.HEART.FALL_SPEED);
  }

  updateColorShift(delta, theme) {
    if (!this.colorShiftEnabled) return;
    this.shiftTimer -= delta;
    if (this.shiftTimer > 0) return;
    this.shiftTimer = CONFIG.HEART.COLOR_SHIFT_INTERVAL;
    this.colorType = this.colorType === 'red' ? 'blue' : 'red';
    const hex = this.colorType === 'red' ? theme.red : theme.blue;
    this.circle.fillColor = hex;
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
    return this.y > CONFIG.HEIGHT + 100;
  }
}

export class HeartPool {
  constructor(scene) {
    this.scene = scene;
    this.pool = [];
    for (let i = 0; i < CONFIG.HEART.POOL_SIZE; i++) {
      this.pool.push(new HeartPickup(scene));
    }
  }

  acquire() {
    return this.pool.find((h) => !h.active) || null;
  }

  getActiveHearts() {
    return this.pool.filter((h) => h.active);
  }

  release(heart) {
    heart.deactivate();
  }

  releaseAll() {
    this.pool.forEach((h) => h.deactivate());
  }
}
