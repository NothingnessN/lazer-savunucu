import Phaser from 'phaser';
import { CONFIG } from '../config.js';
import { Storage } from '../storage.js';
import { I18n, getShopLabels } from '../i18n.js';
import { fadeInScene, transitionTo } from '../SceneTransition.js';

const CATEGORIES = ['barrier', 'trail', 'theme', 'upgrades'];

const HELPER_UPGRADE_KEYS = ['maxHealth', 'gemBonus'];
const HARD_UPGRADE_KEYS = ['dropInterval', 'colorShift', 'wrongColorPenalty'];

const UPGRADE_META = {
  maxHealth: { titleKey: 'upgHealthTitle', color: 0x39ff14 },
  dropInterval: { titleKey: 'upgDropTitle', color: 0xff0055 },
  colorShift: { titleKey: 'upgColorShiftTitle', color: 0xff0055 },
  wrongColorPenalty: { titleKey: 'upgWrongPenaltyTitle', color: 0xff0055 },
  gemBonus: { titleKey: 'upgGemTitle', color: 0x00ccff }
};

export class ShopScene extends Phaser.Scene {
  constructor() {
    super('ShopScene');
  }

  create() {
    fadeInScene(this);
    this.save = this.game.registry.get('saveData');
    if (!this.save.upgrades) this.save.upgrades = { maxHealth: 0, dropInterval: 0, colorShift: 0, wrongColorPenalty: 0, gemBonus: 0 };
    this.activeCategory = 'barrier';
    this.tabContainers = [];

    this.cameras.main.setBackgroundColor(CONFIG.COLORS.BG);
    this.buildStaticUi();
    this.renderCategory();
  }

  getTabLabel(cat) {
    const map = {
      barrier: 'tabBarrier',
      trail: 'tabTrail',
      theme: 'tabTheme',
      upgrades: 'tabUpgrades'
    };
    return I18n.t(map[cat]);
  }

  buildStaticUi() {
    const { WIDTH } = CONFIG;

    this.titleText = this.add.text(WIDTH / 2, 80, I18n.t('shopTitle'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '52px',
      color: '#ffffff'
    }).setOrigin(0.5);

    this.gemsText = this.add.text(WIDTH / 2, 140, `${I18n.t('gems')}: ${this.save.gems}`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#FFD700'
    }).setOrigin(0.5);

    const tabWidth = 230;
    const gap = 12;
    const totalWidth = CATEGORIES.length * tabWidth + (CATEGORIES.length - 1) * gap;
    const startX = WIDTH / 2 - totalWidth / 2 + tabWidth / 2;

    CATEGORIES.forEach((cat, i) => {
      const x = startX + i * (tabWidth + gap);
      const tab = this.createTab(x, 210, tabWidth, cat);
      this.tabContainers.push({ cat, container: tab.container, bg: tab.bg, glow: tab.glow });
    });

    this.itemsContainer = this.add.container(0, 0);

