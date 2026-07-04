import Phaser from 'phaser';
import { Storage } from '../storage.js';
import { I18n } from '../i18n.js';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this.generateParticleTexture();
    I18n.lang = Storage.loadLang();
    this.game.registry.set('saveData', Storage.load());
    this.cameras.main.fadeOut(0, 0, 0, 0);
    this.scene.start('MenuScene');
  }

  generateParticleTexture() {
    const g = this.make.graphics({ x: 0, y: 0, add: false });
    g.fillStyle(0xffffff, 1);
    g.fillCircle(4, 4, 4);
    g.generateTexture('particleTex', 8, 8);
    g.destroy();
  }
}
