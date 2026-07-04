import Phaser from 'phaser';
import { CONFIG, getMaxHealth, getDropInterval, getWrongHeartPenalty, getGemMultiplier } from '../config.js';
import { Storage } from '../storage.js';
import { I18n } from '../i18n.js';
import { fadeInScene, transitionTo } from '../SceneTransition.js';
import { BallPool } from '../gameobjects/BallPool.js';
import { HeartPool } from '../gameobjects/HeartPickup.js';
import { Barrier } from '../gameobjects/Barrier.js';
import { BackgroundGrid } from '../gameobjects/BackgroundGrid.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('GameScene');
  }

  create() {
    fadeInScene(this);
    this.save = this.game.registry.get('saveData');
    this.upgrades = this.save.upgrades || {};
    this.theme = CONFIG.THEMES[this.save.selected.theme];
    this.trailSkin = this.save.selected.trail;

    this.maxHealth = getMaxHealth(this.upgrades);
    this.wrongHeartPenalty = getWrongHeartPenalty(this.upgrades);
    this.colorShiftEnabled = (this.upgrades.colorShift || 0) >= 1;
    this.dropInterval = getDropInterval(this.upgrades);

    this.cameras.main.setBackgroundColor(CONFIG.COLORS.BG);

    this.score = 0;
    this.combo = 0;
    this.nonFeverCatches = 0;
    this.currentBallSpeed = CONFIG.BALL.INITIAL_VELOCITY;
    this.health = this.maxHealth;
    this.isFever = false;
    this.isGameOver = false;

    this.background = new BackgroundGrid(this);
    this.barrier = new Barrier(this, this.theme, this.save.selected.barrier);
    this.pool = new BallPool(this);
    this.heartPool = new HeartPool(this);

    this.createHud();

    this.input.on('pointerdown', () => {
      if (!this.isGameOver) this.barrier.toggle();
    });

    this.spawnDelay = CONFIG.SPAWN.INITIAL_DELAY;
    this.spawnTimer = this.time.addEvent({
      delay: this.spawnDelay,
      callback: this.spawnBall,
      callbackScope: this,
      loop: true
    });

    this.heartDropTimer = this.time.addEvent({
      delay: this.dropInterval,
      callback: this.spawnHeart,
      callbackScope: this,
      loop: true
    });

    this.feverSparkEmitters = null;
  }

  createHud() {
    this.scoreText = this.add.text(40, 60, `${I18n.t('score')}: 0`, {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '44px',
      color: '#ffffff'
    }).setDepth(20);

    this.comboText = this.add.text(40, 115, `${I18n.t('combo')}: 0`, {
      fontFamily: 'Arial, sans-serif',
      fontSize: '30px',
      color: '#FFD700'
    }).setDepth(20);

    this.healthText = this.add.text(CONFIG.WIDTH - 40, 60, this.heartsString(), {
      fontFamily: 'Arial, sans-serif',
      fontSize: '40px',
      color: '#FF0055'
    }).setOrigin(1, 0).setDepth(20);

    this.feverText = this.add.text(CONFIG.WIDTH / 2, 180, I18n.t('feverMode'), {
      fontFamily: 'Arial Black, sans-serif',
      fontSize: '48px',
      color: '#FFD700'
    }).setOrigin(0.5).setDepth(20).setVisible(false);
  }

  heartsString() {
    const filled = Math.max(this.health, 0);
    const empty = this.maxHealth - filled;
    return '♥'.repeat(filled) + '♡'.repeat(Math.max(empty, 0));
  }

  update(time, delta) {
    if (this.isGameOver) return;

    this.background.update(delta);
    this.barrier.update(delta);

    const activeBalls = this.pool.getActiveBalls();
    activeBalls.forEach((ball) => {
      this.updateTrail(ball, delta);

      if (ball.isOutOfBounds()) {
        this.pool.release(ball);
        return;
      }

      if (!ball.hasCrossed && this.ballOverlapsBarrier(ball)) {
        this.resolveCollision(ball);
      }
    });

    this.heartPool.getActiveHearts().forEach((heart) => {
      heart.updateColorShift(delta, this.theme);

      if (heart.isOutOfBounds()) {
        this.heartPool.release(heart);
        return;
      }

      if (!heart.hasCrossed && this.heartOverlapsBarrier(heart)) {
        heart.hasCrossed = true;
        this.resolveHeartCollision(heart);
      }
    });
  }

  ballOverlapsBarrier(ball) {
    const half = CONFIG.BARRIER.ZONE_HEIGHT / 2 + CONFIG.BALL.RADIUS;
    return Math.abs(ball.y - this.barrier.y) <= half;
  }

  heartOverlapsBarrier(heart) {
    const half = CONFIG.BARRIER.ZONE_HEIGHT / 2 + CONFIG.HEART.RADIUS;
    return Math.abs(heart.y - this.barrier.y) <= half;
  }

  spawnBall() {
    const ball = this.pool.acquire();
    if (!ball) return;

    const fromTop = Math.random() < 0.5;
    const isRed = Math.random() < 0.5;
    const colorType = isRed ? 'red' : 'blue';
    const colorHex = isRed ? this.theme.red : this.theme.blue;
    const baseVelocity = this.isFever
      ? this.currentBallSpeed * CONFIG.FEVER.SPEED_BONUS_MULTIPLIER
      : this.currentBallSpeed;

    const x = Phaser.Math.Between(CONFIG.BALL.RADIUS + 20, CONFIG.WIDTH - CONFIG.BALL.RADIUS - 20);

    if (fromTop) {
      ball.spawn(x, CONFIG.BALL.SPAWN_Y_TOP, baseVelocity, colorType, colorHex);
    } else {
      ball.spawn(x, CONFIG.HEIGHT + CONFIG.BALL.SPAWN_Y_BOTTOM_OFFSET, -baseVelocity, colorType, colorHex);
    }
  }

  spawnHeart() {
    if (this.isGameOver || this.health >= this.maxHealth) return;

    const heart = this.heartPool.acquire();
    if (!heart) return;

    const isRed = Math.random() < 0.5;
    const colorType = isRed ? 'red' : 'blue';
    const colorHex = isRed ? this.theme.red : this.theme.blue;
    const x = Phaser.Math.Between(CONFIG.HEART.RADIUS + 40, CONFIG.WIDTH - CONFIG.HEART.RADIUS - 40);

    heart.spawn(x, colorType, colorHex, this.colorShiftEnabled);
  }

  resolveCollision(ball) {
    ball.hasCrossed = true;

    const success =
      this.isFever ||
      (ball.colorType === 'red' && !this.barrier.isBlue) ||
      (ball.colorType === 'blue' && this.barrier.isBlue);

    if (success) {
      this.onSuccess(ball);
    } else {
      this.onDamage(1);
    }

    this.pool.release(ball);
  }

  resolveHeartCollision(heart) {
    const matched =
      (heart.colorType === 'red' && !this.barrier.isBlue) ||
      (heart.colorType === 'blue' && this.barrier.isBlue);

    if (matched) {
      if (this.health < this.maxHealth) {
        this.health += 1;
        this.healthText.setText(this.heartsString());
        this.emitSuccessParticles(heart.x, heart.y, heart.circle.fillColor);
      }
    } else {
      this.onDamage(this.wrongHeartPenalty);
    }

    this.heartPool.release(heart);
  }

  onSuccess(ball) {
    const points = this.isFever ? CONFIG.FEVER.SCORE_MULTIPLIER : 1;
    this.score += points;
    this.combo += 1;

    this.scoreText.setText(`${I18n.t('score')}: ${this.score}`);
    this.comboText.setText(`${I18n.t('combo')}: ${this.combo}`);

    this.emitSuccessParticles(ball.x, ball.y, ball.fillColor);

    if (!this.isFever) {
      this.currentBallSpeed += CONFIG.BALL.SPEED_INCREMENT;
      this.nonFeverCatches += 1;

      if (this.nonFeverCatches % CONFIG.DIFFICULTY.HITS_PER_LEVEL === 0) {
        this.increaseSpawnRate();
      }
    }

    if (this.combo === CONFIG.COMBO.FEVER_TRIGGER && !this.isFever) {
      this.startFever();
    }
  }

  onDamage(amount) {
    this.health -= amount;
    this.combo = 0;
    this.comboText.setText(`${I18n.t('combo')}: 0`);
    this.healthText.setText(this.heartsString());
    this.currentBallSpeed = CONFIG.BALL.INITIAL_VELOCITY;
    if (this.isFever) this.preFeverSpeed = CONFIG.BALL.INITIAL_VELOCITY;

    this.cameras.main.flash(CONFIG.DAMAGE.FLASH_DURATION, 255, 0, 0);
    this.cameras.main.shake(CONFIG.DAMAGE.SHAKE_DURATION, CONFIG.DAMAGE.SHAKE_INTENSITY);

    if (this.health <= 0) {
      this.endGame();
    }
  }

  emitSuccessParticles(x, y, color) {
    const emitter = this.add.particles(x, y, 'particleTex', {
      speed: { min: CONFIG.PARTICLES.SUCCESS_SPEED_MIN, max: CONFIG.PARTICLES.SUCCESS_SPEED_MAX },
      lifespan: CONFIG.PARTICLES.SUCCESS_LIFESPAN,
      gravityY: 0,
      scale: { start: 1, end: 0 },
      alpha: { start: 1, end: 0 },
      tint: color,
      quantity: CONFIG.PARTICLES.SUCCESS_COUNT,
      emitting: false
    });
    emitter.setDepth(15);
    emitter.explode(CONFIG.PARTICLES.SUCCESS_COUNT, x, y);
    this.time.delayedCall(CONFIG.PARTICLES.SUCCESS_LIFESPAN + 100, () => emitter.destroy());
  }

  updateTrail(ball, delta) {
    if (this.trailSkin === 'none') return;
    ball.trailTimer -= delta;
    if (ball.trailTimer > 0) return;
    ball.trailTimer = 40;

    if (this.trailSkin === 'spark') {
      const dot = this.add.circle(ball.x, ball.y, CONFIG.BALL.RADIUS * 0.4, ball.fillColor, 0.8);
      dot.setDepth(5);
      this.tweens.add({
        targets: dot,
        alpha: 0,
        scale: 0.2,
        duration: 300,
        onComplete: () => dot.destroy()
      });
    } else if (this.trailSkin === 'ghost') {
      const ghost = this.add.circle(ball.x, ball.y, CONFIG.BALL.RADIUS, ball.fillColor, 0.35);
      ghost.setDepth(4);
      this.tweens.add({
        targets: ghost,
        alpha: 0,
        duration: 200,
        onComplete: () => ghost.destroy()
      });
    }
  }

  increaseSpawnRate() {
    this.spawnDelay = Math.max(
      CONFIG.SPAWN.MIN_DELAY,
      this.spawnDelay * CONFIG.SPAWN.DELAY_DECAY
    );
    if (!this.isFever) this.resetSpawnTimer(this.spawnDelay);
  }

  resetSpawnTimer(delay) {
    if (this.spawnTimer) this.spawnTimer.remove();
    this.spawnTimer = this.time.addEvent({
      delay,
      callback: this.spawnBall,
      callbackScope: this,
      loop: true
    });
  }

  startFever() {
    this.isFever = true;
    this.preFeverSpeed = this.currentBallSpeed;
    this.barrier.setFever(true);
    this.feverText.setVisible(true);
    this.resetSpawnTimer(CONFIG.SPAWN.FEVER_DELAY);
    this.startFeverSparks();

    this.feverShakeEvent = this.time.addEvent({
      delay: 100,
      loop: true,
      callback: () => this.cameras.main.shake(100, 0.006)
    });

    this.feverTimer = this.time.delayedCall(CONFIG.FEVER.DURATION, () => this.endFever());
  }

  startFeverSparks() {
    const y = this.barrier.y;
    this.feverSparkEmitters = [
      this.add.particles(30, y, 'particleTex', {
        speed: { min: 150, max: 300 },
        angle: { min: 160, max: 200 },
        lifespan: 400,
        tint: CONFIG.BARRIER.FEVER_COLOR,
        scale: { start: 0.8, end: 0 },
        frequency: CONFIG.FEVER.SPARK_FREQUENCY
      }).setDepth(15),
      this.add.particles(CONFIG.WIDTH - 30, y, 'particleTex', {
        speed: { min: 150, max: 300 },
        angle: { min: -20, max: 20 },
        lifespan: 400,
        tint: CONFIG.BARRIER.FEVER_COLOR,
        scale: { start: 0.8, end: 0 },
        frequency: CONFIG.FEVER.SPARK_FREQUENCY
      }).setDepth(15)
    ];
  }

  stopFeverSparks() {
    if (this.feverSparkEmitters) {
      this.feverSparkEmitters.forEach((e) => e.destroy());
      this.feverSparkEmitters = null;
    }
  }

  endFever() {
    this.isFever = false;
    this.combo = 0;
    this.comboText.setText(`${I18n.t('combo')}: 0`);
    this.barrier.setFever(false);
    this.feverText.setVisible(false);
    this.stopFeverSparks();
    this.pool.releaseAll();
    this.currentBallSpeed = this.preFeverSpeed;

    if (this.feverShakeEvent) {
      this.feverShakeEvent.remove();
      this.feverShakeEvent = null;
    }

    this.resetSpawnTimer(this.spawnDelay);
  }

  endGame() {
    this.isGameOver = true;
    if (this.spawnTimer) this.spawnTimer.remove();
    if (this.heartDropTimer) this.heartDropTimer.remove();
    if (this.feverShakeEvent) this.feverShakeEvent.remove();
    this.stopFeverSparks();
    this.pool.releaseAll();
    this.heartPool.releaseAll();

    const gemMult = getGemMultiplier(this.upgrades);
    const gemsEarned = CONFIG.GEMS_FLAT_BONUS + Math.floor(this.score * gemMult);
    this.save.gems += gemsEarned;
    if (this.score > this.save.highScore) this.save.highScore = this.score;
    Storage.save(this.save);
    this.game.registry.set('saveData', this.save);

    transitionTo(this, 'GameOverScene', { score: this.score, gemsEarned });
  }
}
