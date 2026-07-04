import Phaser from 'phaser';
import { CONFIG } from '../config.js';
import { I18n } from '../i18n.js';
import { Storage } from '../storage.js';
import { fadeInScene, transitionTo } from '../SceneTransition.js';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super('MenuScene');
  }

  create() {
    fadeInScene(this);
    this.buildUi();
  }

  buildUi() {
    this.children.removeAll(true);

    const save = this.game.registry.get('saveData');
    const theme = CONFIG.THEMES[save.selected.theme];
    const { WIDTH, HEIGHT } = CONFIG;

    this.cameras.main.setBackgroundColor(CONFIG.COLORS.BG);

    const title1 = this.add.text(WIDTH / 2, HEIGHT * 0.2, I18n.t('gameTitle1'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '96px',
      color: '#ffffff'
    }).setOrigin(0.5).setAlpha(0);

    const title2 = this.add.text(WIDTH / 2, HEIGHT * 0.2 + 100, I18n.t('gameTitle2'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '64px',
      color: Phaser.Display.Color.IntegerToColor(theme.blue).rgba
    }).setOrigin(0.5).setAlpha(0);

    const subtitle = this.add.text(WIDTH / 2, HEIGHT * 0.2 + 170, I18n.t('gameSubtitle'), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '28px',
      color: '#666666'
    }).setOrigin(0.5).setAlpha(0);

    this.tweens.add({
      targets: [title1, title2, subtitle],
      alpha: 1,
      y: '-=20',
      duration: 600,
      ease: 'Power2',
      stagger: 120
    });

    this.add.text(WIDTH / 2, HEIGHT * 0.38, `${I18n.t('highScore')}: ${save.highScore}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '36px',
      color: '#FFD700'
    }).setOrigin(0.5);

    this.add.text(WIDTH / 2, HEIGHT * 0.38 + 50, `${I18n.t('gems')}: ${save.gems}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#00CCFF'
    }).setOrigin(0.5);

    this.createButton(WIDTH / 2, HEIGHT * 0.55, I18n.t('play'), theme.red, () => {
      transitionTo(this, 'GameScene');
    }, 380, 110, 40);

    this.createButton(WIDTH / 2, HEIGHT * 0.55 + 150, I18n.t('shop'), theme.blue, () => {
      transitionTo(this, 'ShopScene');
    }, 380, 110, 40);

    this.createLangToggle(WIDTH - 70, HEIGHT - 70);
  }

  createLangToggle(x, y) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.lineStyle(3, 0x666666, 1);
    bg.strokeCircle(0, 0, 42);
    bg.fillStyle(0x1e1e1e, 0.9);
    bg.fillCircle(0, 0, 40);

    const icon = this.add.text(0, 0, '🌐', {
      fontSize: '36px'
    }).setOrigin(0.5);

    const langLabel = this.add.text(0, 52, I18n.lang.toUpperCase(), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '18px',
      color: '#FFD700'
    }).setOrigin(0.5);

    container.add([bg, icon, langLabel]);
    container.setSize(84, 84);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', () => {
      I18n.toggle();
      Storage.saveLang(I18n.lang);
      this.tweens.add({
        targets: container,
        scale: 0.85,
        duration: 80,
        yoyo: true,
        onComplete: () => this.buildUi()
      });
    });
    container.on('pointerover', () => this.tweens.add({ targets: container, scale: 1.08, duration: 120 }));
    container.on('pointerout', () => this.tweens.add({ targets: container, scale: 1, duration: 120 }));
  }

  createButton(x, y, label, color, onClick, w, h, fontSize) {
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.lineStyle(4, color, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    bg.fillStyle(color, 0.12);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 16);

    const text = this.add.text(0, 0, label, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: `${fontSize}px`,
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
