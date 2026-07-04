import { CONFIG } from '../config.js';

export class BackgroundGrid {
  constructor(scene) {
    this.scene = scene;
    this.offset = 0;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(0);
  }

  update(delta) {
    this.offset += (CONFIG.GRID.SPEED * delta) / 1000;
    if (this.offset >= CONFIG.GRID.SPACING) this.offset -= CONFIG.GRID.SPACING;
    this.draw();
  }

  draw() {
    const g = this.graphics;
    g.clear();
    g.lineStyle(1, CONFIG.COLORS.GRID, CONFIG.GRID.ALPHA);
    for (let x = 0; x < CONFIG.WIDTH; x += CONFIG.GRID.SPACING) {
      g.beginPath();
      g.moveTo(x, -CONFIG.GRID.SPACING + this.offset);
      g.lineTo(x, CONFIG.HEIGHT);
      g.strokePath();
    }
  }
}
