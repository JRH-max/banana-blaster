import Phaser from 'phaser';

const GRID = 50;
const TW = 64, TH = 32;

// ── Persistent save helpers ────────────────────────────────────────────────
const SAVE_KEY = 'bananaBlasterSave';
function loadSave() {
  try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; }
}
function writeSave(data) {
  try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {}
}
function getSavedCoins()    { return loadSave().coins     || 0; }
function getSavedUpgrades() { return loadSave().upgrades  || [[0,0,0],[0,0,0],[0,0,0]]; }
function getSavedChar()     { return loadSave().character || 'banana'; }
function saveCoins(c)       { writeSave({ ...loadSave(), coins: c }); }
function saveUpgrades(ups)  { writeSave({ ...loadSave(), upgrades: ups }); }

function iso(wx, wy) {
  return { x: (wx - wy) * (TW / 2), y: (wx + wy) * (TH / 2) };
}
function isoDepth(wx, wy) { return Math.round((wx + wy) * 100); }

// Slot 1 is character-specific (set in create()). Slots 2+3 are the same for everyone.
const WEAPONS = [
  { name: 'Peel Launcher', type: 'projectile', fireRate: 700,  damage: 55,  speed: 8,  auto: false, splash: 1.5,  reloadTime: 0,    projKey: 'peel',     projScale: 0.30 },
  { name: 'Automatic Rifle',    type: 'hitscan',    fireRate: 120,  damage: 18,  speed: 28, auto: true,  ammo: 30, maxAmmo: 30, reloadTime: 1600 },
  { name: 'Sniper',        type: 'hitscan',    fireRate: 1800, damage: 130, speed: 50, auto: false, ammo: 5,  maxAmmo: 5,  reloadTime: 2600 },
];

// Bots always use this fixed set so player's custom slot-1 doesn't affect them
const BOT_WEAPONS = [
  { name: 'Peel Launcher', type: 'projectile', fireRate: 700,  damage: 55,  speed: 8,  auto: false, splash: 1.5,  reloadTime: 0,    projKey: 'peel', projScale: 0.30 },
  { name: 'Automatic Rifle',    type: 'hitscan',    fireRate: 120,  damage: 18,  speed: 28, auto: true,  ammo: 30, maxAmmo: 30, reloadTime: 1600 },
  { name: 'Sniper',        type: 'hitscan',    fireRate: 1800, damage: 130, speed: 50, auto: false, ammo: 5,  maxAmmo: 5,  reloadTime: 2600 },
];

// Custom slot-1 weapon per character
const CHAR_SLOT1 = {
  banana:       { name: 'Peel Launcher',   type: 'projectile', fireRate: 700,  damage: 55,  speed: 8,  auto: false, splash: 1.5,  reloadTime: 0,    projKey: 'peel',      projScale: 0.30 },
  sloth_pirate: { name: 'Flintlock',       type: 'hitscan',    fireRate: 1800, damage: 110, speed: 50, auto: false, ammo: 1,  maxAmmo: 1,  reloadTime: 1600 },
  hot_dog:      { name: 'Mustard Gun',     type: 'projectile', fireRate: 550,  damage: 40,  speed: 11, auto: false, splash: 1.8,  reloadTime: 0,    projKey: 'peel',      projScale: 0.25, projTint: 0xffdd00 },
  cactus:       { name: 'Thorn Shooter',   type: 'projectile', fireRate: 300,  damage: 22,  speed: 17, auto: true,  ammo: 20, maxAmmo: 20, reloadTime: 900,  projKey: 'shuriken',  projScale: 0.55, projTint: 0x44aa22 },
  ghost:        { name: 'Spook Blaster',   type: 'hitscan',    fireRate: 800,  damage: 70,  speed: 35, auto: false, ammo: 6,  maxAmmo: 6,  reloadTime: 1800 },
  astronaut:    { name: 'Space Pistol',    type: 'hitscan',    fireRate: 500,  damage: 55,  speed: 60, auto: false, ammo: 8,  maxAmmo: 8,  reloadTime: 1400 },
  penguin:      { name: 'Snowball Cannon', type: 'projectile', fireRate: 900,  damage: 50,  speed: 9,  auto: false, splash: 1.6,  reloadTime: 0,    projKey: 'cannonball', projScale: 0.55, projTint: 0xaaddff },
  rock_ninja:   { name: 'Shuriken',        type: 'projectile', fireRate: 185,  damage: 30,  speed: 19, auto: true,  ammo: 24, maxAmmo: 24, reloadTime: 1100, projKey: 'shuriken',  projScale: 0.85 },
  viking:       { name: 'Axe Launcher',    type: 'projectile', fireRate: 1200, damage: 90,  speed: 12, auto: false, splash: 1.0,  reloadTime: 0,    projKey: 'shuriken',  projScale: 1.1,  projTint: 0xaaaaaa },
  robot:        { name: 'Plasma Rifle',    type: 'hitscan',    fireRate: 100,  damage: 20,  speed: 40, auto: true,  ammo: 40, maxAmmo: 40, reloadTime: 1400 },
  wizard:       { name: 'Magic Staff',     type: 'projectile', fireRate: 650,  damage: 60,  speed: 10, auto: false, splash: 2.0,  reloadTime: 0,    projKey: 'pickup',    projScale: 0.5,  projTint: 0xaa44ff },
  shark:        { name: 'Jaw Launcher',    type: 'projectile', fireRate: 800,  damage: 75,  speed: 13, auto: false, splash: 1.4,  reloadTime: 0,    projKey: 'cannonball', projScale: 0.65, projTint: 0x4488cc },
  trash_can:    { name: 'Junk Cannon',     type: 'projectile', fireRate: 1000, damage: 65,  speed: 7,  auto: false, splash: 2.2,  reloadTime: 0,    projKey: 'pickup',    projScale: 0.55, projTint: 0x886633 },
  dragon:       { name: 'Inferno Blaster', type: 'projectile', fireRate: 180,  damage: 35,  speed: 16, auto: true,  ammo: 30, maxAmmo: 30, reloadTime: 1200, projKey: 'peel',      projScale: 0.30, projTint: 0xff4400 },
  mystery:      { name: 'Void Cannon',     type: 'hitscan',    fireRate: 50,   damage: 999, speed: 99, auto: true,  ammo: 99, maxAmmo: 99, reloadTime: 500 },
};

// Gun sprite shown at bottom-center for each character's slot-1
const CHAR_GUN_SPRITE = {
  banana:       'gun_peel',
  sloth_pirate: 'gun_sniper',
  hot_dog:      'gun_peel',
  cactus:       'gun_rifle',
  ghost:        'gun_sniper',
  astronaut:    'gun_sniper',
  penguin:      'gun_peel',
  rock_ninja:   'gun_rifle',
  viking:       'gun_peel',
  robot:        'gun_rifle',
  wizard:       'gun_peel',
  shark:        'gun_peel',
  trash_can:    'gun_peel',
  dragon:       'gun_rifle',
  mystery:      'gun_sniper',
};

