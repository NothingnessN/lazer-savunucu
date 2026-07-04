import { Ball } from './Ball.js';
import { CONFIG } from '../config.js';

export class BallPool {
  constructor(scene) {
    this.scene = scene;
    this.pool = [];
    for (let i = 0; i < CONFIG.BALL.POOL_SIZE; i++) {
      this.pool.push(new Ball(scene));
    }
  }

  acquire() {
    const ball = this.pool.find((b) => !b.active);
    return ball || null;
  }

  getActiveBalls() {
    return this.pool.filter((b) => b.active);
  }

  release(ball) {
    ball.deactivate();
  }

  releaseAll() {
    this.pool.forEach((b) => b.deactivate());
  }
}
