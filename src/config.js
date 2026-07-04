export const CONFIG = {
  WIDTH: 1080,
  HEIGHT: 1920,

  COLORS: {
    BG: 0x121212,
    GRID: 0x1c1c1c,
    TEXT_PRIMARY: '#ffffff',
    TEXT_ACCENT: '#FFD700',
    TEXT_MUTED: '#666666'
  },

  GRID: {
    SPACING: 90,
    SPEED: 22,
    ALPHA: 0.35
  },

  BARRIER: {
    THICKNESS: 6,
    GLOW_THICKNESS: 12,
    GLOW_ALPHA: 0.4,
    FEVER_THICKNESS: 12,
    FEVER_COLOR: 0xFFD700,
    ZONE_HEIGHT: 34,
    DASH_LENGTH: 10,
    DASH_GAP: 10,
    TWIN_OFFSET: 3,
    TWIN_THICKNESS: 2,
    WAVE_AMPLITUDE: 5,
    WAVE_FREQUENCY: 0.006,
    WAVE_SPEED: 0.004
  },

  BALL: {
    RADIUS: 15,
    SPAWN_Y_TOP: -50,
    SPAWN_Y_BOTTOM_OFFSET: 50,
    INITIAL_VELOCITY: 220,
    SPEED_INCREMENT: 15,
    POOL_SIZE: 60
  },

  HEART: {
    RADIUS: 18,
    FALL_SPEED: 180,
    BASE_INTERVAL: 60000,
    COLOR_SHIFT_INTERVAL: 1200,
    POOL_SIZE: 4
  },

  SPAWN: {
    INITIAL_DELAY: 1400,
    MIN_DELAY: 450,
    FEVER_DELAY: 180,
    DELAY_DECAY: 0.96
  },

  DIFFICULTY: {
    HITS_PER_LEVEL: 10
  },

  HEALTH: {
    BASE: 3,
    ABSOLUTE_MAX: 6
  },

  COMBO: {
    FEVER_TRIGGER: 15
  },

  FEVER: {
    DURATION: 5000,
    SCORE_MULTIPLIER: 2,
    SPARK_FREQUENCY: 60,
    SPEED_BONUS_MULTIPLIER: 1.25
  },

  PARTICLES: {
    SUCCESS_COUNT: 15,
    SUCCESS_LIFESPAN: 500,
    SUCCESS_SPEED_MIN: 100,
    SUCCESS_SPEED_MAX: 200
  },

  DAMAGE: {
    FLASH_DURATION: 100,
    SHAKE_DURATION: 200,
    SHAKE_INTENSITY: 0.02
  },

  THEMES: {
    cyberpunk: { red: 0xFF0055, blue: 0x00CCFF },
    toxic: { red: 0xFF007F, blue: 0x39FF14 },
    synthwave: { red: 0xFF5E00, blue: 0x8A2BE2 }
  },

  BARRIER_SKINS: ['classic', 'dashed', 'twin', 'wave'],
  TRAIL_SKINS: ['none', 'spark', 'ghost'],

  SHOP_PRICES: {
    barrier: { classic: 0, dashed: 150, twin: 250, wave: 400 },
    trail: { none: 0, spark: 200, ghost: 350 },
    theme: { cyberpunk: 0, toxic: 300, synthwave: 500 }
  },

  GEMS_PER_SCORE: 0.6,
  GEMS_FLAT_BONUS: 3,

  UPGRADES: {
    maxHealth: {
      maxLevel: 3,
      prices: [900, 1800, 3200],
      effect: (level) => CONFIG.HEALTH.BASE + level
    },
    dropInterval: {
      maxLevel: 3,
      prices: [700, 1400, 2600],
      intervals: [60000, 120000, 180000, 240000]
    },
    colorShift: {
      maxLevel: 1,
      prices: [3500]
    },
    wrongColorPenalty: {
      maxLevel: 2,
      prices: [2200, 4800],
      penalties: [1, 2, 3]
    },
    gemBonus: {
      maxLevel: 4,
      prices: [800, 1600, 2800, 5000],
      multipliers: [0.6, 0.78, 0.96, 1.18, 1.42]
    }
  }
};

export function getMaxHealth(upgrades) {
  return CONFIG.UPGRADES.maxHealth.effect(upgrades.maxHealth || 0);
}

export function getDropInterval(upgrades) {
  const level = upgrades.dropInterval || 0;
  return CONFIG.UPGRADES.dropInterval.intervals[level] ?? CONFIG.HEART.BASE_INTERVAL;
}

export function getWrongHeartPenalty(upgrades) {
  const level = upgrades.wrongColorPenalty || 0;
  return CONFIG.UPGRADES.wrongColorPenalty.penalties[level] ?? 1;
}

export function getGemMultiplier(upgrades) {
  const level = upgrades.gemBonus || 0;
  return CONFIG.UPGRADES.gemBonus.multipliers[level] ?? CONFIG.GEMS_PER_SCORE;
}