const BOT_STATS = {
  banana:  { normal:  { hp: 100, speed: 5.2, weaponIdx: 1, scale: 0.48 } },
  raccoon: {
    normal:  { hp: 60,  speed: 5.5, weaponIdx: 1, scale: 0.37 },
    armored: { hp: 220, speed: 3.5, weaponIdx: 1, scale: 0.40 },
    boss:    { hp: 600, speed: 6.2, weaponIdx: 0, scale: 0.50 },
  },
};

export class GameScene extends Phaser.Scene {
  constructor() { super('GameScene'); }

  // ── create ─────────────────────────────────────────────────────────────────
  create() {
    this._genTrees();
    this._drawGround();
    this._drawTrees();

    // Player
    this.player = { wx: GRID / 2, wy: GRID / 2, angle: 0, hp: 300, maxHp: 300, lives: 3, score: 0, coins: getSavedCoins() };
    const ps = iso(this.player.wx, this.player.wy);
    const charKey = getSavedChar();
    this.playerSpr    = this.add.image(ps.x, ps.y - 22, charKey).setOrigin(0.5, 1).setScale(0.55).setDepth(9000);
    this.playerGun    = this.add.image(ps.x + 14, ps.y - 28, 'bot_gun').setOrigin(0, 0.5).setScale(1.2).setDepth(9001);
    this.playerShadow = this.add.ellipse(ps.x, ps.y - 4, 28, 10, 0x000000, 0.25).setDepth(8990);
    // Blue team ring under player
    this.playerRing   = this.add.ellipse(ps.x, ps.y - 4, 36, 14, 0x44aaff, 0.22).setDepth(8989);

    this.bots    = [];
    this.bullets = [];
    this.pickups = [];
    this.effects = [];
    this.hazards = [];

    this._spawnBots();

    // Apply character's custom slot-1 weapon
    WEAPONS[0] = { ...(CHAR_SLOT1[charKey] ?? CHAR_SLOT1.banana) };

    this.waveNum       = 1;
    this.waveTimer     = 0;
    this.scoped        = false;
    this.scopeMode     = 0;
    this.currentWeapon = 0;   // all characters start on their custom gun
    const _startW      = WEAPONS[0];
    this.ammo          = _startW.ammo !== undefined ? _startW.maxAmmo : -1;
    this.fireCooldown  = 0;
    this.isFiring      = false;
    this.reloading     = false;
    this.shopOpen      = false;
    this.weaponUpgrades = getSavedUpgrades().map(u => ({ damage: u[0], speed: u[1], ammo: u[2] }));

    // Special ability
    const _charKey = getSavedChar();
    const _cdMap   = {
      banana: 5000, sloth_pirate: 8000, hot_dog: 6000, cactus: 5500, ghost: 7000,
      astronaut: 7500, penguin: 5000, rock_ninja: 6000, viking: 6500, robot: 8000,
      wizard: 9000, shark: 5500, trash_can: 9000, dragon: 7000, mystery: 12000,
    };
    this.specialMaxCD = _cdMap[_charKey] || 5000;
    this.specialCD    = 0; // ready to use immediately

    // Camera — manual behind-character follow (no startFollow)
    this.cameras.main.setBounds(
      -(GRID * TW / 2 + 250), -250,
       GRID * TW + 500,
       GRID * TH + 500
    );
    const _ps0 = iso(this.player.wx, this.player.wy);
    this._camX = _ps0.x;
    this._camY = _ps0.y - 22;
    this.cameras.main.centerOn(this._camX, this._camY);

    // Keyboard
    this.cursors = this.input.keyboard.createCursorKeys();
    this.keys = this.input.keyboard.addKeys({
      W:'W', A:'A', S:'S', D:'D',
      Q:Phaser.Input.Keyboard.KeyCodes.Q,
      R:Phaser.Input.Keyboard.KeyCodes.R,
      E:Phaser.Input.Keyboard.KeyCodes.E,
      ONE:   Phaser.Input.Keyboard.KeyCodes.ONE,
      TWO:   Phaser.Input.Keyboard.KeyCodes.TWO,
      THREE: Phaser.Input.Keyboard.KeyCodes.THREE,
      SPACE: Phaser.Input.Keyboard.KeyCodes.SPACE,
    });
    this.input.keyboard.on('keydown-Q', () => this.toggleScope());
    this.input.keyboard.on('keydown-R', () => this._startReload());
    this.input.keyboard.on('keydown-E', () => this._useSpecial());
    this.input.keyboard.on('keydown-ONE',   () => this.switchWeapon(0));
    this.input.keyboard.on('keydown-TWO',   () => this.switchWeapon(1));
    this.input.keyboard.on('keydown-THREE', () => this.switchWeapon(2));
    this.input.keyboard.on('keydown-U', () => this.toggleShop());
    this.input.on('pointerdown', p => { if (p.x > 200) this.isFiring = true; });
    this.input.on('pointerup',   () => { this.isFiring = false; });

    // Touch joystick state
    this.joystickActive    = false;
    this.joystickDir       = { x: 0, y: 0 };
    this.joystickPointerId = -1;
    this._setupTouchJoy();

    this.scene.launch('UIScene');
    this._syncAll();
  }

  // ── update ─────────────────────────────────────────────────────────────────
  update(time, delta) {
    const dt = delta / 1000;
    this._movePlayer(dt);
    this._aimPlayer();
    this._handleFire(delta);
    this._updateBots(delta, dt);
    this._updateBullets(dt);
    this._updatePickups();
    this._updateHazards(dt);
    this._updateEffects(dt);
    this._updatePlayerSprite();
    this._updateCamera();
    this._waveCheck(delta);
    if (this.specialCD > 0) this.specialCD = Math.max(0, this.specialCD - delta);
  }

  // ── over-the-shoulder third-person camera ─────────────────────────────────
  _updateCamera() {
    const s = iso(this.player.wx, this.player.wy);
    const a = this.player.angle;

    // Facing direction in isometric screen space
    const fsx  = (Math.cos(a) - Math.sin(a)) * (TW / 2);
    const fsy  = (Math.cos(a) + Math.sin(a)) * (TH / 2);
    const flen = Math.hypot(fsx, fsy) || 1;
    const fx   = fsx / flen;
    const fy   = fsy / flen;

    // Right-shoulder perpendicular (rotate facing 90° clockwise in screen space)
    const rx = fy, ry = -fx;

    // Camera sits forward of the player and offset to the right shoulder
    const LOOK     = this.scoped ? 290 : 240;
    const SHOULDER = this.scoped ? 30  : 70;

    const tX = s.x      + fx * LOOK + rx * SHOULDER;
    const tY = s.y - 22 + fy * LOOK + ry * SHOULDER;

    const LERP = this.scoped ? 0.04 : 0.09;
    this._camX = Phaser.Math.Linear(this._camX, tX, LERP);
    this._camY = Phaser.Math.Linear(this._camY, tY, LERP);
    this.cameras.main.centerOn(this._camX, this._camY);
  }

  // ── map ────────────────────────────────────────────────────────────────────
  _genTrees() {
    this.trees = [];
    const BORDER = 3, MIN_D = 2.6, CX = GRID / 2, CY = GRID / 2;
    let tries = 0;
    while (this.trees.length < 68 && tries++ < 4000) {
      const wx = BORDER + Math.random() * (GRID - 2 * BORDER);
      const wy = BORDER + Math.random() * (GRID - 2 * BORDER);
      if (Math.hypot(wx - CX, wy - CY) < 5) continue;
      if (this.trees.some(t => Math.hypot(t.wx - wx, t.wy - wy) < MIN_D)) continue;
      this.trees.push({ wx, wy, scale: 0.72 + Math.random() * 0.52 });
    }
  }

