const STORAGE_KEY = 'laserDeflectorSaveV2';

const DEFAULT_SAVE = {
  highScore: 0,
  gems: 0,
  purchased: {
    barrier: ['classic'],
    trail: ['none'],
    theme: ['cyberpunk']
  },
  selected: {
    barrier: 'classic',
    trail: 'none',
    theme: 'cyberpunk'
  },
  upgrades: {
    maxHealth: 0,
    dropInterval: 0,
    colorShift: 0,
    wrongColorPenalty: 0,
    gemBonus: 0
  }
};

export class Storage {
  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const legacy = localStorage.getItem('laserDeflectorSaveV1');
        if (legacy) {
          const parsed = JSON.parse(legacy);
          const migrated = Storage.mergeSave(parsed);
          Storage.save(migrated);
          return migrated;
        }
        return Storage.clone(DEFAULT_SAVE);
      }
      const parsed = JSON.parse(raw);
      return Storage.mergeSave(parsed);
    } catch (e) {
      return Storage.clone(DEFAULT_SAVE);
    }
  }

  static mergeSave(parsed) {
    return {
      ...Storage.clone(DEFAULT_SAVE),
      ...parsed,
      purchased: { ...DEFAULT_SAVE.purchased, ...(parsed.purchased || {}) },
      selected: { ...DEFAULT_SAVE.selected, ...(parsed.selected || {}) },
      upgrades: { ...DEFAULT_SAVE.upgrades, ...(parsed.upgrades || {}) }
    };
  }

  static save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      // localStorage kullanılamıyorsa sessizce yut
    }
  }

  static saveLang(lang) {
    try {
      localStorage.setItem('laserDeflectorLang', lang);
    } catch (e) { /* ignore */ }
  }

  static loadLang() {
    try {
      return localStorage.getItem('laserDeflectorLang') || 'tr';
    } catch (e) {
      return 'tr';
    }
  }

  static clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }
}
