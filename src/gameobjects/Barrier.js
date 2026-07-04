import { CONFIG } from '../config.js';

export class Barrier {
  constructor(scene, theme, skin) {
    this.scene = scene;
    this.theme = theme;
    this.skin = skin;
    this.isBlue = false;
    this.isFever = false;
    this.y = CONFIG.HEIGHT / 2;
    this.waveTime = 0;
    this.graphics = scene.add.graphics();
    this.graphics.setDepth(10);
  }

  toggle() {
    if (this.isFever) return;
    this.isBlue = !this.isBlue;
  }

  setFever(active) {
    this.isFever = active;
  }

  currentColor() {
    if (this.isFever) return CONFIG.BARRIER.FEVER_COLOR;
    return this.isBlue ? this.theme.blue : this.theme.red;
  }

  update(delta) {
    this.waveTime += delta;
    this.draw();
  }

  draw() {
    const g = this.graphics;
    g.clear();

    const color = this.currentColor();
    const thickness = this.isFever ? CONFIG.BARRIER.FEVER_THICKNESS : CONFIG.BARRIER.THICKNESS;
    const width = CONFIG.WIDTH;
    const y = this.y;

    g.lineStyle(CONFIG.BARRIER.GLOW_THICKNESS, color, CONFIG.BARRIER.GLOW_ALPHA);
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(width, y);
    g.strokePath();

    switch (this.skin) {
      case 'dashed':
        this.drawDashed(g, color, thickness, y, width);
        break;
      case 'twin':
        this.drawTwin(g, color, y, width);
        break;
      case 'wave':
        this.drawWave(g, color, thickness, y, width);
        break;
      case 'classic':
      default:
        this.drawClassic(g, color, thickness, y, width);
        break;
    }
  }

  drawClassic(g, color, thickness, y, width) {
    g.lineStyle(thickness, color, 1);
    g.beginPath();
    g.moveTo(0, y);
    g.lineTo(width, y);
    g.strokePath();
  }

  drawDashed(g, color, thickness, y, width) {
    g.lineStyle(thickness, color, 1);
    const dash = CONFIG.BARRIER.DASH_LENGTH;
    const gap = CONFIG.BARRIER.DASH_GAP;
    let x = 0;
    while (x < width) {
      g.beginPath();
      g.moveTo(x, y);
      g.lineTo(Math.min(x + dash, width), y);
      g.strokePath();
      x += dash + gap;
    }
  }

  drawTwin(g, color, y, width) {
    const offset = CONFIG.BARRIER.TWIN_OFFSET;
    const thick = CONFIG.BARRIER.TWIN_THICKNESS;
    g.lineStyle(thick, color, 1);
    g.beginPath();
    g.moveTo(0, y - offset);
    g.lineTo(width, y - offset);
    g.strokePath();
    g.beginPath();
    g.moveTo(0, y + offset);
    g.lineTo(width, y + offset);
    g.strokePath();
  }

  drawWave(g, color, thickness, y, width) {
    g.lineStyle(thickness, color, 1);
    const amp = CONFIG.BARRIER.WAVE_AMPLITUDE;
    const freq = CONFIG.BARRIER.WAVE_FREQUENCY;
    const speed = CONFIG.BARRIER.WAVE_SPEED;
    const step = 12;
    g.beginPath();
    for (let x = 0; x <= width; x += step) {
      const py = y + Math.sin(x * freq + this.waveTime * speed) * amp;
      if (x === 0) g.moveTo(x, py);
      else g.lineTo(x, py);
    }
    g.strokePath();
  }
}
