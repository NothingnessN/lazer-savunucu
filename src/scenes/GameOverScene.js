import Phaser from 'phaser';
import { CONFIG } from '../config.js';
import { I18n } from '../i18n.js';
import { fadeInScene, transitionTo } from '../SceneTransition.js';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super('GameOverScene');
  }

  init(data) {
    this.score = data.score || 0;
    this.gemsEarned = data.gemsEarned || 0;
  }

  create() {
    fadeInScene(this);
    const { WIDTH, HEIGHT } = CONFIG;
    const save = this.game.registry.get('saveData');
    const theme = CONFIG.THEMES[save.selected.theme];

    this.cameras.main.setBackgroundColor(CONFIG.COLORS.BG);

    const title = this.add.text(WIDTH / 2, HEIGHT * 0.26, I18n.t('gameOver'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '72px',
      color: Phaser.Display.Color.IntegerToColor(theme.red).rgba
    }).setOrigin(0.5).setScale(0.5).setAlpha(0);

    this.tweens.add({
      targets: title,
      scale: 1,
      alpha: 1,
      duration: 500,
      ease: 'Back.easeOut'
    });

    const scoreText = this.add.text(WIDTH / 2, HEIGHT * 0.26 + 110, `${I18n.t('score')}: ${this.score}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '48px',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    const gemsText = this.add.text(WIDTH / 2, HEIGHT * 0.26 + 170, `+${this.gemsEarned} ${I18n.t('gemsEarned')}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '32px',
      color: '#00CCFF'
    }).setOrigin(0.5).setAlpha(0);

    const hsText = this.add.text(WIDTH / 2, HEIGHT * 0.26 + 230, `${I18n.t('highScore')}: ${save.highScore}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#FFD700'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [scoreText, gemsText, hsText],
      alpha: 1,
      y: '-=15',
      duration: 400,
      delay: 200,
      stagger: 100,
      ease: 'Power2'
    });

    this.createButton(WIDTH / 2, HEIGHT * 0.58, I18n.t('retry'), theme.red, () => {
      transitionTo(this, 'GameScene');
    });

    this.createButton(WIDTH / 2, HEIGHT * 0.58 + 150, I18n.t('mainMenu'), theme.blue, () => {
      transitionTo(this, 'MenuScene');
    });
  }

  createButton(x, y, label, color, onClick) {
    const w = 420;
    const h = 110;
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.lineStyle(4, color, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    bg.fillStyle(color, 0.12);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 16);

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '34px',
      color: '#ffffff'
    }).setOrigin(0.5);

    container.add([bg, text]);
    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', onClick);
    container.on('pointerover', () => bg.setAlpha(0.7));
    container.on('pointerout', () => bg.setAlpha(1));

    return container;
  }
}
