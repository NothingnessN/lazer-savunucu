import Phaser from 'phaser';
import { CONFIG } from './config.js';
import { BootScene } from './scenes/BootScene.js';
import { MenuScene } from './scenes/MenuScene.js';
import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { ShopScene } from './scenes/ShopScene.js';

function applyDeviceAspectRatio() {
  const windowRatio = window.innerHeight / window.innerWidth;
  // Çok uç ekran oranlarında (tablet vb.) oyun alanının bozulmaması için makul sınırlar
  const clampedRatio = Phaser.Math.Clamp(windowRatio, 1.55, 2.6);
  CONFIG.HEIGHT = Math.round(CONFIG.WIDTH * clampedRatio);
}

applyDeviceAspectRatio();

const gameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: CONFIG.WIDTH,
  height: CONFIG.HEIGHT,
  backgroundColor: CONFIG.COLORS.BG,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [BootScene, MenuScene, GameScene, GameOverScene, ShopScene]
};

new Phaser.Game(gameConfig);