    this.createButton(WIDTH / 2, CONFIG.HEIGHT - 120, I18n.t('mainMenu'), 0x00ccff, () => {
      transitionTo(this, 'MenuScene');
    });
  }

  createTab(x, y, tabWidth, cat) {
    const container = this.add.container(x, y);

    const glow = this.add.graphics();
    glow.lineStyle(5, 0xffd700, 0.9);
    glow.strokeRoundedRect(-tabWidth / 2 - 4, -32, tabWidth + 8, 64, 14);
    glow.setVisible(false);

    const bg = this.add.graphics();
    bg.fillStyle(0x1e1e1e, 1);
    bg.fillRoundedRect(-tabWidth / 2, -30, tabWidth, 60, 12);

    const text = this.add.text(0, 0, this.getTabLabel(cat), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '22px',
      color: '#ffffff'
    }).setOrigin(0.5);

    container.add([glow, bg, text]);
    container.setSize(tabWidth, 60);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', () => {
      this.activeCategory = cat;
      this.renderCategory();
    });

    return { container, bg, glow };
  }

  updateTabHighlights() {
    const tabWidth = 230;
    this.tabContainers.forEach(({ cat, bg, glow }) => {
      const isActive = cat === this.activeCategory;
      glow.setVisible(isActive);
      bg.clear();
      bg.fillStyle(isActive ? 0x2a2200 : 0x1e1e1e, 1);
      bg.fillRoundedRect(-tabWidth / 2, -30, tabWidth, 60, 12);

      if (isActive) {
        glow.clear();
        glow.lineStyle(5, 0xffd700, 0.9);
        glow.strokeRoundedRect(-tabWidth / 2 - 4, -32, tabWidth + 8, 64, 14);
        if (this.tabPulseTween) this.tabPulseTween.stop();
        glow.setAlpha(1);
        this.tabPulseTween = this.tweens.add({
          targets: glow,
          alpha: { from: 0.45, to: 1 },
          duration: 700,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut'
        });
      }
    });
  }

  renderCategory() {
    this.itemsContainer.removeAll(true);
    this.updateTabHighlights();

    if (this.activeCategory === 'upgrades') {
      this.renderUpgrades();
      return;
    }

    const items = CONFIG.SHOP_PRICES[this.activeCategory];
    const labels = getShopLabels()[this.activeCategory];
    const keys = Object.keys(items);
    const startY = 310;
    const rowHeight = 150;

    keys.forEach((key, index) => {
      const y = startY + index * rowHeight;
      this.itemsContainer.add(this.buildItemRow(key, labels[key], items[key], y));
    });
  }

  renderUpgrades() {
    const startY = 310;
    const rowHeight = 150;
    const warningHeight = 130;
    let y = startY;

    HELPER_UPGRADE_KEYS.forEach((key) => {
      this.itemsContainer.add(this.buildUpgradeRow(key, y));
      y += rowHeight;
    });

    this.itemsContainer.add(this.buildHardUpgradeWarning(y + warningHeight / 2 - 10));
    y += warningHeight;

    HARD_UPGRADE_KEYS.forEach((key) => {
      this.itemsContainer.add(this.buildUpgradeRow(key, y));
      y += rowHeight;
    });
  }

  buildHardUpgradeWarning(y) {
    const { WIDTH } = CONFIG;
    const container = this.add.container(WIDTH / 2, y);

    container.add(this.add.text(0, -28, I18n.t('upgHardWarningTitle'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '34px',
      color: '#FF3333',
      align: 'center'
    }).setOrigin(0.5));

    container.add(this.add.text(0, 22, I18n.t('upgHardWarningText'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '26px',
      color: '#FF5555',
      align: 'center',
      lineSpacing: 8
    }).setOrigin(0.5));

    return container;
  }

  buildUpgradeRow(key, y) {
    const { WIDTH } = CONFIG;
    const meta = UPGRADE_META[key];
    const cfg = CONFIG.UPGRADES[key];
    const level = this.save.upgrades[key] || 0;
    const maxLevel = cfg.maxLevel;
    const isMax = level >= maxLevel;
    const price = isMax ? 0 : cfg.prices[level];

    const row = this.add.container(WIDTH / 2, y);

    const bg = this.add.graphics();
    bg.lineStyle(3, isMax ? 0xffd700 : 0x333333, 1);
    bg.fillStyle(0x161616, 1);
    bg.fillRoundedRect(-460, -55, 920, 110, 16);
    bg.strokeRoundedRect(-460, -55, 920, 110, 16);
    row.add(bg);

    const swatch = this.add.circle(-380, 0, 24, meta.color);
    row.add(swatch);

    row.add(this.add.text(-320, -16, I18n.t(meta.titleKey), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '30px',
      color: '#ffffff'
    }));

    const statusLabel = isMax
      ? `${I18n.t('upgLevel')}: ${level}/${maxLevel}`
      : `${price} ${I18n.t('gems')}`;
    row.add(this.add.text(-320, 20, statusLabel, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '22px',
      color: isMax ? '#39FF14' : '#FFD700'
    }));

    const actionLabel = isMax ? I18n.t('active') : I18n.t('upgrade');
    const actionColor = isMax ? 0x555555 : 0xff0055;
    const actionBtn = this.buildSmallButton(280, 0, actionLabel, actionColor, () => {
      if (!isMax) this.handleUpgrade(key, price);
    });
    row.add(actionBtn);

    return row;
  }

  handleUpgrade(key, price) {
    const cfg = CONFIG.UPGRADES[key];
    const level = this.save.upgrades[key] || 0;
    if (level >= cfg.maxLevel) return;
    if (this.save.gems < price) return;

    this.save.gems -= price;
    this.save.upgrades[key] = level + 1;
    Storage.save(this.save);
    this.game.registry.set('saveData', this.save);
    this.gemsText.setText(`${I18n.t('gems')}: ${this.save.gems}`);
    this.renderCategory();
  }

  buildItemRow(key, label, price, y) {
    const { WIDTH } = CONFIG;
    const owned = this.save.purchased[this.activeCategory].includes(key);
    const selected = this.save.selected[this.activeCategory] === key;
    const previewColor = this.previewColor(key);

    const row = this.add.container(WIDTH / 2, y);

    const bg = this.add.graphics();
    bg.lineStyle(3, selected ? 0xffd700 : 0x333333, 1);
    bg.fillStyle(0x161616, 1);
    bg.fillRoundedRect(-460, -55, 920, 110, 16);
    bg.strokeRoundedRect(-460, -55, 920, 110, 16);
    row.add(bg);

    const swatch = this.add.circle(-380, 0, 24, previewColor);
    row.add(swatch);

    row.add(this.add.text(-320, -16, label, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '30px',
      color: '#ffffff'
    }));

    const statusLabel = owned
      ? (selected ? I18n.t('selected') : I18n.t('owned'))
      : `${price} ${I18n.t('gems')}`;
    row.add(this.add.text(-320, 20, statusLabel, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '22px',
      color: owned ? '#39FF14' : '#FFD700'
    }));

    const actionLabel = owned ? (selected ? I18n.t('active') : I18n.t('select')) : I18n.t('buy');
    const actionColor = owned ? (selected ? 0x555555 : 0x00ccff) : 0xff0055;
    const actionBtn = this.buildSmallButton(280, 0, actionLabel, actionColor, () => {
      this.handleAction(key, owned, selected);
    });
    row.add(actionBtn);

    return row;
  }

  previewColor(key) {
    if (this.activeCategory === 'theme') {
      return CONFIG.THEMES[key].red;
    }
    return 0x888888;
  }

  buildSmallButton(x, y, label, color, onClick) {
    const w = 200;
    const h = 72;
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.fillStyle(color, 0.85);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 12);
    const text = this.add.text(0, 0, label, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '22px',
      color: '#000000'
    }).setOrigin(0.5);
    container.add([bg, text]);
    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', onClick);
    return container;
  }

  handleAction(key, owned, selected) {
    if (selected) return;

    if (!owned) {
      const price = CONFIG.SHOP_PRICES[this.activeCategory][key];
      if (this.save.gems < price) return;
      this.save.gems -= price;
      this.save.purchased[this.activeCategory].push(key);
    }

    this.save.selected[this.activeCategory] = key;
    Storage.save(this.save);
    this.game.registry.set('saveData', this.save);
    this.gemsText.setText(`${I18n.t('gems')}: ${this.save.gems}`);
    this.renderCategory();
  }

  createButton(x, y, label, color, onClick) {
    const w = 380;
    const h = 90;
    const container = this.add.container(x, y);
    const bg = this.add.graphics();
    bg.lineStyle(4, color, 1);
    bg.strokeRoundedRect(-w / 2, -h / 2, w, h, 16);
    bg.fillStyle(color, 0.12);
    bg.fillRoundedRect(-w / 2, -h / 2, w, h, 16);
    const text = this.add.text(0, 0, label, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '28px',
      color: '#ffffff'
    }).setOrigin(0.5);
    container.add([bg, text]);
    container.setSize(w, h);
    container.setInteractive({ useHandCursor: true });
    container.on('pointerdown', onClick);
    return container;
  }
}