  _drawGround() {
    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        const key = (x + y) % 2 === 0 ? 'tile_grass' : 'tile_grass2';
        const s = iso(x, y);
        this.add.image(s.x, s.y, key).setOrigin(0.5, 0.5).setDepth(-10000);
      }
    }
  }

  _drawTrees() {
    const sorted = [...this.trees].sort((a, b) => (a.wx + a.wy) - (b.wx + b.wy));
    for (const t of sorted) {
      const s = iso(t.wx, t.wy);
      const d = isoDepth(t.wx, t.wy);
      this.add.ellipse(s.x, s.y, 32 * t.scale, 10 * t.scale, 0x000000, 0.18).setDepth(d - 5);
      t.sprite = this.add.image(s.x, s.y - 8, 'tree')
        .setOrigin(0.5, 1).setScale(t.scale).setDepth(d + 65);
    }
  }

  _treeAt(wx, wy) {
    return this.trees.some(t => Math.hypot(t.wx - wx, t.wy - wy) < 0.55);
  }

  _canMove(wx, wy) {
    return wx > 0.4 && wx < GRID - 0.4 && wy > 0.4 && wy < GRID - 0.4 && !this._treeAt(wx, wy);
  }

  _tryMove(e, dx, dy) {
    if (this._canMove(e.wx + dx, e.wy + dy)) { e.wx += dx; e.wy += dy; return; }
    if (this._canMove(e.wx + dx, e.wy))      { e.wx += dx; return; }
    if (this._canMove(e.wx,      e.wy + dy)) { e.wy += dy; }
  }

  // ── spawn bots ─────────────────────────────────────────────────────────────
  _spawnBots() {
    // Spread banana bots around different map corners so they naturally clash with raccoons
    const bananaStarts = [
      [8, 8], [42, 8], [8, 42], [25, 10], [10, 25],
    ];
    for (let i = 0; i < 5; i++)
      this._spawnBot('banana', 'normal', bananaStarts[i][0], bananaStarts[i][1]);

    const types = ['normal','normal','normal','normal','normal','armored','armored','boss','normal','normal'];
    types.forEach((type, i) => {
      this._spawnBot('raccoon', type,
        30 + (i % 5) * 3 + Phaser.Math.FloatBetween(-1, 1),
        30 + Math.floor(i / 5) * 5 + Phaser.Math.FloatBetween(-1, 1));
    });
  }

  _spawnBot(faction, type, wx, wy) {
    const st  = BOT_STATS[faction][type] ?? BOT_STATS[faction].normal;
    const tex = faction === 'banana' ? 'banana' : `raccoon_${type}`;
    const s   = iso(wx, wy);
    const d   = isoDepth(wx, wy);

    const ringCol = faction === 'banana' ? 0x44aaff : 0xff4422;
    const ring    = this.add.ellipse(s.x, s.y - 4, 26, 10, ringCol, 0.2).setDepth(d - 2);
    const hpBg    = this.add.rectangle(s.x, s.y - 38, 26, 5, 0x111111, 0.85).setOrigin(0.5, 0.5).setDepth(d + 150);
    const hpBar   = this.add.rectangle(s.x - 13, s.y - 38, 26, 5, 0x33cc33).setOrigin(0, 0.5).setDepth(d + 151);

    const bot = {
      faction, type, wx, wy,
      angle:       Math.random() * Math.PI * 2,
      hp: st.hp,   maxHp: st.hp,
      speed:       st.speed,
      weaponIdx:   st.weaponIdx,
      scale:       st.scale,
      fireCooldown: Phaser.Math.Between(200, 800),
      aiTimer:      Phaser.Math.Between(500, 3000),
      wanderWx: wx, wanderWy: wy,
      strafeDir: 1, stunTimer: 0,
      alive: true,
      sprite: this.add.image(s.x, s.y - 20, tex).setOrigin(0.5, 1).setScale(st.scale).setDepth(d + 10),
      gunSpr: null,
      shadow: this.add.ellipse(s.x, s.y - 4, 22, 8, 0x000000, 0.2).setDepth(d - 1),
      ring, hpBg, hpBar,
    };
    this.bots.push(bot);
    return bot;
  }

  // ── player movement ────────────────────────────────────────────────────────
  _movePlayer(dt) {
    const SPEED = this.scoped ? 2 : 6.5;
    let dx = 0, dy = 0;
    if (this.cursors.up.isDown    || this.keys.W.isDown) { dx -= 1; dy -= 1; }
    if (this.cursors.down.isDown  || this.keys.S.isDown) { dx += 1; dy += 1; }
    if (this.cursors.left.isDown  || this.keys.A.isDown) { dx -= 1; dy += 1; }
    if (this.cursors.right.isDown || this.keys.D.isDown) { dx += 1; dy -= 1; }
    if (this.joystickActive) { dx += this.joystickDir.x * 1.4; dy += this.joystickDir.y * 1.4; }
    const len = Math.hypot(dx, dy);
    if (len > 0) this._tryMove(this.player, (dx / len) * SPEED * dt, (dy / len) * SPEED * dt);
  }

  _aimPlayer() {
    // Primary: aim at mouse / pointer (Fortnite-style OTS aiming)
    const ptr = this.input.activePointer;
    if (ptr && (ptr.x > 0 || ptr.y > 0)) {
      const wp = this.cameras.main.getWorldPoint(ptr.x, ptr.y);
      // Inverse iso transform: wx = sx/TW + sy/TH, wy = sy/TH - sx/TW
      const targetWx = wp.x / TW + wp.y / TH;
      const targetWy = wp.y / TH - wp.x / TW;
      const dx = targetWx - this.player.wx;
      const dy = targetWy - this.player.wy;
      if (Math.hypot(dx, dy) > 0.5) {
        this.player.angle = Math.atan2(dy, dx);
        return;
      }
    }
    // Fallback: auto-aim at nearest raccoon
    let best = null, bestD = 9999;
    for (const b of this.bots) {
      if (!b.alive || b.faction !== 'raccoon') continue;
      const d = Math.hypot(b.wx - this.player.wx, b.wy - this.player.wy);
      if (d < bestD) { best = b; bestD = d; }
    }
    if (best) this.player.angle = Math.atan2(best.wy - this.player.wy, best.wx - this.player.wx);
  }

  _updatePlayerSprite() {
    const s = iso(this.player.wx, this.player.wy);
    const d = isoDepth(this.player.wx, this.player.wy);
    this.playerSpr.setPosition(s.x, s.y - 22).setDepth(d + 12);
    this.playerSpr.setFlipX(Math.cos(this.player.angle) < 0);
    this.playerShadow.setPosition(s.x, s.y - 4).setDepth(d - 2);
    this.playerRing.setPosition(s.x, s.y - 4).setDepth(d - 3);
    const gx = s.x + Math.cos(this.player.angle) * 14;
    const gy = s.y - 28 + Math.sin(this.player.angle) * 5;
    this.playerGun.setPosition(gx, gy)
      .setAngle(Phaser.Math.RadToDeg(this.player.angle))
      .setFlipY(Math.cos(this.player.angle) < 0)
      .setDepth(d + 13);
  }

  // ── firing ─────────────────────────────────────────────────────────────────
  _handleFire(delta) {
    if (this.reloading) return;
    this.fireCooldown = Math.max(0, this.fireCooldown - delta);
    const w = WEAPONS[this.currentWeapon];
    const justFire = Phaser.Input.Keyboard.JustDown(this.keys.SPACE);
    const wantFire = this.isFiring || (w.auto && this.keys.SPACE.isDown) || (!w.auto && justFire);
    if (!wantFire || this.fireCooldown > 0) return;
    const up = this.weaponUpgrades[this.currentWeapon];
    this.fireCooldown = w.fireRate / (1 + up.speed * 0.2);
    if (w.ammo !== undefined) {
      if (this.ammo <= 0) { this._startReload(); return; }
      this.ammo--;
      this.registry.set('ammo', this.ammo);
    }
    const effectiveDamage = Math.round(w.damage * (1 + up.damage * 0.25));
    this._shootFrom(this.player, this.currentWeapon, 'banana', effectiveDamage);
  }

  _shootFrom(shooter, weaponIdx, faction, overrideDamage = null) {
    // Player uses WEAPONS (which has custom slot-1); bots use the fixed BOT_WEAPONS
    const w      = (shooter === this.player) ? WEAPONS[weaponIdx] : BOT_WEAPONS[weaponIdx];
    const damage = overrideDamage !== null ? overrideDamage : w.damage;
    const angle  = shooter.angle;
    const s      = iso(shooter.wx, shooter.wy);

    const flash = this.add.image(
      s.x + Math.cos(angle) * 18, s.y - 22 + Math.sin(angle) * 7, 'muzzle_flash'
    ).setScale(0.30).setDepth(isoDepth(shooter.wx, shooter.wy) + 30);
    this.time.delayedCall(80, () => flash.destroy());

    if (w.type === 'hitscan') {
      this._hitscanShot(shooter, angle, w, faction, damage);
    } else {
      const projSpr = this.add.image(0, 0, w.projKey || 'peel').setScale(w.projScale || 0.30).setDepth(5000);
      if (w.projTint) projSpr.setTint(w.projTint);
      this.bullets.push({
        wx: shooter.wx + Math.cos(angle) * 0.7,
        wy: shooter.wy + Math.sin(angle) * 0.7,
        vx: Math.cos(angle) * w.speed,
        vy: Math.sin(angle) * w.speed,
        damage, faction,
        splash: w.splash ?? 0,
        life: 3.5,
        sprite: projSpr,
      });
    }
  }

  _hitscanShot(shooter, angle, w, faction, damage) {
    const enemies = [
      ...this.bots.filter(b => b.alive && b.faction !== faction),
      ...(faction === 'raccoon' ? [{ wx: this.player.wx, wy: this.player.wy, _isPlayer: true }] : []),
    ];
    let hit = null, hitDist = 9999;
    for (const t of enemies) {
      const dx = t.wx - shooter.wx, dy = t.wy - shooter.wy;
      const dist = Math.hypot(dx, dy);
      const diff = Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(dy, dx) - angle));
      if (diff < 0.30 && dist < hitDist) { hit = t; hitDist = dist; }
    }
    if (hit) {
      if (hit._isPlayer) {
        // Bots do significantly less damage to the player
        const dmg = damage * 0.22 * (0.7 + Math.random() * 0.6);
        this.player.hp = Math.max(0, this.player.hp - dmg);
        this.registry.set('health', this.player.hp);
        this.cameras.main.shake(80, 0.004);
        if (this.player.hp <= 0) this._playerDied();
      } else {
        this._hitEntity(hit, damage, faction);
      }
    }
    this._spawnTrail(shooter, angle, hitDist < 9999 ? hitDist : 22, faction);
  }

  _spawnTrail(shooter, angle, dist, faction) {
    const col = faction === 'banana' ? 0xffee44 : 0xff4422;
    const s   = iso(shooter.wx, shooter.wy);
    const ex  = s.x + Math.cos(angle) * dist * (TW / 2);
    const ey  = s.y - 20 + Math.sin(angle) * dist * (TH / 2);
    const g   = this.add.graphics().setDepth(8500);
    g.lineStyle(1.5, col, 0.55);
    g.lineBetween(s.x + Math.cos(angle) * 14, s.y - 22, ex, ey);
    this.effects.push({ sprite: g, life: 0.07 });
  }

  _hitEntity(bot, damage, attackerFaction) {
    if (!bot.alive) return;
    bot.hp -= damage;
    const s = iso(bot.wx, bot.wy);
    const spark = this.add.image(s.x + Phaser.Math.Between(-6, 6), s.y - 20, 'hit_spark')
      .setScale(0.44).setDepth(9998);
    this.effects.push({ sprite: spark, life: 0.10 });
    if (bot.hp <= 0) this._killBot(bot, attackerFaction);
  }

  _killBot(bot, attackerFaction) {
    bot.alive = false;
    const s = iso(bot.wx, bot.wy);
    const exp = this.add.image(s.x, s.y - 20, 'explosion').setScale(0.50).setDepth(9999);
    this.effects.push({ sprite: exp, life: 0.55, isExplosion: true });

    // Health pickup
    this.pickups.push({
      type: 'health',
      wx: bot.wx + Phaser.Math.FloatBetween(-0.4, 0.4),
      wy: bot.wy + Phaser.Math.FloatBetween(-0.4, 0.4),
      sprite: this.add.image(s.x, s.y - 10, 'pickup').setScale(0.62).setDepth(isoDepth(bot.wx, bot.wy) + 8),
      bob: Math.random() * Math.PI * 2,
    });
    // Drop 10 coins scattered around
    const coinValues = [4, 3, 3];
    for (let c = 0; c < 3; c++) {
      const cx = bot.wx + Phaser.Math.FloatBetween(-1.8, 1.8);
      const cy = bot.wy + Phaser.Math.FloatBetween(-1.8, 1.8);
      const cs = iso(cx, cy);
      this.pickups.push({
        type: 'coin',
        value: coinValues[c],
        wx: cx, wy: cy,
        sprite: this.add.image(cs.x, cs.y - 10, 'coin').setScale(0.95).setDepth(isoDepth(cx, cy) + 8),
        bob: Math.random() * Math.PI * 2,
      });
    }

    if (attackerFaction === 'banana' && bot.faction === 'raccoon') {
      const pts = bot.type === 'boss' ? 500 : bot.type === 'armored' ? 200 : 100;
      this.player.score += pts;
      this.registry.set('score', this.player.score);
    }

    [bot.sprite, bot.shadow, bot.hpBg, bot.hpBar, bot.ring]
      .forEach(o => o.setVisible(false));

    if (bot.faction === 'banana') {
      this.time.delayedCall(7000, () => {
        bot.wx = 4 + Math.random() * 10; bot.wy = 4 + Math.random() * 10;
        bot.hp = bot.maxHp; bot.alive = true;
        [bot.sprite, bot.shadow, bot.hpBg, bot.hpBar, bot.ring]
          .forEach(o => o.setVisible(true));
      });
    }
  }

  // ── bot AI ─────────────────────────────────────────────────────────────────
  _updateBots(delta, dt) {
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      // Stun from banana peel trap
      if (bot.stunTimer > 0) {
        bot.stunTimer -= delta;
        this._updateBotSprite(bot);
        continue;
      }
      bot.fireCooldown -= delta;
      bot.aiTimer      -= delta;

      // Find nearest enemy — raccoons prefer banana bots unless player is very close
      let best = null, bestD = 9999;
      for (const b of this.bots) {
        if (!b.alive || b.faction === bot.faction) continue;
        const d = Math.hypot(b.wx - bot.wx, b.wy - bot.wy);
        if (d < bestD) { best = b; bestD = d; }
      }
      if (bot.faction === 'raccoon') {
        // Only switch to targeting player if they are noticeably closer
        const pd = Math.hypot(this.player.wx - bot.wx, this.player.wy - bot.wy);
        if (pd < bestD * 0.65) {
          best = { wx: this.player.wx, wy: this.player.wy, _isPlayer: true };
          bestD = pd;
        }
      }

      if (best) {
        const dx = best.wx - bot.wx, dy = best.wy - bot.wy;
        const dist = Math.hypot(dx, dy);
        bot.angle = Math.atan2(dy, dx);

        if (dist > 16) {
          this._tryMove(bot, (dx / dist) * bot.speed * dt, (dy / dist) * bot.speed * dt);
        } else if (dist > 9) {
          this._tryMove(bot, (dx / dist) * bot.speed * 0.55 * dt, (dy / dist) * bot.speed * 0.55 * dt);
        } else {
          // Strafe laterally
          if (bot.aiTimer <= 0) {
            bot.strafeDir = Math.random() > 0.5 ? 1 : -1;
            bot.aiTimer   = Phaser.Math.Between(700, 1800);
          }
          const px = -(dy / dist) * bot.strafeDir;
          const py =  (dx / dist) * bot.strafeDir;
          this._tryMove(bot, px * bot.speed * 0.42 * dt, py * bot.speed * 0.42 * dt);
        }

        if (dist < 13 && bot.fireCooldown <= 0) {
          const w = WEAPONS[bot.weaponIdx];
          bot.fireCooldown = w.fireRate + Phaser.Math.Between(-80, 180);
          this._shootFrom(bot, bot.weaponIdx, bot.faction);
        }
      } else {
        // Wander
        if (bot.aiTimer <= 0) {
          bot.wanderWx = 3 + Math.random() * (GRID - 6);
          bot.wanderWy = 3 + Math.random() * (GRID - 6);
          bot.aiTimer  = Phaser.Math.Between(2000, 5000);
        }
        const dx   = bot.wanderWx - bot.wx;
        const dy   = bot.wanderWy - bot.wy;
        const dist = Math.hypot(dx, dy);
        if (dist > 0.5) {
          bot.angle = Math.atan2(dy, dx);
          this._tryMove(bot, (dx / dist) * bot.speed * 0.38 * dt, (dy / dist) * bot.speed * 0.38 * dt);
        }
      }

      this._updateBotSprite(bot);
    }
  }

  _updateBotSprite(bot) {
    const s = iso(bot.wx, bot.wy);
    const d = isoDepth(bot.wx, bot.wy);
    bot.sprite.setPosition(s.x, s.y - 20).setDepth(d + 10);
    bot.sprite.setFlipX(Math.cos(bot.angle) < 0);
    bot.shadow.setPosition(s.x, s.y - 4).setDepth(d - 1);
    bot.ring.setPosition(s.x, s.y - 4).setDepth(d - 2);
    const pct = bot.hp / bot.maxHp;
    bot.hpBg.setPosition(s.x, s.y - 38).setDepth(d + 150);
    bot.hpBar.setPosition(s.x - 13, s.y - 38)
      .setDisplaySize(26 * pct, 5)
      .setFillStyle(pct > 0.5 ? 0x33cc33 : pct > 0.25 ? 0xffaa00 : 0xff2222)
      .setDepth(d + 151);
  }

  // ── bullets ────────────────────────────────────────────────────────────────
  _updateBullets(dt) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const b = this.bullets[i];
      b.life -= dt;
      b.wx += b.vx * dt;
      b.wy += b.vy * dt;
      const s = iso(b.wx, b.wy);
      b.sprite.setPosition(s.x, s.y - 8).setDepth(isoDepth(b.wx, b.wy) + 25);

      let hit = false;
      for (const t of this.bots) {
        if (!t.alive || t.faction === b.faction) continue;
        if (Math.hypot(t.wx - b.wx, t.wy - b.wy) < 0.65) {
          this._hitEntity(t, b.damage, b.faction);
          if (b.splash > 0) {
            for (const t2 of this.bots) {
              if (t2 !== t && t2.alive && t2.faction !== b.faction &&
                  Math.hypot(t2.wx - b.wx, t2.wy - b.wy) < b.splash) {
                this._hitEntity(t2, b.damage * 0.5, b.faction);
              }
            }
          }
          // Peel splash can also hit player if raccoon fires it
          if (b.faction === 'raccoon' && b.splash > 0 &&
              Math.hypot(this.player.wx - b.wx, this.player.wy - b.wy) < b.splash) {
            this.player.hp = Math.max(0, this.player.hp - b.damage * 0.5);
            this.registry.set('health', this.player.hp);
            if (this.player.hp <= 0) this._playerDied();
          }
          hit = true; break;
        }
      }

      if (!hit && b.faction === 'raccoon') {
        if (Math.hypot(this.player.wx - b.wx, this.player.wy - b.wy) < 0.55) {
          // Projectile from bot also reduced
          this.player.hp = Math.max(0, this.player.hp - b.damage * 0.25);
          this.registry.set('health', this.player.hp);
          this.cameras.main.shake(80, 0.004);
          if (this.player.hp <= 0) this._playerDied();
          hit = true;
        }
      }

      if (hit || b.life <= 0 || this._treeAt(b.wx, b.wy) ||
          b.wx < 0 || b.wx > GRID || b.wy < 0 || b.wy > GRID) {
        b.sprite.destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  // ── pickups ────────────────────────────────────────────────────────────────
  _updatePickups() {
    for (let i = this.pickups.length - 1; i >= 0; i--) {
      const p = this.pickups[i];
      p.bob += 0.07;
      const s = iso(p.wx, p.wy);
      p.sprite.setPosition(s.x, s.y - 8 + Math.sin(p.bob) * 3)
        .setDepth(isoDepth(p.wx, p.wy) + 8);
      if (Math.hypot(this.player.wx - p.wx, this.player.wy - p.wy) < 0.75) {
        if (p.type === 'coin') {
          this.player.coins += p.value;
          this.registry.set('coins', this.player.coins);
          saveCoins(this.player.coins);
        } else {
          this.player.hp = Math.min(this.player.maxHp, this.player.hp + 28);
          this.registry.set('health', this.player.hp);
        }
        p.sprite.destroy();
        this.pickups.splice(i, 1);
      }
    }
  }

  // ── effects ────────────────────────────────────────────────────────────────
  _updateEffects(dt) {
    for (let i = this.effects.length - 1; i >= 0; i--) {
      const e = this.effects[i];
      e.life -= dt;
      if (e.isExplosion) {
        e.sprite.setAlpha(Math.max(0, e.life / 0.55));
        e.sprite.setScale(0.28 + (1 - Math.max(0, e.life) / 0.55) * 0.32);
      }
      if (e.life <= 0) { e.sprite.destroy(); this.effects.splice(i, 1); }
    }
  }

  // ── wave system ────────────────────────────────────────────────────────────
  _waveCheck(delta) {
    const alive = this.bots.filter(b => b.faction === 'raccoon' && b.alive).length;
    if (alive === 0) {
      this.waveTimer += delta;
      if (this.waveTimer > 3200) { this.waveTimer = 0; this.waveNum++; this._spawnWave(); }
    }
  }

  _spawnWave() {
    const count = 8 + this.waveNum * 2;
    for (let i = 0; i < count; i++) {
      const r    = Math.random();
      const type = this.waveNum >= 3 ? (r < 0.12 ? 'boss' : r < 0.38 ? 'armored' : 'normal') : 'normal';
      const edge = Phaser.Math.Between(0, 3);
      let wx, wy;
      if (edge === 0) { wx = 1 + Math.random() * (GRID - 2); wy = 1; }
      else if (edge === 1) { wx = GRID - 1.5; wy = 1 + Math.random() * (GRID - 2); }
      else if (edge === 2) { wx = 1 + Math.random() * (GRID - 2); wy = GRID - 1.5; }
      else { wx = 1; wy = 1 + Math.random() * (GRID - 2); }
      this._spawnBot('raccoon', type, wx, wy);
    }
  }

  // ── player death ───────────────────────────────────────────────────────────
  _playerDied() {
    this.player.lives--;
    this.registry.set('lives', this.player.lives);
    if (this.player.lives <= 0) {
      this.cameras.main.flash(600, 255, 0, 0);
      this.time.delayedCall(1800, () => {
        this.scene.stop('UIScene');
        this.scene.start('MenuScene');
      });
      return;
    }
    this.player.hp = this.player.maxHp;
    this.player.wx = GRID / 2; this.player.wy = GRID / 2;
    this.registry.set('health', this.player.hp);
    this.cameras.main.flash(500, 255, 0, 0);
  }

  // ── weapon controls ────────────────────────────────────────────────────────
  _getEffectiveMaxAmmo(idx) {
    const w = WEAPONS[idx];
    if (w.ammo === undefined) return -1;
    return w.maxAmmo + this.weaponUpgrades[idx].ammo * 10;
  }

  toggleShop() {
    this.shopOpen = !this.shopOpen;
    this.registry.set('shopOpen', this.shopOpen);
    if (this.shopOpen) this.scene.pause();
  }

  buyUpgrade(weaponIdx, type) {
    const up = this.weaponUpgrades[weaponIdx];
    const level = up[type];
    if (level >= 3) return;
    const costs = { damage: [30, 60, 100], speed: [50, 90, 140], ammo: [40, 70, 110] };
    const cost = costs[type][level];
    if (this.player.coins < cost) return;
    this.player.coins -= cost;
    up[type]++;
    this.registry.set('coins', this.player.coins);
    saveCoins(this.player.coins);
    saveUpgrades(this.weaponUpgrades.map(u => [u.damage, u.speed, u.ammo]));
  }

  switchWeapon(idx) {
    this.currentWeapon = idx;
    this.reloading     = false;
    this.scoped        = false;
    this.scopeMode     = 0;
    const w = WEAPONS[idx];
    this.ammo = w.ammo !== undefined ? this._getEffectiveMaxAmmo(idx) : -1;
    this.registry.set('weapon',    idx);
    this.registry.set('ammo',      this.ammo === -1 ? '∞' : this.ammo);
    this.registry.set('reloading', false);
    this.registry.set('scopeMode', 0);
    this.cameras.main.setZoom(1);
  }

  toggleScope() {
    if (this.currentWeapon !== 2) return;
    this.scoped    = !this.scoped;
    this.scopeMode = this.scoped ? 2 : 0;
    this.registry.set('scopeMode', this.scopeMode);
    this.tweens.add({ targets: this.cameras.main, zoom: this.scoped ? 2.4 : 1, duration: 220, ease: 'Quad.easeOut' });
  }

  _startReload() {
    const w = WEAPONS[this.currentWeapon];
    const effMax = this._getEffectiveMaxAmmo(this.currentWeapon);
    if (this.reloading || w.ammo === undefined || this.ammo === effMax) return;
    this.reloading = true;
    this.registry.set('reloading', true);
    this.time.delayedCall(w.reloadTime, () => {
      this.reloading = false;
      this.ammo = this._getEffectiveMaxAmmo(this.currentWeapon);
      this.registry.set('ammo', this.ammo);
      this.registry.set('reloading', false);
    });
  }

  _syncAll() {
    this.registry.set('score',     this.player.score);
    this.registry.set('health',    this.player.hp);
    this.registry.set('lives',     this.player.lives);
    this.registry.set('weapon',    this.currentWeapon);
    this.registry.set('ammo',      this.ammo === -1 ? '∞' : this.ammo);
    this.registry.set('reloading', false);
    this.registry.set('scopeMode', 0);
    this.registry.set('coins',     this.player.coins);
    this.registry.set('shopOpen',  false);
    const _abilityNames = {
      banana: 'PEEL TRAP', sloth_pirate: 'CANNONBALL', hot_dog: 'MUSTARD BLAST',
      cactus: 'SPIKE BURST', ghost: 'SOUL SCREAM', astronaut: 'GRAVITY BOMB',
      penguin: 'ICE SLIDE', rock_ninja: 'SHURIKEN STORM', viking: 'BERSERKER',
      robot: 'LASER BEAM', wizard: 'METEOR STORM', shark: 'FEEDING FRENZY',
      trash_can: 'TRASH WAVE', dragon: 'FIRE BREATH', mystery: 'OBLITERATE',
    };
    this.registry.set('specialName', _abilityNames[getSavedChar()] || 'SPECIAL');
    this.registry.set('weaponNames',  WEAPONS.map(w => w.name));
    this.registry.set('gunSprite0',   CHAR_GUN_SPRITE[getSavedChar()] || 'gun_peel');
  }

  // ── Special abilities ──────────────────────────────────────────────────────
  _useSpecial() {
    if (this.specialCD > 0 || this.shopOpen) return;
    this.specialCD = this.specialMaxCD;
    const char = getSavedChar();
    if      (char === 'banana')       this._specialPeelTrap();
    else if (char === 'sloth_pirate') this._specialCannon();
    else if (char === 'hot_dog')      this._specialMustardBlast();
    else if (char === 'cactus')       this._specialSpikeBurst();
    else if (char === 'ghost')        this._specialSoulScream();
    else if (char === 'astronaut')    this._specialGravityBomb();
    else if (char === 'penguin')      this._specialIceSlide();
    else if (char === 'rock_ninja')   this._specialShurikenStorm();
    else if (char === 'viking')       this._specialBerserker();
    else if (char === 'robot')        this._specialLaserBeam();
    else if (char === 'wizard')       this._specialMeteorStorm();
    else if (char === 'shark')        this._specialFeedingFrenzy();
    else if (char === 'trash_can')    this._specialTrashWave();
    else if (char === 'dragon')       this._specialFireBreath();
    else if (char === 'mystery')      this._specialObliterate();
  }

  // Banana — drop 3 banana peels behind the player; bots that step on them
  // take 60 damage and are stunned for 1.5 s (slapstick theme ✓)
  _specialPeelTrap() {
    for (let i = 0; i < 3; i++) {
      const a  = this.player.angle + Math.PI + (i - 1) * 0.65;
      const px = this.player.wx + Math.cos(a) * 1.9;
      const py = this.player.wy + Math.sin(a) * 1.9;
      if (px < 1 || px > GRID - 1 || py < 1 || py > GRID - 1) continue;
      const ps = iso(px, py);
      this.hazards.push({
        type: 'peel', wx: px, wy: py,
        damage: 60, stun: 1500,
        life: 9,
        sprite: this.add.image(ps.x, ps.y - 6, 'peel')
          .setScale(0.7).setDepth(isoDepth(px, py) + 5).setTint(0xffff44),
        bob: Math.random() * Math.PI * 2,
      });
    }
    this.cameras.main.flash(100, 255, 220, 0, 0.3);
  }

  // Sloth Pirate — fire a slow, massive cannonball with huge splash damage
  // (pirates have cannons ✓)
  _specialCannon() {
    const a = this.player.angle;
    const s = iso(this.player.wx, this.player.wy);
    const flash = this.add.image(s.x + Math.cos(a) * 24, s.y - 22 + Math.sin(a) * 9, 'muzzle_flash')
      .setScale(0.95).setDepth(9100);
    this.time.delayedCall(150, () => flash.destroy());
    this.cameras.main.shake(200, 0.014);
    this.bullets.push({
      wx: this.player.wx + Math.cos(a) * 0.9,
      wy: this.player.wy + Math.sin(a) * 0.9,
      vx: Math.cos(a) * 5, vy: Math.sin(a) * 5,
      damage: 130, faction: 'banana', splash: 3.5, life: 4.5,
      sprite: this.add.image(0, 0, 'cannonball').setScale(1.2).setDepth(5000),
    });
  }

  // Rock Ninja — throw 8 shurikens in all directions simultaneously
  // (ninjas throw shurikens, rock = extra-hard hits ✓)
  _specialShurikenStorm() {
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      this.bullets.push({
        wx: this.player.wx + Math.cos(a) * 0.9,
        wy: this.player.wy + Math.sin(a) * 0.9,
        vx: Math.cos(a) * 17, vy: Math.sin(a) * 17,
        damage: 72, faction: 'banana', splash: 0, life: 1.9,
        sprite: this.add.image(0, 0, 'shuriken').setScale(0.9).setDepth(5000),
      });
    }
    this.cameras.main.flash(100, 220, 220, 200, 0.25);
  }

  // Trash Can — instant AOE damage nearby + fling 6 pieces of trash outward
  // (trash can exploding with garbage ✓)
  _specialTrashWave() {
    // Instant close-range blast
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      if (Math.hypot(bot.wx - this.player.wx, bot.wy - this.player.wy) < 3.5)
        this._hitEntity(bot, 90, 'banana');
    }
    // Fling 6 trash projectiles
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      this.bullets.push({
        wx: this.player.wx + Math.cos(a) * 0.8,
        wy: this.player.wy + Math.sin(a) * 0.8,
        vx: Math.cos(a) * 10, vy: Math.sin(a) * 10,
        damage: 75, faction: 'banana', splash: 0.9, life: 2.0,
        sprite: this.add.image(0, 0, 'pickup').setTint(0x886633).setScale(0.55).setDepth(5000),
      });
    }
    this.cameras.main.shake(250, 0.02);
    this.cameras.main.flash(180, 100, 180, 80, 0.35);
  }

  // Hot Dog — spray mustard in a wide cone, slowing + damaging bots
  _specialMustardBlast() {
    for (let i = -4; i <= 4; i++) {
      const a = this.player.angle + i * 0.18;
      this.bullets.push({
        wx: this.player.wx + Math.cos(a) * 0.8,
        wy: this.player.wy + Math.sin(a) * 0.8,
        vx: Math.cos(a) * 9, vy: Math.sin(a) * 9,
        damage: 45, faction: 'banana', splash: 0.8, life: 2.2,
        sprite: this.add.image(0, 0, 'peel').setTint(0xffdd00).setScale(0.28).setDepth(5000),
      });
    }
    // Slow all nearby bots
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      if (Math.hypot(bot.wx - this.player.wx, bot.wy - this.player.wy) < 5)
        bot.stunTimer = (bot.stunTimer || 0) + 1200;
    }
    this.cameras.main.flash(120, 255, 220, 0, 0.3);
  }

  // Cactus — fire a burst of 12 spikes in a full ring
  _specialSpikeBurst() {
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      this.bullets.push({
        wx: this.player.wx + Math.cos(a) * 0.8,
        wy: this.player.wy + Math.sin(a) * 0.8,
        vx: Math.cos(a) * 14, vy: Math.sin(a) * 14,
        damage: 55, faction: 'banana', splash: 0, life: 2.0,
        sprite: this.add.image(0, 0, 'shuriken').setTint(0x44aa22).setScale(0.65).setDepth(5000),
      });
    }
    this.cameras.main.flash(100, 100, 220, 80, 0.25);
  }

  // Ghost — soul scream: instant damage + stun to ALL bots on screen
  _specialSoulScream() {
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      this._hitEntity(bot, 50, 'banana');
      bot.stunTimer = 2000;
    }
    this.cameras.main.flash(200, 200, 200, 255, 0.4);
    this.cameras.main.shake(150, 0.010);
  }

  // Astronaut — gravity bomb: suck all nearby bots toward player then explode
  _specialGravityBomb() {
    const { wx, wy } = this.player;
    // Pull bots in
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      const dx = wx - bot.wx, dy = wy - bot.wy;
      const dist = Math.hypot(dx, dy);
      if (dist < 8) {
        bot.wx += (dx / dist) * Math.min(dist, 3.5);
        bot.wy += (dy / dist) * Math.min(dist, 3.5);
      }
    }
    // Then explode
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      const d = Math.hypot(bot.wx - wx, bot.wy - wy);
      if (d < 4) this._hitEntity(bot, 100 - d * 12, 'banana');
    }
    this.cameras.main.flash(250, 80, 180, 255, 0.5);
    this.cameras.main.shake(300, 0.018);
  }

  // Penguin — ice slide: player dashes forward through enemies, freezing them
  _specialIceSlide() {
    const a = this.player.angle;
    const slideSteps = 6;
    for (let s = 1; s <= slideSteps; s++) {
      const tx = this.player.wx + Math.cos(a) * s * 1.1;
      const ty = this.player.wy + Math.sin(a) * s * 1.1;
      for (const bot of this.bots) {
        if (!bot.alive) continue;
        if (Math.hypot(bot.wx - tx, bot.wy - ty) < 1.2) {
          this._hitEntity(bot, 65, 'banana');
          bot.stunTimer = (bot.stunTimer || 0) + 1800;
        }
      }
    }
    // Teleport player forward
    this.player.wx = Phaser.Math.Clamp(this.player.wx + Math.cos(a) * 4, 1, GRID - 1);
    this.player.wy = Phaser.Math.Clamp(this.player.wy + Math.sin(a) * 4, 1, GRID - 1);
    this.cameras.main.flash(150, 160, 230, 255, 0.35);
  }

  // Viking — berserker: temporary speed + damage boost (handled via flag)
  _specialBerserker() {
    this.berserkerTimer = 5000;
    // Instant nearby melee damage
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      if (Math.hypot(bot.wx - this.player.wx, bot.wy - this.player.wy) < 2.5)
        this._hitEntity(bot, 120, 'banana');
    }
    this.cameras.main.flash(150, 255, 60, 0, 0.4);
    this.cameras.main.shake(200, 0.015);
  }

  // Robot — laser beam: continuous hitscan line that damages all bots in a line
  _specialLaserBeam() {
    const a  = this.player.angle;
    const ox = this.player.wx, oy = this.player.wy;
    let hit = 0;
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      // Project bot onto the laser line
      const dx = bot.wx - ox, dy = bot.wy - oy;
      const along = dx * Math.cos(a) + dy * Math.sin(a);
      if (along < 0) continue;
      const perp = Math.abs(-dx * Math.sin(a) + dy * Math.cos(a));
      if (perp < 0.8) { this._hitEntity(bot, 160, 'banana'); hit++; }
    }
    this.cameras.main.flash(120, 0, 255, 200, 0.4);
    this.cameras.main.shake(100, 0.008);
  }

  // Wizard — meteor storm: 8 meteors rain down at random positions near bots
  _specialMeteorStorm() {
    const targets = this.bots.filter(b => b.alive).slice(0, 8);
    targets.forEach((bot, i) => {
      this.time.delayedCall(i * 120, () => {
        const jx = bot.wx + (Math.random() - 0.5) * 2;
        const jy = bot.wy + (Math.random() - 0.5) * 2;
        // damage all bots near this impact
        for (const b2 of this.bots) {
          if (!b2.alive) continue;
          if (Math.hypot(b2.wx - jx, b2.wy - jy) < 2.0)
            this._hitEntity(b2, 90, 'banana');
        }
        const ps = iso(jx, jy);
        const flash = this.add.image(ps.x, ps.y - 16, 'explosion').setScale(1.4).setDepth(9200).setTint(0xaa44ff);
        this.time.delayedCall(220, () => flash.destroy());
        this.cameras.main.shake(80, 0.008);
      });
    });
    this.cameras.main.flash(100, 180, 80, 255, 0.3);
  }

  // Shark — feeding frenzy: rapid short-range bites in a 180-degree arc ahead
  _specialFeedingFrenzy() {
    let bites = 0;
    const interval = this.time.addEvent({
      delay: 80, repeat: 6, callback: () => {
        const a = this.player.angle + (Math.random() - 0.5) * Math.PI;
        for (const bot of this.bots) {
          if (!bot.alive) continue;
          if (Math.hypot(bot.wx - this.player.wx, bot.wy - this.player.wy) < 3.5) {
            const da = Math.abs(Phaser.Math.Angle.Wrap(Math.atan2(bot.wy - this.player.wy, bot.wx - this.player.wx) - a));
            if (da < Math.PI * 0.6) { this._hitEntity(bot, 55, 'banana'); bites++; }
          }
        }
      },
    });
    this.cameras.main.flash(100, 60, 140, 220, 0.3);
  }

  // Dragon — fire breath: wide cone of fire DoT lasting 2 seconds
  _specialFireBreath() {
    const a    = this.player.angle;
    const coneW = 0.55;  // half-angle in radians
    for (let step = 0; step < 5; step++) {
      this.time.delayedCall(step * 90, () => {
        for (const bot of this.bots) {
          if (!bot.alive) continue;
          const dx = bot.wx - this.player.wx, dy = bot.wy - this.player.wy;
          const dist = Math.hypot(dx, dy);
          if (dist > 6) continue;
          const ang = Math.atan2(dy, dx);
          if (Math.abs(Phaser.Math.Angle.Wrap(ang - a)) < coneW)
            this._hitEntity(bot, 40, 'banana');
        }
        // Spawn visual fireball projectiles
        const spread = (Math.random() - 0.5) * coneW;
        const fa = a + spread;
        this.bullets.push({
          wx: this.player.wx + Math.cos(fa) * 0.9,
          wy: this.player.wy + Math.sin(fa) * 0.9,
          vx: Math.cos(fa) * 13, vy: Math.sin(fa) * 13,
          damage: 0, faction: 'banana', splash: 0, life: 1.2,
          sprite: this.add.image(0, 0, 'peel').setTint(0xff4400).setScale(0.35).setDepth(5000),
        });
      });
    }
    this.cameras.main.flash(200, 255, 80, 0, 0.45);
    this.cameras.main.shake(250, 0.02);
  }

  // Mystery — OBLITERATE: 9999 damage to every bot on screen, full screen flash
  _specialObliterate() {
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      this._hitEntity(bot, 9999, 'banana');
    }
    this.cameras.main.flash(500, 255, 0, 255, 0.9);
    this.cameras.main.shake(400, 0.035);
  }

  // ── Ground hazards (peel traps etc.) ──────────────────────────────────────
  _updateHazards(dt) {
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.life -= dt;
      h.bob   = (h.bob || 0) + 0.07;
      const s = iso(h.wx, h.wy);
      h.sprite.setPosition(s.x, s.y - 6 + Math.sin(h.bob) * 2).setDepth(isoDepth(h.wx, h.wy) + 5);

      // Check if a raccoon steps on it
      for (const bot of this.bots) {
        if (!bot.alive || bot.faction !== 'raccoon') continue;
        if (Math.hypot(bot.wx - h.wx, bot.wy - h.wy) < 0.7) {
          this._hitEntity(bot, h.damage, 'banana');
          if (h.stun) bot.stunTimer = h.stun;
          h.life = 0;
          break;
        }
      }

      if (h.life <= 0) { h.sprite.destroy(); this.hazards.splice(i, 1); }
    }
  }

  // ── touch joystick ─────────────────────────────────────────────────────────
  _setupTouchJoy() {
    const JX = 110, JY = 478, JR = 50;
    this.input.on('pointerdown', p => {
      if (p.x < 200 && p.y > 360) {
        this.joystickActive    = true;
        this.joystickPointerId = p.id;
        this._calcJoy(p, JX, JY, JR);
      }
    });
    this.input.on('pointermove', p => {
      if (this.joystickActive && p.id === this.joystickPointerId)
        this._calcJoy(p, JX, JY, JR);
    });
    this.input.on('pointerup', p => {
      if (p.id === this.joystickPointerId) {
        this.joystickActive = false;
        this.joystickDir    = { x: 0, y: 0 };
      }
    });
  }

  _calcJoy(p, cx, cy, r) {
    const dx = p.x - cx, dy = p.y - cy;
    const d  = Math.min(Math.hypot(dx, dy), r);
    const a  = Math.atan2(dy, dx);
    this.joystickDir = { x: Math.cos(a) * (d / r), y: Math.sin(a) * (d / r) };
  }
}
