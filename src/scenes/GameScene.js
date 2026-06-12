import Phaser from 'phaser';

const GRID = 120;
const TW = 48, TH = 48;

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
  return { x: wx * TW, y: wy * TH };
}
function isoDepth(wx, wy) { return Math.round(wy * 100 + wx * 0.1); }

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
// Damage tiers: STARTER ~55 | RARE ~70-80 | EPIC ~100-130 | MYTHIC ~150-170 | ??? godlike
const CHAR_SLOT1 = {
  // STARTER
  banana:       { name: 'Peel Launcher',   type: 'projectile', fireRate: 700,  damage: 55,  speed: 8,  auto: false, splash: 1.5,  reloadTime: 0,    projKey: 'peel',       projScale: 0.30 },
  // RARE
  sloth_pirate: { name: 'Flintlock',       type: 'hitscan',    fireRate: 1800, damage: 115, speed: 50, auto: false, ammo: 1,  maxAmmo: 1,  reloadTime: 1600 },
  hot_dog:      { name: 'Mustard Gun',     type: 'projectile', fireRate: 520,  damage: 70,  speed: 11, auto: false, splash: 1.8,  reloadTime: 0,    projKey: 'peel',       projScale: 0.25, projTint: 0xffdd00 },
  cactus:       { name: 'Thorn Shooter',   type: 'projectile', fireRate: 260,  damage: 35,  speed: 17, auto: true,  ammo: 20, maxAmmo: 20, reloadTime: 900,  projKey: 'shuriken',   projScale: 0.55, projTint: 0x44aa22 },
  ghost:        { name: 'Spook Blaster',   type: 'hitscan',    fireRate: 780,  damage: 78,  speed: 35, auto: false, ammo: 6,  maxAmmo: 6,  reloadTime: 1800 },
  astronaut:    { name: 'Space Pistol',    type: 'hitscan',    fireRate: 480,  damage: 72,  speed: 60, auto: false, ammo: 8,  maxAmmo: 8,  reloadTime: 1400 },
  penguin:      { name: 'Snowball Cannon', type: 'projectile', fireRate: 850,  damage: 68,  speed: 9,  auto: false, splash: 1.6,  reloadTime: 0,    projKey: 'cannonball', projScale: 0.55, projTint: 0xaaddff },
  // EPIC
  rock_ninja:   { name: 'Shuriken',        type: 'projectile', fireRate: 175,  damage: 45,  speed: 19, auto: true,  ammo: 24, maxAmmo: 24, reloadTime: 1100, projKey: 'shuriken',   projScale: 0.85 },
  viking:       { name: 'Axe Launcher',    type: 'projectile', fireRate: 1100, damage: 115, speed: 12, auto: false, splash: 1.0,  reloadTime: 0,    projKey: 'shuriken',   projScale: 1.1,  projTint: 0xaaaaaa },
  robot:        { name: 'Plasma Rifle',    type: 'hitscan',    fireRate: 95,   damage: 30,  speed: 40, auto: true,  ammo: 40, maxAmmo: 40, reloadTime: 1400 },
  wizard:       { name: 'Magic Staff',     type: 'projectile', fireRate: 600,  damage: 100, speed: 10, auto: false, splash: 2.0,  reloadTime: 0,    projKey: 'pickup',     projScale: 0.5,  projTint: 0xaa44ff },
  shark:        { name: 'Jaw Launcher',    type: 'projectile', fireRate: 750,  damage: 105, speed: 13, auto: false, splash: 1.4,  reloadTime: 0,    projKey: 'cannonball', projScale: 0.65, projTint: 0x4488cc },
  // MYTHIC
  trash_can:    { name: 'Junk Cannon',     type: 'projectile', fireRate: 950,  damage: 140, speed: 7,  auto: false, splash: 2.2,  reloadTime: 0,    projKey: 'pickup',     projScale: 0.55, projTint: 0x886633 },
  dragon:       { name: 'Inferno Blaster', type: 'projectile', fireRate: 160,  damage: 55,  speed: 16, auto: true,  ammo: 30, maxAmmo: 30, reloadTime: 1200, projKey: 'peel',       projScale: 0.30, projTint: 0xff4400 },
  // NEW RARE
  taco:        { name: 'Salsa Shooter',    type: 'projectile', fireRate: 600,  damage: 72,  speed: 10, auto: false, splash: 1.7,  reloadTime: 0,    projKey: 'peel',      projScale: 0.28, projTint: 0xff4400 },
  snowman:     { name: 'Frost Cannon',     type: 'projectile', fireRate: 880,  damage: 68,  speed: 8,  auto: false, splash: 1.5,  reloadTime: 0,    projKey: 'cannonball', projScale: 0.50, projTint: 0xaaddff },
  mushroom:    { name: 'Spore Gun',        type: 'projectile', fireRate: 240,  damage: 32,  speed: 15, auto: true,  ammo: 22, maxAmmo: 22, reloadTime: 950, projKey: 'pickup',    projScale: 0.35, projTint: 0x88cc44 },
  pineapple:   { name: 'Juice Blaster',   type: 'projectile', fireRate: 700,  damage: 75,  speed: 11, auto: false, splash: 2.0,  reloadTime: 0,    projKey: 'peel',      projScale: 0.30, projTint: 0xffee00 },
  storm_cloud: { name: 'Thunder Bolt',    type: 'hitscan',    fireRate: 450,  damage: 78,  speed: 99, auto: false, ammo: 8,  maxAmmo: 8,  reloadTime: 1300 },
  mummy:       { name: 'Wrap Gun',        type: 'projectile', fireRate: 820,  damage: 65,  speed: 10, auto: false, splash: 1.2,  reloadTime: 0,    projKey: 'peel',      projScale: 0.25, projTint: 0xddcc88 },
  // NEW EPIC
  samurai:     { name: 'Katana Launcher', type: 'projectile', fireRate: 900,  damage: 108, speed: 22, auto: false, splash: 0,    reloadTime: 0,    projKey: 'shuriken',  projScale: 1.0,  projTint: 0xccccff },
  werewolf:    { name: 'Claw Cannon',     type: 'hitscan',    fireRate: 280,  damage: 42,  speed: 35, auto: true,  ammo: 15, maxAmmo: 15, reloadTime: 800 },
  knight:      { name: 'Lance Launcher',  type: 'projectile', fireRate: 1100, damage: 115, speed: 16, auto: false, splash: 0.8,  reloadTime: 0,    projKey: 'shuriken',  projScale: 1.2,  projTint: 0x8888cc },
  alien:       { name: 'Plasma Pistol',   type: 'hitscan',    fireRate: 420,  damage: 95,  speed: 55, auto: false, ammo: 10, maxAmmo: 10, reloadTime: 1200 },
  zombie:      { name: 'Bone Launcher',   type: 'projectile', fireRate: 750,  damage: 100, speed: 13, auto: false, splash: 1.0,  reloadTime: 0,    projKey: 'pickup',    projScale: 0.45, projTint: 0xccddaa },
  // NEW MYTHIC
  phoenix:     { name: 'Flame Wing',      type: 'projectile', fireRate: 200,  damage: 50,  speed: 18, auto: true,  ammo: 28, maxAmmo: 28, reloadTime: 1100, projKey: 'peel',      projScale: 0.28, projTint: 0xff6600 },
  kraken:      { name: 'Ink Blaster',     type: 'projectile', fireRate: 650,  damage: 155, speed: 9,  auto: false, splash: 2.5,  reloadTime: 0,    projKey: 'cannonball', projScale: 0.70, projTint: 0x224466 },
  witch:       { name: 'Spell Blaster',   type: 'projectile', fireRate: 550,  damage: 105, speed: 14, auto: false, splash: 1.8,  reloadTime: 0,    projKey: 'peel',       projScale: 0.32, projTint: 0x9900cc },
  // ???
  mystery:      { name: 'Void Cannon',     type: 'hitscan',    fireRate: 50,   damage: 999, speed: 99, auto: true,  ammo: 99, maxAmmo: 99, reloadTime: 500 },
  glitch:      { name: 'Glitch Cannon',   type: 'hitscan',    fireRate: 40,   damage: 888, speed: 99, auto: true,  ammo: 99, maxAmmo: 99, reloadTime: 300 },
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
  taco: 'gun_peel', snowman: 'gun_peel', mushroom: 'gun_rifle', pineapple: 'gun_peel',
  storm_cloud: 'gun_sniper', mummy: 'gun_peel', samurai: 'gun_peel', werewolf: 'gun_rifle',
  knight: 'gun_peel', alien: 'gun_sniper', zombie: 'gun_peel', phoenix: 'gun_rifle',
  kraken: 'gun_peel', witch: 'gun_peel', glitch: 'gun_sniper',
};

