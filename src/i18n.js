const STRINGS = {
  tr: {
    gameTitle1: 'LAZER',
    gameTitle2: 'SAVUNUCU',
    gameSubtitle: 'Çift Yönlü Neon Ritim',
    highScore: 'EN YÜKSEK SKOR',
    gems: 'CEVHER',
    play: 'OYNA',
    shop: 'DÜKKAN',
    score: 'SKOR',
    combo: 'KOMBO',
    feverMode: 'ATEŞ MODU',
    gameOver: 'OYUN BİTTİ',
    gemsEarned: 'CEVHER KAZANILDI',
    retry: 'YENİDEN DENE',
    mainMenu: 'ANA MENÜ',
    shopTitle: 'DÜKKAN',
    tabBarrier: 'BARİYER',
    tabTrail: 'İZ',
    tabTheme: 'TEMA',
    tabUpgrades: 'YÜKSELTME',
    selected: 'SEÇİLİ',
    owned: 'SAHİP',
    buy: 'SATIN AL',
    select: 'SEÇ',
    active: 'AKTİF',
    maxLevel: 'MAKS',
    upgrade: 'YÜKSELT',
    // Barrier skins
    barrierClassic: 'Klasik',
    barrierDashed: 'Kesikli',
    barrierTwin: 'Çift Akım',
    barrierWave: 'Dalgalı',
    // Trail skins
    trailNone: 'Yok',
    trailSpark: 'Kıvılcım',
    trailGhost: 'Hayalet',
    // Themes
    themeCyberpunk: 'Siberpunk',
    themeToxic: 'Zehirli Çöl',
    themeSynthwave: 'Retro Sentez',
    // Upgrades
    upgHealthTitle: 'Can Kapasitesi',
    upgHealthDesc: 'Maksimum canını artır (3 → 6)',
    upgDropTitle: 'Düşen Can Aralığı',
    upgDropDesc: 'ZORLAŞTIRICI — Düşen can aralığını uzat',
    upgColorShiftTitle: 'Renk Değiştiren Kalpler',
    upgColorShiftDesc: 'ZORLAŞTIRICI — Kalpler renk değiştirir!',
    upgWrongPenaltyTitle: 'Yanlış Renk Cezası',
    upgWrongPenaltyDesc: 'ZORLAŞTIRICI — Yanlış renkte yakalama cezası artar',
    upgGemTitle: 'Cevher Bonusu',
    upgGemDesc: 'Kolaylaştırıcı — Oyun sonunda daha fazla cevher kazan',
    upgLevel: 'Seviye',
    upgDanger: '⚠ ZORLAŞTIRICI',
    upgHelper: '✦ KOLAYLAŞTIRICI',
    upgHardWarningTitle: '⚠ ZORLAŞTIRICI YÜKSELTMELER',
    upgHardWarningText: 'Aşağıdaki özellikler oyunu ZORLAŞTIRIR!\nDikkatli olun.'
  },
  en: {
    gameTitle1: 'LASER',
    gameTitle2: 'DEFLECTOR',
    gameSubtitle: 'Dual-Directional Neon Rhythm',
    highScore: 'HIGH SCORE',
    gems: 'GEMS',
    play: 'PLAY',
    shop: 'SHOP',
    score: 'SCORE',
    combo: 'COMBO',
    feverMode: 'FEVER MODE',
    gameOver: 'GAME OVER',
    gemsEarned: 'GEMS EARNED',
    retry: 'RETRY',
    mainMenu: 'MAIN MENU',
    shopTitle: 'SHOP',
    tabBarrier: 'BARRIER',
    tabTrail: 'TRAIL',
    tabTheme: 'THEME',
    tabUpgrades: 'UPGRADES',
    selected: 'SELECTED',
    owned: 'OWNED',
    buy: 'BUY',
    select: 'SELECT',
    active: 'ACTIVE',
    maxLevel: 'MAX',
    upgrade: 'UPGRADE',
    barrierClassic: 'Classic',
    barrierDashed: 'Dashed',
    barrierTwin: 'Twin Flow',
    barrierWave: 'Wave',
    trailNone: 'None',
    trailSpark: 'Spark',
    trailGhost: 'Ghost',
    themeCyberpunk: 'Cyberpunk',
    themeToxic: 'Toxic Wasteland',
    themeSynthwave: 'Retro Synthwave',
    upgHealthTitle: 'Health Capacity',
    upgHealthDesc: 'Increase max health (3 → 6)',
    upgDropTitle: 'Heart Drop Interval',
    upgDropDesc: 'HARDER — Slow down falling hearts',
    upgColorShiftTitle: 'Color-Shifting Hearts',
    upgColorShiftDesc: 'HARDER — Hearts change color!',
    upgWrongPenaltyTitle: 'Wrong Color Penalty',
    upgWrongPenaltyDesc: 'HARDER — Wrong catch costs more health',
    upgGemTitle: 'Gem Bonus',
    upgGemDesc: 'EASIER — Earn more gems after each run',
    upgLevel: 'Level',
    upgDanger: '⚠ HARDER',
    upgHelper: '✦ EASIER',
    upgHardWarningTitle: '⚠ HARD MODE UPGRADES',
    upgHardWarningText: 'The features below make the game HARDER!\nProceed with caution.'
  }
};

export class I18n {
  static lang = 'tr';

  static t(key) {
    return STRINGS[I18n.lang]?.[key] ?? STRINGS.tr[key] ?? key;
  }

  static toggle() {
    I18n.lang = I18n.lang === 'tr' ? 'en' : 'tr';
    return I18n.lang;
  }

  static isTurkish() {
    return I18n.lang === 'tr';
  }
}

export function getShopLabels() {
  return {
    barrier: {
      classic: I18n.t('barrierClassic'),
      dashed: I18n.t('barrierDashed'),
      twin: I18n.t('barrierTwin'),
      wave: I18n.t('barrierWave')
    },
    trail: {
      none: I18n.t('trailNone'),
      spark: I18n.t('trailSpark'),
      ghost: I18n.t('trailGhost')
    },
    theme: {
      cyberpunk: I18n.t('themeCyberpunk'),
      toxic: I18n.t('themeToxic'),
      synthwave: I18n.t('themeSynthwave')
    }
  };
}