const BOT_STATS = { hp: 220, speed: 5.0, scale: 0.52 };

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
      taco: 5500, snowman: 6000, mushroom: 5000, pineapple: 5500, storm_cloud: 6500, mummy: 7000,
      samurai: 6000, werewolf: 5500, knight: 7000, alien: 7500, zombie: 6000,
      phoenix: 10000, kraken: 8000, witch: 7500, glitch: 14000,
    };
    this.specialMaxCD = _cdMap[_charKey] || 5000;
    this.specialCD    = 0; // ready to use immediately
    this.phoenixInvincible = 0;

    // Camera — manual behind-character follow (no startFollow)
    this.cameras.main.setBounds(-200, -200, GRID * TW + 400, GRID * TH + 400);
    const _ps0 = iso(this.player.wx, this.player.wy);
    this._camX = _ps0.x;
    this._camY = _ps0.y;
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
    if (this.phoenixInvincible > 0) this.phoenixInvincible = Math.max(0, this.phoenixInvincible - delta);
  }

  // ── over-the-shoulder top-down camera ────────────────────────────────────
  _updateCamera() {
    const s = iso(this.player.wx, this.player.wy);
    const a = this.player.angle;
    const fx = Math.cos(a);
    const fy = Math.sin(a);
    // Right-shoulder offset
    const rx = fy, ry = -fx;
    const LOOK     = this.scoped ? 220 : 170;
    const SHOULDER = this.scoped ? 20  : 45;
    const tX = s.x + fx * LOOK + rx * SHOULDER;
    const tY = s.y + fy * LOOK + ry * SHOULDER;
    const LERP = this.scoped ? 0.04 : 0.09;
    this._camX = Phaser.Math.Linear(this._camX, tX, LERP);
    this._camY = Phaser.Math.Linear(this._camY, tY, LERP);
    this.cameras.main.centerOn(this._camX, this._camY);
  }

  // ── map ────────────────────────────────────────────────────────────────────
  _genTrees() {
    this.trees = [];
    const CX = GRID / 2, CY = GRID / 2;
    const BORDER = 5;
    const WATER_R = 28;

    // Deterministic wall cluster layout (Brawl Stars style)
    // Cluster positions are rotationally symmetric around center
    const clusterSeeds = [];
    const rng = (seed) => { let x = Math.sin(seed * 127.1 + 311.7) * 43758.5; return x - Math.floor(x); };

    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2 + 0.3;
      const dist  = 10 + rng(i) * (GRID / 2 - 16);
      const cx    = CX + Math.cos(angle) * dist;
      const cy    = CY + Math.sin(angle) * dist;
      const w     = 2 + Math.floor(rng(i + 0.5) * 4); // 2-5 wide
      const h     = 2 + Math.floor(rng(i + 0.9) * 4); // 2-5 tall

      // Add the cluster
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          const wx = Math.round(cx - w/2 + dx);
          const wy = Math.round(cy - h/2 + dy);
          if (wx < BORDER || wx >= GRID - BORDER || wy < BORDER || wy >= GRID - BORDER) continue;
          const fromCenter = Math.hypot(wx - CX, wy - CY);
          if (fromCenter < 8) continue; // keep center open
          const edgeDist = Math.min(wx, GRID-1-wx, wy, GRID-1-wy);
          if (edgeDist + edgeDist < WATER_R * 0.55 * 0.9) continue; // skip water corners
          if (this.trees.some(t => Math.hypot(t.wx - wx, t.wy - wy) < 0.8)) continue;
          this.trees.push({ wx, wy, scale: 0.9 + rng(wx * 7 + wy) * 0.3 });
        }
      }
      // Symmetric counterpart (point symmetry)
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < h; dy++) {
          const wx = Math.round(GRID - cx - w/2 + dx);
          const wy = Math.round(GRID - cy - h/2 + dy);
          if (wx < BORDER || wx >= GRID - BORDER || wy < BORDER || wy >= GRID - BORDER) continue;
          const fromCenter = Math.hypot(wx - CX, wy - CY);
          if (fromCenter < 8) continue;
          const edgeDist = Math.min(wx, GRID-1-wx, wy, GRID-1-wy);
          if (edgeDist + edgeDist < WATER_R * 0.55 * 0.9) continue;
          if (this.trees.some(t => Math.hypot(t.wx - wx, t.wy - wy) < 0.8)) continue;
          this.trees.push({ wx, wy, scale: 0.9 + rng(wx * 7 + wy) * 0.3 });
        }
      }
    }

    // Also make corner water and border tiles impassable by adding tree-blockers invisibly
    // (handled via _canMove checking BORDER)
  }

  _drawGround() {
    const CX = GRID / 2, CY = GRID / 2;
    const WATER_R = 28; // corner water radius
    const BORDER  = 4;  // border wall thickness in tiles

    // Generate bush zones (random clusters, symmetrical)
    const bushZones = [];
    const rng = (seed) => { let x = Math.sin(seed) * 10000; return x - Math.floor(x); };
    for (let i = 0; i < 24; i++) {
      const angle = rng(i * 7.3) * Math.PI * 2;
      const dist  = 12 + rng(i * 3.7) * (GRID / 2 - 22);
      const bx    = CX + Math.cos(angle) * dist;
      const by    = CY + Math.sin(angle) * dist;
      const rad   = 4 + rng(i * 5.1) * 5;
      bushZones.push({ x: bx, y: by, r: rad });
      // Rotationally symmetric counterpart
      bushZones.push({ x: GRID - bx, y: GRID - by, r: rad });
    }

    for (let x = 0; x < GRID; x++) {
      for (let y = 0; y < GRID; y++) {
        const s = iso(x, y);
        // Corner water — triangular corners
        const dx = Math.min(x, GRID - 1 - x);
        const dy = Math.min(y, GRID - 1 - y);
        if (dx + dy < WATER_R * 0.55) {
          this.add.image(s.x, s.y, 'tile_water').setOrigin(0.5, 0.5).setDepth(-10000);
          continue;
        }
        // Border wall zone
        if (x < BORDER || x >= GRID - BORDER || y < BORDER || y >= GRID - BORDER) {
          this.add.image(s.x, s.y, 'tile_road').setOrigin(0.5, 0.5).setDepth(-10000);
          continue;
        }
        // Bush zones
        const inBush = bushZones.some(z => Math.hypot(x - z.x, y - z.y) < z.r);
        if (inBush) {
          this.add.image(s.x, s.y, 'tile_bush').setOrigin(0.5, 0.5).setDepth(-10000);
          continue;
        }
        // Normal grass
        const key = (x + y) % 2 === 0 ? 'tile_grass' : 'tile_grass2';
        this.add.image(s.x, s.y, key).setOrigin(0.5, 0.5).setDepth(-10000);
      }
    }
  }

  _drawTrees() {
    const sorted = [...this.trees].sort((a, b) => (a.wx + a.wy) - (b.wx + b.wy));
    for (const t of sorted) {
      const s = iso(t.wx, t.wy);
      const d = isoDepth(t.wx, t.wy);
      // Stone shadow
      this.add.ellipse(s.x, s.y + 4, 36 * t.scale, 12 * t.scale, 0x000000, 0.22).setDepth(d - 5);
      // Stone wall block
      t.sprite = this.add.image(s.x, s.y - 12, 'wall_block')
        .setOrigin(0.5, 1).setScale(t.scale).setDepth(d + 65);
    }
  }

  _treeAt(wx, wy) {
    return this.trees.some(t => Math.hypot(t.wx - wx, t.wy - wy) < 0.55);
  }

  _canMove(wx, wy) {
    const BORDER = 4;
    const WATER_R = 28;
    const dx = Math.min(wx, GRID - 1 - wx);
    const dy = Math.min(wy, GRID - 1 - wy);
    if (dx + dy < WATER_R * 0.55) return false; // water corner
    if (wx < BORDER || wx >= GRID - BORDER || wy < BORDER || wy >= GRID - BORDER) return false; // border wall
    return !this._treeAt(wx, wy);
  }

  _tryMove(e, dx, dy) {
    if (this._canMove(e.wx + dx, e.wy + dy)) { e.wx += dx; e.wy += dy; return; }
    if (this._canMove(e.wx + dx, e.wy))      { e.wx += dx; return; }
    if (this._canMove(e.wx,      e.wy + dy)) { e.wy += dy; }
  }

  // ── spawn bots ─────────────────────────────────────────────────────────────
  _spawnBots() {
    // All available bot skins (every character except the player's and glitch ally)
    const ALL_CHARS = [
      'sloth_pirate','hot_dog','cactus','ghost','astronaut','penguin',
      'taco','snowman','mushroom','pineapple','storm_cloud','mummy',
      'rock_ninja','viking','robot','wizard','shark',
      'samurai','werewolf','knight','alien','zombie','witch',
      'trash_can','dragon','phoenix','kraken',
      'mystery',
    ];
    // Shuffle and deal 2 chars to each enemy team (no repeats)
    const pool = [...ALL_CHARS].sort(() => Math.random() - 0.5);
    const TEAM_CHARS = [
      ['glitch'],               // team 0: ally always Glitch
      [pool[0], pool[1]],       // team 1
      [pool[2], pool[3]],       // team 2
      [pool[4], pool[5]],       // team 3
      [pool[6], pool[7]],       // team 4
    ];
    const TEAM_COLORS = [0x4488ff, 0xff4422, 0xff8800, 0xaa44ff, 0xffcc00];
    const SPAWNS = [
      [[58, 62]],
      [[18, 18], [22, 18]],
      [[100, 18], [104, 18]],
      [[18, 100], [22, 100]],
      [[100, 100], [104, 100]],
    ];

    for (let team = 0; team < 5; team++) {
      const chars  = TEAM_CHARS[team];
      const color  = TEAM_COLORS[team];
      const spawns = SPAWNS[team];
      chars.forEach((charKey, i) => {
        const [wx, wy] = spawns[i] || spawns[0];
        this._spawnBot(charKey, team, color, wx, wy);
      });
    }
  }

  _spawnBot(charKey, team, teamColor, wx, wy) {
    const s = iso(wx, wy);
    const d = isoDepth(wx, wy);

    const ring  = this.add.ellipse(s.x, s.y - 4, 30, 11, teamColor, 0.35).setDepth(d - 2);
    const hpBg  = this.add.rectangle(s.x, s.y - 40, 28, 5, 0x111111, 0.85).setOrigin(0.5, 0.5).setDepth(d + 150);
    const hpBar = this.add.rectangle(s.x - 14, s.y - 40, 28, 5, teamColor).setOrigin(0, 0.5).setDepth(d + 151);
    // Team label dot above HP bar
    const dot = this.add.circle(s.x + 18, s.y - 40, 3, teamColor, 1).setDepth(d + 152);

    const bot = {
      charKey, team, teamColor, wx, wy,
      angle:        Math.random() * Math.PI * 2,
      hp:           BOT_STATS.hp, maxHp: BOT_STATS.hp,
      speed:        BOT_STATS.speed,
      weaponIdx:    1,  // AR by default
      scale:        BOT_STATS.scale,
      fireCooldown: Phaser.Math.Between(200, 800),
      aiTimer:      Phaser.Math.Between(500, 3000),
      wanderWx: wx, wanderWy: wy,
      strafeDir: 1, stunTimer: 0,
      alive: true,
      sprite: this.add.image(s.x, s.y - 20, charKey).setOrigin(0.5, 1).setScale(BOT_STATS.scale).setDepth(d + 10),
      gunSpr: null,
      shadow: this.add.ellipse(s.x, s.y - 4, 22, 8, 0x000000, 0.2).setDepth(d - 1),
      ring, hpBg, hpBar, dot,
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
    // Fallback: auto-aim at nearest non-team-0 bot
    let best = null, bestD = 9999;
    for (const b of this.bots) {
      if (!b.alive || b.team === 0) continue;  // skip allies
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
    this._shootFrom(this.player, this.currentWeapon, 0, effectiveDamage);
  }

  _shootFrom(shooter, weaponIdx, team, overrideDamage = null) {
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
      this._hitscanShot(shooter, angle, w, team, damage);
    } else {
      const projSpr = this.add.image(0, 0, w.projKey || 'peel').setScale(w.projScale || 0.30).setDepth(5000);
      if (w.projTint) projSpr.setTint(w.projTint);
      this.bullets.push({
        wx: shooter.wx + Math.cos(angle) * 0.7,
        wy: shooter.wy + Math.sin(angle) * 0.7,
        vx: Math.cos(angle) * w.speed,
        vy: Math.sin(angle) * w.speed,
        damage, team,
        splash: w.splash ?? 0,
        life: 3.5,
        sprite: projSpr,
      });
    }
  }

  _hitscanShot(shooter, angle, w, team, damage) {
    const enemies = [
      ...this.bots.filter(b => b.alive && b.team !== team),
      ...(team !== 0 ? [{ wx: this.player.wx, wy: this.player.wy, _isPlayer: true }] : []),
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
        this._hitEntity(hit, damage, team);
      }
    }
    this._spawnTrail(shooter, angle, hitDist < 9999 ? hitDist : 22, team);
  }

  _spawnTrail(shooter, angle, dist, team) {
    const TEAM_COLORS = [0x4488ff, 0xff4422, 0xff8800, 0xaa44ff, 0xffcc00];
    const col = TEAM_COLORS[team] ?? 0xffffff;
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

    // Score for player killing enemies
    if (attackerFaction === 0 && bot.team !== 0) {
      const pts = 100;
      this.player.score += pts;
      this.registry.set('score', this.player.score);
    }

    [bot.sprite, bot.shadow, bot.hpBg, bot.hpBar, bot.ring, bot.dot]
      .forEach(o => o && o.setVisible(false));

    // Allies respawn after a delay
    if (bot.team === 0) {
      this.time.delayedCall(7000, () => {
        bot.wx = 58; bot.wy = 62;
        bot.hp = bot.maxHp; bot.alive = true;
        [bot.sprite, bot.shadow, bot.hpBg, bot.hpBar, bot.ring, bot.dot]
          .forEach(o => o && o.setVisible(true));
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

      // Find nearest enemy from a different team
      let best = null, bestD = 9999;
      for (const b of this.bots) {
        if (!b.alive || b.team === bot.team) continue;
        const d = Math.hypot(b.wx - bot.wx, b.wy - bot.wy);
        if (d < bestD) { best = b; bestD = d; }
      }
      // Enemy teams also target the player; ally (team 0) does not target player
      if (bot.team !== 0) {
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
          this._shootFrom(bot, bot.weaponIdx, bot.team);
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
        if (!t.alive || t.team === b.team) continue;
        if (Math.hypot(t.wx - b.wx, t.wy - b.wy) < 0.65) {
          this._hitEntity(t, b.damage, b.team);
          if (b.splash > 0) {
            for (const t2 of this.bots) {
              if (t2 !== t && t2.alive && t2.team !== b.team &&
                  Math.hypot(t2.wx - b.wx, t2.wy - b.wy) < b.splash) {
                this._hitEntity(t2, b.damage * 0.5, b.team);
              }
            }
          }
          // Splash from enemy teams can also hit player
          if (b.team !== 0 && b.splash > 0 &&
              Math.hypot(this.player.wx - b.wx, this.player.wy - b.wy) < b.splash) {
            this.player.hp = Math.max(0, this.player.hp - b.damage * 0.5);
            this.registry.set('health', this.player.hp);
            if (this.player.hp <= 0) this._playerDied();
          }
          hit = true; break;
        }
      }

      // Enemy team projectile can hit player directly
      if (!hit && b.team !== 0) {
        if (Math.hypot(this.player.wx - b.wx, this.player.wy - b.wy) < 0.55) {
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
    // All non-team-0 bots dead = wave clear
    const alive = this.bots.filter(b => b.team !== 0 && b.alive).length;
    if (alive === 0) {
      this.waveTimer += delta;
      if (this.waveTimer > 3200) { this.waveTimer = 0; this.waveNum++; this._spawnWave(); }
    }
  }

  _spawnWave() {
    const ENEMY_CHARS = ['hot_dog','cactus','viking','rock_ninja','ghost','mummy','dragon','phoenix'];
    const TEAM_COLORS = [0x4488ff, 0xff4422, 0xff8800, 0xaa44ff, 0xffcc00];
    const count = 8 + this.waveNum * 2;
    for (let i = 0; i < count; i++) {
      const team = 1 + Math.floor(Math.random() * 4); // teams 1-4
      const charKey = ENEMY_CHARS[Math.floor(Math.random() * ENEMY_CHARS.length)];
      const edge = Phaser.Math.Between(0, 3);
      let wx, wy;
      if (edge === 0) { wx = 1 + Math.random() * (GRID - 2); wy = 1; }
      else if (edge === 1) { wx = GRID - 1.5; wy = 1 + Math.random() * (GRID - 2); }
      else if (edge === 2) { wx = 1 + Math.random() * (GRID - 2); wy = GRID - 1.5; }
      else { wx = 1; wy = 1 + Math.random() * (GRID - 2); }
      this._spawnBot(charKey, team, TEAM_COLORS[team], wx, wy);
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
      taco: 'SALSA SPLASH', snowman: 'BLIZZARD', mushroom: 'SPORE BURST', pineapple: 'JUICE BLAST',
      storm_cloud: 'THUNDERCLAP', mummy: 'BANDAGE TRAP', samurai: 'BLADE RUSH', werewolf: 'HOWL',
      knight: 'SHIELD CHARGE', alien: 'ABDUCTION', zombie: 'UNDEAD SURGE',
      phoenix: 'REBIRTH', kraken: 'TENTACLE SLAM', witch: "WITCH'S CURSE", glitch: 'REALITY WARP',
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
    else if (char === 'taco')         this._specialSalsaSplash();
    else if (char === 'snowman')      this._specialBlizzard();
    else if (char === 'mushroom')     this._specialSporeBurst();
    else if (char === 'pineapple')    this._specialJuiceBlast();
    else if (char === 'storm_cloud')  this._specialThunderclap();
    else if (char === 'mummy')        this._specialBandageTrap();
    else if (char === 'samurai')      this._specialBladeRush();
    else if (char === 'werewolf')     this._specialHowl();
    else if (char === 'knight')       this._specialShieldCharge();
    else if (char === 'alien')        this._specialAbduction();
    else if (char === 'zombie')       this._specialUndeadSurge();
    else if (char === 'phoenix')      this._specialRebirth();
    else if (char === 'kraken')       this._specialTentacleSlam();
    else if (char === 'witch')        this._specialWitchsCurse();
    else if (char === 'glitch')       this._specialRealityWarp();
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
      damage: 130, team: 0, splash: 3.5, life: 4.5,
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
        damage: 72, team: 0, splash: 0, life: 1.9,
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
        this._hitEntity(bot, 90, 0);
    }
    // Fling 6 trash projectiles
    for (let i = 0; i < 6; i++) {
      const a = (i / 6) * Math.PI * 2;
      this.bullets.push({
        wx: this.player.wx + Math.cos(a) * 0.8,
        wy: this.player.wy + Math.sin(a) * 0.8,
        vx: Math.cos(a) * 10, vy: Math.sin(a) * 10,
        damage: 75, team: 0, splash: 0.9, life: 2.0,
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
        damage: 45, team: 0, splash: 0.8, life: 2.2,
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
        damage: 55, team: 0, splash: 0, life: 2.0,
        sprite: this.add.image(0, 0, 'shuriken').setTint(0x44aa22).setScale(0.65).setDepth(5000),
      });
    }
    this.cameras.main.flash(100, 100, 220, 80, 0.25);
  }

  // Ghost — soul scream: instant damage + stun to ALL bots on screen
  _specialSoulScream() {
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      this._hitEntity(bot, 50, 0);
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
      if (d < 4) this._hitEntity(bot, 100 - d * 12, 0);
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
          this._hitEntity(bot, 65, 0);
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
        this._hitEntity(bot, 120, 0);
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
      if (perp < 0.8) { this._hitEntity(bot, 160, 0); hit++; }
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
            this._hitEntity(b2, 90, 0);
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
            if (da < Math.PI * 0.6) { this._hitEntity(bot, 55, 0); bites++; }
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
            this._hitEntity(bot, 40, 0);
        }
        // Spawn visual fireball projectiles
        const spread = (Math.random() - 0.5) * coneW;
        const fa = a + spread;
        this.bullets.push({
          wx: this.player.wx + Math.cos(fa) * 0.9,
          wy: this.player.wy + Math.sin(fa) * 0.9,
          vx: Math.cos(fa) * 13, vy: Math.sin(fa) * 13,
          damage: 0, team: 0, splash: 0, life: 1.2,
          sprite: this.add.image(0, 0, 'peel').setTint(0xff4400).setScale(0.35).setDepth(5000),
        });
      });
    }
    this.cameras.main.flash(200, 255, 80, 0, 0.45);
    this.cameras.main.shake(250, 0.02);
  }

  // Mystery — OBLITERATE: fully heal + restore all lives, then fire a random ability
  _specialObliterate() {
    // ── Full heal ──────────────────────────────────────────────────────────
    this.player.hp    = this.player.maxHp;
    this.player.lives = 3;
    this._syncAll();

    // ── Random attack from all other characters' supers ───────────────────
    const pool = [
      () => this._specialPeelTrap(),
      () => this._specialCannon(),
      () => this._specialMustardBlast(),
      () => this._specialSpikeBurst(),
      () => this._specialSoulScream(),
      () => this._specialGravityBomb(),
      () => this._specialIceSlide(),
      () => this._specialShurikenStorm(),
      () => this._specialBerserker(),
      () => this._specialLaserBeam(),
      () => this._specialMeteorStorm(),
      () => this._specialFeedingFrenzy(),
      () => this._specialTrashWave(),
      () => this._specialFireBreath(),
    ];
    pool[Math.floor(Math.random() * pool.length)]();

    this.cameras.main.flash(600, 255, 0, 255, 0.92);
    this.cameras.main.shake(500, 0.04);
  }

  _specialSalsaSplash() {
    const a = this.player.angle;
    for (let i = -2; i <= 2; i++) {
      const fa = a + i * 0.22;
      this.bullets.push({ wx: this.player.wx + Math.cos(fa)*0.8, wy: this.player.wy + Math.sin(fa)*0.8,
        vx: Math.cos(fa)*11, vy: Math.sin(fa)*11, damage: 80, team: 0, splash: 1.5, life: 2.2,
        sprite: this.add.image(0,0,'peel').setTint(0xff4400).setScale(0.35).setDepth(5000) });
    }
    for (const bot of this.bots) { if (!bot.alive) continue; if (Math.hypot(bot.wx-this.player.wx,bot.wy-this.player.wy)<4) bot.stunTimer=(bot.stunTimer||0)+800; }
    this.cameras.main.flash(120,255,80,0,0.3);
  }

  _specialBlizzard() {
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      const d = Math.hypot(bot.wx-this.player.wx, bot.wy-this.player.wy);
      if (d < 6) { this._hitEntity(bot, 55, 0); bot.stunTimer = (bot.stunTimer||0)+2500; }
    }
    this.cameras.main.flash(200,180,220,255,0.4); this.cameras.main.shake(150,0.008);
  }

  _specialSporeBurst() {
    for (let i = 0; i < 10; i++) {
      const a = (i/10)*Math.PI*2;
      this.bullets.push({ wx: this.player.wx+Math.cos(a)*0.8, wy: this.player.wy+Math.sin(a)*0.8,
        vx: Math.cos(a)*10, vy: Math.sin(a)*10, damage: 45, team: 0, splash: 0.6, life: 2.0,
        sprite: this.add.image(0,0,'pickup').setTint(0x88cc44).setScale(0.35).setDepth(5000) });
    }
    this.cameras.main.flash(100,100,200,80,0.2);
  }

  _specialJuiceBlast() {
    const a = this.player.angle;
    for (let i = -1; i <= 1; i++) {
      const fa = a + i * 0.3;
      this.bullets.push({ wx: this.player.wx+Math.cos(fa)*0.8, wy: this.player.wy+Math.sin(fa)*0.8,
        vx: Math.cos(fa)*12, vy: Math.sin(fa)*12, damage: 110, team: 0, splash: 2.2, life: 2.0,
        sprite: this.add.image(0,0,'peel').setTint(0xffee00).setScale(0.4).setDepth(5000) });
    }
    this.cameras.main.flash(120,255,230,0,0.35); this.cameras.main.shake(150,0.01);
  }

  _specialThunderclap() {
    const targets = this.bots.filter(b=>b.alive).sort(()=>Math.random()-0.5).slice(0,6);
    targets.forEach((bot,i) => {
      this.time.delayedCall(i*100, () => {
        if (!bot.alive) return;
        this._hitEntity(bot, 95, 0); bot.stunTimer=(bot.stunTimer||0)+600;
        const ps=iso(bot.wx,bot.wy); const flash=this.add.image(ps.x,ps.y-20,'muzzle_flash').setScale(1.2).setDepth(9200).setTint(0xaaaaff);
        this.time.delayedCall(150,()=>flash.destroy());
      });
    });
    this.cameras.main.flash(80,150,150,255,0.35);
  }

  _specialBandageTrap() {
    for (let i = 0; i < 3; i++) {
      const a = this.player.angle + Math.PI + (i-1)*0.7;
      const px = this.player.wx+Math.cos(a)*2.0, py = this.player.wy+Math.sin(a)*2.0;
      if (px<1||px>GRID-1||py<1||py>GRID-1) continue;
      const ps = iso(px,py);
      this.hazards.push({ type:'peel', wx:px, wy:py, damage:50, stun:2200, life:11,
        sprite: this.add.image(ps.x,ps.y-6,'peel').setScale(0.65).setDepth(isoDepth(px,py)+5).setTint(0xddcc88), bob:Math.random()*Math.PI*2 });
    }
    this.cameras.main.flash(80,220,200,160,0.25);
  }

  _specialBladeRush() {
    const a = this.player.angle;
    for (let s=1; s<=7; s++) {
      const tx=this.player.wx+Math.cos(a)*s*0.9, ty=this.player.wy+Math.sin(a)*s*0.9;
      for (const bot of this.bots) { if (!bot.alive) continue; if (Math.hypot(bot.wx-tx,bot.wy-ty)<1.0) this._hitEntity(bot, 130, 0); }
    }
    this.player.wx=Phaser.Math.Clamp(this.player.wx+Math.cos(a)*5,1,GRID-1);
    this.player.wy=Phaser.Math.Clamp(this.player.wy+Math.sin(a)*5,1,GRID-1);
    this.cameras.main.flash(100,220,220,255,0.3); this.cameras.main.shake(120,0.01);
  }

  _specialHowl() {
    for (const bot of this.bots) { if (!bot.alive) continue; bot.stunTimer=(bot.stunTimer||0)+1800; }
    this.berserkerTimer=(this.berserkerTimer||0)+4000;
    this.cameras.main.flash(150,180,80,20,0.35); this.cameras.main.shake(200,0.012);
  }

  _specialShieldCharge() {
    const a = this.player.angle;
    for (let s=1; s<=6; s++) {
      const tx=this.player.wx+Math.cos(a)*s, ty=this.player.wy+Math.sin(a)*s;
      for (const bot of this.bots) { if (!bot.alive) continue; if (Math.hypot(bot.wx-tx,bot.wy-ty)<1.2) { this._hitEntity(bot, 100, 0); bot.stunTimer=1000; } }
    }
    this.player.wx=Phaser.Math.Clamp(this.player.wx+Math.cos(a)*4,1,GRID-1);
    this.player.wy=Phaser.Math.Clamp(this.player.wy+Math.sin(a)*4,1,GRID-1);
    this.player.hp=Math.min(this.player.maxHp, this.player.hp+30);
    this.cameras.main.flash(120,200,200,255,0.3); this.cameras.main.shake(150,0.012);
  }

  _specialAbduction() {
    const {wx,wy}=this.player;
    const closest=this.bots.filter(b=>b.alive).sort((a,b)=>Math.hypot(a.wx-wx,a.wy-wy)-Math.hypot(b.wx-wx,b.wy-wy))[0];
    if (closest) {
      this._hitEntity(closest, 250, 0);
      for (const bot of this.bots) { if (!bot.alive||bot===closest) continue; if (Math.hypot(bot.wx-closest.wx,bot.wy-closest.wy)<3) this._hitEntity(bot, 80, 0); }
    }
    this.cameras.main.flash(200,0,200,255,0.5); this.cameras.main.shake(200,0.015);
  }

  _specialUndeadSurge() {
    for (let i=0;i<12;i++) {
      const a=(i/12)*Math.PI*2;
      this.bullets.push({ wx:this.player.wx+Math.cos(a)*0.8, wy:this.player.wy+Math.sin(a)*0.8,
        vx:Math.cos(a)*11, vy:Math.sin(a)*11, damage:85, team: 0, splash:0.7, life:2.2,
        sprite:this.add.image(0,0,'pickup').setTint(0xaacc88).setScale(0.45).setDepth(5000) });
    }
    this.cameras.main.flash(120,100,180,80,0.3); this.cameras.main.shake(150,0.01);
  }

  _specialRebirth() {
    this.player.hp=this.player.maxHp; this.player.lives=3;
    this.phoenixInvincible=3000;
    this._syncAll();
    this.cameras.main.flash(400,255,150,0,0.8); this.cameras.main.shake(300,0.02);
  }

  _specialTentacleSlam() {
    for (let i=0;i<5;i++) {
      const a=(i/5)*Math.PI*2;
      const tx=this.player.wx+Math.cos(a)*3, ty=this.player.wy+Math.sin(a)*3;
      this.time.delayedCall(i*130,()=>{
        for (const bot of this.bots) { if (!bot.alive) continue; if (Math.hypot(bot.wx-tx,bot.wy-ty)<2.2) this._hitEntity(bot, 160, 0); }
        const ps=iso(tx,ty); const fx=this.add.image(ps.x,ps.y-10,'explosion').setScale(1.3).setDepth(9200).setTint(0x224466);
        this.time.delayedCall(200,()=>fx.destroy()); this.cameras.main.shake(80,0.01);
      });
    }
    this.cameras.main.flash(150,20,60,120,0.4);
  }

  _specialWitchsCurse() {
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      this._hitEntity(bot, 90, 0);
      bot.stunTimer = (bot.stunTimer || 0) + 1500;
      const ps = iso(bot.wx, bot.wy);
      const fx = this.add.image(ps.x, ps.y - 16, 'explosion').setScale(1.1).setDepth(9200).setTint(0x9900cc);
      this.time.delayedCall(200, () => fx.destroy());
    }
    this.cameras.main.flash(250, 150, 0, 220, 0.5);
    this.cameras.main.shake(200, 0.012);
  }

  _specialRealityWarp() {
    for (const bot of this.bots) {
      if (!bot.alive) continue;
      this._hitEntity(bot, 500, 0);
      bot.wx=1+Math.random()*(GRID-2); bot.wy=1+Math.random()*(GRID-2);
    }
    this.cameras.main.flash(700,180,0,255,0.95); this.cameras.main.shake(500,0.04);
  }

  // ── Ground hazards (peel traps etc.) ──────────────────────────────────────
  _updateHazards(dt) {
    for (let i = this.hazards.length - 1; i >= 0; i--) {
      const h = this.hazards[i];
      h.life -= dt;
      h.bob   = (h.bob || 0) + 0.07;
      const s = iso(h.wx, h.wy);
      h.sprite.setPosition(s.x, s.y - 6 + Math.sin(h.bob) * 2).setDepth(isoDepth(h.wx, h.wy) + 5);

      // Check if an enemy bot (non-team-0) steps on it
      for (const bot of this.bots) {
        if (!bot.alive || bot.team === 0) continue;
        if (Math.hypot(bot.wx - h.wx, bot.wy - h.wy) < 0.7) {
          this._hitEntity(bot, h.damage, 0);
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
