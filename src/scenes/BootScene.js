import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() { super('BootScene'); }

  create() {
    this._tiles();
    this._tree();
    this._banana();
    this._raccoonNormal();
    this._raccoonArmored();
    this._raccoonBoss();
    this._peel();
    this._explosion();
    this._pickup();
    this._heart();
    this._muzzleFlash();
    this._hitSpark();
    this._joystick();
    this._botGun();
    this._coin();
    this._weaponModels();
    this._slothPirate();
    this._rockNinja();
    this._trashCan();
    this._shuriken();
    this._cannonball();
    this._hotDog();
    this._cactus();
    this._ghost();
    this._astronaut();
    this._penguin();
    this._viking();
    this._robot();
    this._wizard();
    this._shark();
    this._dragon();
    this._mystery();
    this.scene.start('MenuScene');
  }

  _g() { return this.make.graphics({ x: 0, y: 0, add: false }); }

  // ── Tiles ──────────────────────────────────────────────────────────────────
  _tiles() {
    const PTS = [{ x:32,y:0 },{ x:64,y:16 },{ x:32,y:32 },{ x:0,y:16 }];
    const dia = (g) => g.fillPoints(PTS, true);

    // Lush grass
    let g = this._g();
    g.fillStyle(0x2e7a1e, 1); dia(g);
    g.fillStyle(0x389428, 0.55); dia(g);
    g.fillStyle(0x44aa30, 0.3); g.fillEllipse(24, 12, 20, 9);
    g.fillStyle(0x1e5510, 0.35); g.fillEllipse(46, 20, 16, 7);
    g.lineStyle(1, 0x1e5510, 0.35); g.strokePoints(PTS, true);
    g.lineStyle(1, 0x3a9228, 0.4);
    g.lineBetween(14,16,12,11); g.lineBetween(26,9,24,5);
    g.lineBetween(44,17,46,13); g.lineBetween(54,11,56,7);
    g.lineBetween(34,22,32,18);
    g.generateTexture('tile_grass', 64, 32); g.destroy();

    g = this._g();
    g.fillStyle(0x358a22, 1); dia(g);
    g.fillStyle(0x42a030, 0.5); dia(g);
    g.fillStyle(0x50b83c, 0.28); g.fillEllipse(38, 18, 18, 8);
    g.fillStyle(0x204e12, 0.3); g.fillEllipse(18, 14, 14, 6);
    g.lineStyle(1, 0x204e12, 0.3); g.strokePoints(PTS, true);
    g.lineStyle(1, 0x44a030, 0.35);
    g.lineBetween(20,12,18,8); g.lineBetween(42,16,44,12); g.lineBetween(30,20,28,15);
    g.generateTexture('tile_grass2', 64, 32); g.destroy();

    // Dark asphalt road
    g = this._g();
    g.fillStyle(0x1c1c1c, 1); dia(g);
    g.fillStyle(0x252525, 0.7); dia(g);
    g.fillStyle(0x2c2c2c, 0.3); g.fillEllipse(20, 12, 18, 7); g.fillEllipse(48, 20, 12, 5);
    g.lineStyle(1, 0x2e2e2e, 0.3); g.strokePoints(PTS, true);
    g.fillStyle(0xffee00, 0.65); g.fillRect(29,12,5,5); g.fillRect(29,21,5,5);
    g.generateTexture('tile_road', 64, 32); g.destroy();

    // Concrete sidewalk
    g = this._g();
    g.fillStyle(0x4e4e4e, 1); dia(g);
    g.fillStyle(0x5c5c5c, 0.55); g.fillEllipse(26, 14, 22, 9);
    g.fillStyle(0x3a3a3a, 0.4); g.fillEllipse(46, 20, 16, 7);
    g.lineStyle(1, 0x363636, 0.5); g.lineBetween(14,18,34,12); g.lineBetween(36,18,54,22);
    g.lineStyle(1, 0x383838, 0.35); g.strokePoints(PTS, true);
    g.generateTexture('tile_sidewalk', 64, 32); g.destroy();
  }

  // ── Tree ───────────────────────────────────────────────────────────────────
  _tree() {
    const g = this._g();
    // Ground shadow
    g.fillStyle(0x000000, 0.22); g.fillEllipse(30, 86, 54, 16);
    // Trunk
    g.fillStyle(0x4a2208, 1); g.fillRect(24, 54, 12, 36);
    g.fillStyle(0x6b3a12, 0.9); g.fillRect(25, 54, 5, 36);  // lit side
    g.fillStyle(0x2a1004, 0.7); g.fillRect(31, 54, 4, 36);  // shadow side
    g.lineStyle(1, 0x2a1004, 0.5);
    g.lineBetween(27,60,25,72); g.lineBetween(31,64,33,76); g.lineBetween(26,74,24,84);
    // Canopy deep shadow base
    g.fillStyle(0x082004, 0.55); g.fillEllipse(30, 72, 52, 18);
    // Canopy layers, darkest to lightest
    g.fillStyle(0x0e3206, 1); g.fillCircle(30, 48, 28);
    g.fillStyle(0x164e0a, 1); g.fillCircle(30, 44, 25);
    g.fillStyle(0x1d620e, 1); g.fillCircle(22, 38, 19);
    g.fillStyle(0x247614, 1); g.fillCircle(38, 36, 17);
    g.fillStyle(0x2e8a1c, 1); g.fillCircle(28, 32, 15);
    g.fillStyle(0x38a024, 1); g.fillCircle(36, 29, 13);
    g.fillStyle(0x44b42e, 0.95); g.fillCircle(25, 26, 10);
    g.fillStyle(0x50c038, 0.9); g.fillCircle(34, 23, 9);
    g.fillStyle(0x5ed044, 0.8); g.fillCircle(29, 20, 8);
    // Top highlight clusters
    g.fillStyle(0x6cdc50, 0.7); g.fillCircle(26, 17, 6);
    g.fillStyle(0x7aec5c, 0.6); g.fillCircle(33, 15, 5);
    g.fillStyle(0x88f468, 0.5); g.fillCircle(29, 13, 4);
    // Edge shadow accents
    g.fillStyle(0x061802, 0.45); g.fillCircle(40, 46, 10); g.fillCircle(18, 44, 9);
    g.generateTexture('tree', 60, 92); g.destroy();
  }

  // ── Banana player ──────────────────────────────────────────────────────────
  _banana() {
    const g = this._g();
    const cx = 22, cy = 34;
    // Boots
    g.fillStyle(0x1a1a1a, 1); g.fillRect(cx-12,cy+30,11,10); g.fillRect(cx+1,cy+30,11,10);
    g.fillStyle(0x2e2e2e, 0.7); g.fillRect(cx-11,cy+30,5,7); g.fillRect(cx+2,cy+30,5,7);
    g.fillStyle(0x111111, 1); g.fillRect(cx-14,cy+38,13,4); g.fillRect(cx+1,cy+38,13,4);
    // Tactical pants
    g.fillStyle(0x1e2e3a, 1); g.fillRect(cx-11,cy+14,22,18);
    g.fillStyle(0x253848, 0.6); g.fillRect(cx-10,cy+14,9,14);
    g.fillStyle(0x142030, 0.5); g.fillRect(cx+1,cy+14,9,14);
    g.lineStyle(1, 0x0e1e2a, 0.8); g.lineBetween(cx-1,cy+14,cx-1,cy+32);
    // Body
    g.fillStyle(0xffc800, 1); g.fillEllipse(cx,cy+2,28,30);
    g.fillStyle(0xffe566, 0.75); g.fillEllipse(cx-4,cy-3,15,18);  // lit
    g.fillStyle(0xd4aa00, 0.55); g.fillEllipse(cx+7,cy+8,12,14);  // shadow
    // Tactical vest over body
    g.fillStyle(0x1e2a00, 0.92); g.fillRect(cx-12,cy-6,24,20);
    g.fillStyle(0x2e3e00, 0.7); g.fillRect(cx-10,cy-4,9,16);
    g.fillStyle(0x3a4a00, 0.5); g.fillRect(cx-9,cy-2,5,8); g.fillRect(cx+1,cy+6,4,6);
    g.lineStyle(1, 0x4a5a00, 0.6); g.lineBetween(cx-1,cy-6,cx-1,cy+14); g.lineBetween(cx-12,cy+4,cx+12,cy+4);
    // Arms
    g.fillStyle(0xffc800, 1); g.fillRect(cx-17,cy-5,7,18); g.fillRect(cx+10,cy-5,7,18);
    g.fillStyle(0xffe566, 0.5); g.fillRect(cx-16,cy-5,3,12); g.fillRect(cx+11,cy-5,3,12);
    g.fillStyle(0xd4aa00, 0.4); g.fillRect(cx-11,cy+6,3,8); g.fillRect(cx+12,cy+6,3,8);
    g.fillStyle(0x111111, 1); g.fillCircle(cx-13,cy+14,5); g.fillCircle(cx+13,cy+14,5);
    g.fillStyle(0x333333, 0.6); g.fillCircle(cx-12,cy+13,2.5); g.fillCircle(cx+14,cy+13,2.5);
    // Neck
    g.fillStyle(0xffc800, 1); g.fillRect(cx-4,cy-14,8,10);
    g.fillStyle(0xffe566, 0.4); g.fillRect(cx-3,cy-14,3,8);
    // Head
    g.fillStyle(0xffd700, 1); g.fillCircle(cx,cy-22,15);
    g.fillStyle(0xffe566, 0.85); g.fillCircle(cx-5,cy-27,8);  // lit
    g.fillStyle(0xd4aa00, 0.45); g.fillCircle(cx+6,cy-19,8);  // shadow
    // Eyes
    g.fillStyle(0xffffff, 1); g.fillCircle(cx-5,cy-22,5); g.fillCircle(cx+5,cy-22,5);
    g.fillStyle(0x115522, 1); g.fillCircle(cx-5,cy-22,3.5); g.fillCircle(cx+5,cy-22,3.5);
    g.fillStyle(0x000000, 1); g.fillCircle(cx-4,cy-23,2); g.fillCircle(cx+6,cy-23,2);
    g.fillStyle(0xffffff, 0.9); g.fillCircle(cx-3,cy-24,1.2); g.fillCircle(cx+7,cy-24,1.2);
    // Eyebrows (determined)
    g.fillStyle(0x885500, 1);
    g.fillTriangle(cx-10,cy-29,cx-3,cy-27,cx-10,cy-27);
    g.fillTriangle(cx+10,cy-29,cx+3,cy-27,cx+10,cy-27);
    // Nose & mouth
    g.fillStyle(0xcc8800, 1); g.fillEllipse(cx,cy-17,6,4);
    g.fillStyle(0x221100, 1); g.fillRect(cx-5,cy-13,10,4);
    g.fillStyle(0xffffff, 1); g.fillRect(cx-4,cy-13,4,3); g.fillRect(cx+1,cy-13,4,3);
    g.fillStyle(0xcc2222, 0.6); g.fillRect(cx-3,cy-13,6,2);
    // Tactical helmet
    g.fillStyle(0x1e2a00, 1); g.fillRect(cx-14,cy-36,28,13);
    g.fillStyle(0x2e3e00, 0.7); g.fillRect(cx-13,cy-35,13,8);
    g.fillStyle(0x111800, 0.9); g.fillRect(cx-14,cy-36,28,3);
    g.fillStyle(0x002233, 0.65); g.fillRect(cx-12,cy-33,24,6);
    g.fillStyle(0x003355, 0.45); g.fillRect(cx-10,cy-32,10,4);
    g.fillStyle(0x2a3600, 1); g.fillRect(cx-3,cy-43,6,9);
    g.fillStyle(0x1e5522, 1); g.fillCircle(cx-5,cy-30,2); g.fillCircle(cx,cy-30,2); g.fillCircle(cx+5,cy-30,2);
    g.generateTexture('banana', 44, 60); g.destroy();
  }

  // ── Raccoon base (shared) ──────────────────────────────────────────────────
  _drawRaccoonBase(g, cx, cy, furCol, furDark, furLight) {
    // Body
    g.fillStyle(furCol, 1); g.fillEllipse(cx,cy+34,64,56);
    g.fillStyle(furLight, 0.45); g.fillEllipse(cx-10,cy+22,28,22);  // chest highlight
    g.fillStyle(furDark, 0.55); g.fillEllipse(cx+16,cy+36,20,30);   // body shadow
    // Ear tufts
    g.fillStyle(furDark, 1);
    g.fillTriangle(cx-24,cy-28,cx-18,cy-12,cx-34,cy-12);
    g.fillTriangle(cx+24,cy-28,cx+18,cy-12,cx+34,cy-12);
    g.fillStyle(furLight, 0.6); g.fillCircle(cx-24,cy-22,4); g.fillCircle(cx+24,cy-22,4);
    // Head
    g.fillStyle(furCol, 1); g.fillCircle(cx,cy,32);
    g.fillStyle(furLight, 0.4); g.fillCircle(cx-8,cy-8,16);   // lit
    g.fillStyle(furDark, 0.45); g.fillCircle(cx+12,cy+8,14);  // shadow
    // Dark mask band
    g.fillStyle(0x1a1a1a, 1); g.fillRect(cx-30,cy-16,60,14);
    g.fillStyle(0x111111, 0.5); g.fillRect(cx-28,cy-14,56,6);
    // Glowing eyes
    g.fillStyle(0xffee44, 1); g.fillCircle(cx-12,cy-9,11); g.fillCircle(cx+12,cy-9,11);
    g.fillStyle(0xffaa00, 0.5); g.fillCircle(cx-12,cy-9,9); g.fillCircle(cx+12,cy-9,9);
    g.fillStyle(0xff4400, 1); g.fillCircle(cx-12,cy-9,7); g.fillCircle(cx+12,cy-9,7);
    g.fillStyle(0x111111, 1); g.fillCircle(cx-11,cy-10,3.5); g.fillCircle(cx+13,cy-10,3.5);
    g.fillStyle(0xffffff, 0.9); g.fillCircle(cx-9,cy-12,2); g.fillCircle(cx+15,cy-12,2);
    // Whisker scars
    g.lineStyle(2,0x0a0a0a,1);
    g.beginPath(); g.moveTo(cx-22,cy-22); g.lineTo(cx-5,cy-18); g.strokePath();
    g.beginPath(); g.moveTo(cx+22,cy-22); g.lineTo(cx+5,cy-18); g.strokePath();
    // Muzzle
    g.fillStyle(0xcccccc, 1); g.fillEllipse(cx,cy+8,22,14);
    g.fillStyle(0xaaaaaa, 0.5); g.fillEllipse(cx+4,cy+6,10,8);
    g.fillStyle(0x1a1a1a, 1); g.fillEllipse(cx,cy+6,10,7);
    g.fillStyle(0x222222, 0.5); g.fillEllipse(cx+2,cy+5,5,4);
    // Snarl / teeth
    g.fillStyle(0x111111, 1); g.fillRect(cx-16,cy+12,32,14);
    g.fillStyle(0xfff5e0, 1);
    for (let i = 0; i < 5; i++) {
      g.fillTriangle(cx-14+i*7,cy+12, cx-10+i*7,cy+12, cx-12+i*7+3,cy+22);
    }
    g.fillStyle(0xff2222, 0.55); g.fillRect(cx-14,cy+12,28,4);
    // Legs
    g.fillStyle(furDark, 1);
    g.fillEllipse(cx-34,cy+40,18,32); g.fillEllipse(cx+34,cy+40,18,32);
    // Striped tail
    g.fillStyle(0x888888, 1); g.fillEllipse(cx+56,cy+48,14,36);
    g.fillStyle(0x222222, 1);
    [28,36,44,52].forEach(y => g.fillRect(cx+50,cy+y,12,3));
    g.fillStyle(0xaaaaaa, 0.3); g.fillEllipse(cx+54,cy+44,6,20);
  }

  _raccoonNormal() {
    const g = this._g();
    this._drawRaccoonBase(g, 44, 52, 0x888888, 0x555555, 0xbbbbbb);
    g.generateTexture('raccoon_normal', 88, 120); g.destroy();
  }

  _raccoonArmored() {
    const g = this._g();
    const cx = 44, cy = 52;
    this._drawRaccoonBase(g, cx, cy, 0x686868, 0x484848, 0x909090);
    // Chest plate
    g.fillStyle(0x3a3a50, 1); g.fillEllipse(cx,cy-18,70,44);
    g.fillStyle(0x4a4a66, 0.8); g.fillEllipse(cx-6,cy-24,40,24);
    g.fillStyle(0x222233, 0.7); g.fillEllipse(cx+12,cy-12,22,18);
    g.lineStyle(2,0x5566aa,0.6); g.strokeEllipse(cx,cy-18,70,44);
    // Helmet visor
    g.fillStyle(0x333344, 1); g.fillRect(cx-28,cy-28,56,14);
    g.fillStyle(0x66aaff,0.35); g.fillRect(cx-26,cy-27,52,10);
    g.fillStyle(0x2233aa,0.4); g.lineBetween && undefined;
    // Shoulder pads
    g.fillStyle(0x3a3a50, 1); g.fillRect(cx-46,cy+14,18,20); g.fillRect(cx+28,cy+14,18,20);
    g.fillStyle(0x4a4a66, 0.6); g.fillRect(cx-44,cy+15,8,14); g.fillRect(cx+30,cy+15,8,14);
    // Belly plate
    g.fillStyle(0x404055, 1); g.fillRect(cx-28,cy+16,56,30);
    g.fillStyle(0x505070, 0.7); g.fillRect(cx-26,cy+18,52,14);
    g.lineStyle(1,0x334455,0.8);
    g.lineBetween(cx-28,cy+30,cx+28,cy+30); g.lineBetween(cx,cy+16,cx,cy+46);
    g.generateTexture('raccoon_armored', 88, 120); g.destroy();
  }

  _raccoonBoss() {
    const g = this._g();
    const cx = 52, cy = 60;
    this._drawRaccoonBase(g, cx, cy, 0x7744aa, 0x552288, 0xaa88cc);
    // Crown
    g.fillStyle(0xdda000, 1); g.fillRect(cx-22,cy-46,44,16);
    g.fillStyle(0xffcc00, 0.7); g.fillRect(cx-20,cy-44,20,10);
    [-18,-6,6,18].forEach(x => {
      g.fillStyle(0xddaa00,1); g.fillTriangle(cx+x,cy-62,cx+x+7,cy-46,cx+x-7,cy-46);
      g.fillStyle(0xff2244,1); g.fillCircle(cx+x+3,cy-57,5);
      g.fillStyle(0xff8844,0.7); g.fillCircle(cx+x+3,cy-57,2.5);
    });
    // Dark battle armour
    g.fillStyle(0x1a0a22,1); g.fillRect(cx-34,cy+8,68,34);
    g.fillStyle(0x2a1032,0.8); g.fillRect(cx-32,cy+10,64,16);
    g.lineStyle(2,0x880088,1);
    g.lineBetween(cx,cy+8,cx,cy+42); g.lineBetween(cx-34,cy+25,cx+34,cy+25);
    // Glowing purple energy lines
    g.lineStyle(2,0xcc44ff,0.7);
    g.lineBetween(cx-28,cy+14,cx+28,cy+14); g.lineBetween(cx-28,cy+36,cx+28,cy+36);
    // Extra large fiery eyes
    g.fillStyle(0xffdd00,1); g.fillCircle(cx-12,cy-9,13); g.fillCircle(cx+12,cy-9,13);
    g.fillStyle(0xff6600,1); g.fillCircle(cx-12,cy-9,9);  g.fillCircle(cx+12,cy-9,9);
    g.fillStyle(0xff0000,1); g.fillCircle(cx-12,cy-9,6);  g.fillCircle(cx+12,cy-9,6);
    g.fillStyle(0x111111,1); g.fillCircle(cx-11,cy-10,4); g.fillCircle(cx+13,cy-10,4);
    g.fillStyle(0xffffff,0.9); g.fillCircle(cx-8,cy-13,2); g.fillCircle(cx+16,cy-13,2);
    g.generateTexture('raccoon_boss', 106, 140); g.destroy();
  }

  // ── Projectile peel ────────────────────────────────────────────────────────
  _peel() {
    const g = this._g();
    g.fillStyle(0x7a4f00, 1); g.fillEllipse(14,9,28,14);
    g.fillStyle(0xc49016, 1); g.fillEllipse(13,8,20,9);
    g.fillStyle(0xffe066, 0.5); g.fillEllipse(11,7,10,5);
    g.lineStyle(1,0x5a3800,0.6); g.strokeEllipse(14,9,28,14);
    g.generateTexture('peel', 28, 18); g.destroy();
  }

  // ── Explosion ─────────────────────────────────────────────────────────────
  _explosion() {
    const g = this._g();
    // Outer smoke ring
    g.fillStyle(0x442200,0.4); g.fillEllipse(53,62,100,36);
    // Fire column
    g.fillStyle(0xff3300,1); g.fillRect(40,30,26,44);
    g.fillStyle(0xff6600,0.9); g.fillRect(44,28,18,44);
    g.fillStyle(0xffaa00,0.7); g.fillRect(48,26,10,44);
    // Main fireball layers
    g.fillStyle(0xdd2200,1); g.fillEllipse(53,56,96,42);
    g.fillStyle(0xff4400,1); g.fillEllipse(53,50,80,36);
    g.fillStyle(0xff6600,1); g.fillEllipse(53,44,68,32);
    g.fillStyle(0xff9900,1); g.fillEllipse(53,38,58,28);
    g.fillStyle(0xffcc44,1); g.fillEllipse(53,32,46,24);
    // Hot core
    g.fillStyle(0xffee88,1); g.fillCircle(53,30,18);
    g.fillStyle(0xfff4cc,0.95); g.fillCircle(42,36,14); g.fillCircle(64,35,15); g.fillCircle(53,22,13);
    // Bright flash centre
    g.fillStyle(0xffffff,0.85); g.fillCircle(53,28,7);
    // Ember sparks
    [[20,20],[84,22],[10,40],[94,38],[30,12],[76,14]].forEach(([ex,ey]) => {
      g.fillStyle(0xff8800,0.8); g.fillCircle(ex,ey,3);
      g.fillStyle(0xffcc44,0.6); g.fillCircle(ex,ey,1.5);
    });
    g.generateTexture('explosion', 106, 90); g.destroy();
  }

  // ── Health star pickup ─────────────────────────────────────────────────────
  _pickup() {
    const g = this._g();
    // Glow halo
    g.fillStyle(0xffee00,0.25); g.fillCircle(13,13,13);
    g.fillStyle(0xffd700,0.4); g.fillCircle(13,13,10);
    // Star
    g.fillStyle(0xffd700,1);
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2 / 10) - Math.PI / 2;
      pts.push({ x: 13 + Math.cos(a)*(i%2===0?10:4.5), y: 13 + Math.sin(a)*(i%2===0?10:4.5) });
    }
    g.fillPoints(pts, true);
    g.fillStyle(0xffee88,0.8);
    const pts2 = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2 / 10) - Math.PI / 2;
      pts2.push({ x: 13 + Math.cos(a)*(i%2===0?6:2.5), y: 13 + Math.sin(a)*(i%2===0?6:2.5) });
    }
    g.fillPoints(pts2, true);
    g.lineStyle(1.5,0xcc8800,0.7);
    g.strokePoints(pts, true);
    g.generateTexture('pickup', 26, 26); g.destroy();
  }

  // ── Heart (lives) ──────────────────────────────────────────────────────────
  _heart() {
    const g = this._g();
    g.fillStyle(0xcc0000,1); g.fillCircle(8,8,8); g.fillCircle(18,8,8);
    g.fillTriangle(0,12,26,12,13,27);
    g.fillStyle(0xff4444,0.7); g.fillCircle(6,6,5); g.fillCircle(16,6,5);
    g.fillStyle(0xff8888,0.5); g.fillCircle(5,5,3); g.fillCircle(15,5,3);
    g.generateTexture('heart', 26, 26); g.destroy();
  }

  // ── Muzzle flash ───────────────────────────────────────────────────────────
  _muzzleFlash() {
    const g = this._g();
    // Outer glow ring
    g.fillStyle(0xffaa00,0.3); g.fillCircle(26,26,22);
    g.fillStyle(0xffcc00,0.55); g.fillCircle(26,26,17);
    g.fillStyle(0xffdd44,0.75); g.fillCircle(26,26,13);
    g.fillStyle(0xff9900,0.9); g.fillCircle(26,26,8);
    g.fillStyle(0xffffff,0.95); g.fillCircle(26,26,5);
    // Rays
    [[0,-24],[17,-17],[24,0],[17,17],[0,24],[-17,17],[-24,0],[-17,-17]].forEach(([dx,dy]) => {
      g.fillStyle(0xffcc00,0.75);
      g.fillTriangle(26+dx*0.3,26+dy*0.3, 26+dx,26+dy, 26-dy*0.18,26+dx*0.18);
    });
    g.generateTexture('muzzle_flash', 52, 52); g.destroy();
  }

  // ── Hit spark ─────────────────────────────────────────────────────────────
  _hitSpark() {
    const g = this._g();
    g.fillStyle(0xff8800,0.4); g.fillCircle(11,11,11);
    g.fillStyle(0xff5500,1); g.fillCircle(11,11,7);
    g.fillStyle(0xffcc00,1); g.fillCircle(11,11,4);
    g.fillStyle(0xffffff,0.9); g.fillCircle(11,11,2);
    // Sparks
    [[4,4],[18,4],[4,18],[18,18]].forEach(([sx,sy]) => {
      g.fillStyle(0xff8800,0.7); g.fillCircle(sx,sy,1.5);
    });
    g.generateTexture('hit_spark', 22, 22); g.destroy();
  }

  // ── Joystick ──────────────────────────────────────────────────────────────
  _joystick() {
    let g = this._g();
    g.fillStyle(0xffffff,0.06); g.fillCircle(50,50,50);
    g.lineStyle(2,0xffffff,0.22); g.strokeCircle(50,50,50);
    g.lineStyle(1,0xffffff,0.1); g.strokeCircle(50,50,35);
    g.generateTexture('joy_base', 100, 100); g.destroy();

    g = this._g();
    g.fillStyle(0xffffff,0.18); g.fillCircle(28,28,28);
    g.fillStyle(0xffffff,0.32); g.fillCircle(28,28,22);
    g.fillStyle(0xffffff,0.12); g.fillCircle(22,22,10);
    g.generateTexture('joy_thumb', 56, 56); g.destroy();
  }

  // ── Bot gun ───────────────────────────────────────────────────────────────
  _botGun() {
    const g = this._g();
    g.fillStyle(0x2a2a2a,1); g.fillRect(0,3,24,7);
    g.fillStyle(0x444444,1); g.fillRect(0,3,11,4);  // top highlight
    g.fillStyle(0x555555,1); g.fillRect(15,1,9,4);  // sight
    g.fillStyle(0x1a1a1a,1); g.fillRect(7,10,7,8);  // grip
    g.fillStyle(0x333333,0.6); g.fillRect(8,10,3,6);
    g.generateTexture('bot_gun', 26, 18); g.destroy();
  }

  // ── Coin ──────────────────────────────────────────────────────────────────
  _coin() {
    const g = this._g();
    g.fillStyle(0xcc8800,1); g.fillCircle(11,11,11);
    g.fillStyle(0xffbb00,1); g.fillCircle(11,11,9);
    g.fillStyle(0xffd700,1); g.fillCircle(11,11,7);
    g.fillStyle(0xffe566,0.8); g.fillCircle(9,9,4.5);
    g.fillStyle(0xfff2aa,0.55); g.fillCircle(8,8,2.5);
    g.lineStyle(1.5,0xaa7700,0.8); g.strokeCircle(11,11,10);
    // $ symbol hint
    g.lineStyle(1,0xcc9900,0.5); g.lineBetween(11,6,11,16); g.lineBetween(8,8,14,8); g.lineBetween(8,14,14,14);
    g.generateTexture('coin', 22, 22); g.destroy();
  }

  // ── Weapon models (HUD) ───────────────────────────────────────────────────
  _weaponModels() {
    // Peel Launcher — chunky banana-yellow launcher
    let g = this._g();
    g.fillStyle(0x1a3a88,1); g.fillRect(30,26,180,26);
    g.fillStyle(0x2a50b0,0.8); g.fillRect(30,26,180,12);
    g.fillStyle(0x3366cc,0.5); g.fillRect(30,26,80,8);
    g.fillStyle(0x0a1a44,1); g.fillCircle(210,39,18); g.fillCircle(210,39,12);
    g.fillStyle(0x112288,0.5); g.fillCircle(207,36,6);
    g.fillStyle(0x1a1a2a,1); g.fillRect(72,50,22,28); g.fillRect(70,48,26,6);
    g.fillStyle(0x2244aa,0.5); g.fillRect(72,50,10,20);
    g.fillStyle(0x80b0ff,1); g.fillRect(30,26,2,26); g.fillRect(208,26,2,26);
    g.fillStyle(0x4488ff,1); g.fillRect(30,50,180,3);
    g.generateTexture('gun_peel', 240, 80); g.destroy();

    // Auto Rifle — tan/brown assault rifle
    g = this._g();
    g.fillStyle(0x6b4e14,1); g.fillRect(0,26,56,24);
    g.fillStyle(0xaa7a20,1); g.fillRect(50,22,130,24);
    g.fillStyle(0xc48e28,0.8); g.fillRect(52,22,100,12);
    g.fillStyle(0xd4a030,1); g.fillRect(56,16,118,8);
    g.fillStyle(0x886010,0.6); g.fillRect(160,26,20,24);
    g.fillStyle(0x4a3008,1); g.fillRect(102,46,20,28); g.fillRect(100,44,24,6);
    g.fillStyle(0x664010,0.7); g.fillRect(104,46,8,22);
    g.fillStyle(0x778820,1); g.fillRect(176,26,58,12);
    g.fillStyle(0x558810,0.5); g.fillRect(178,26,28,8);
    g.fillStyle(0xffcc00,0.9); g.fillRect(50,44,130,2.5);
    g.fillStyle(0x886010,0.4); g.fillRect(50,46,130,1);
    g.generateTexture('gun_rifle', 240, 76); g.destroy();

    // Sniper — long dark rifle with scope
    g = this._g();
    g.fillStyle(0x2a1e10,1); g.fillRect(0,26,62,26);
    g.fillStyle(0x1e1e1e,1); g.fillRect(56,22,115,22);
    g.fillStyle(0x282828,0.7); g.fillRect(56,22,60,10);
    g.fillStyle(0x1a1a1a,1); g.fillRect(162,24,120,14);
    g.fillStyle(0x262626,0.5); g.fillRect(164,24,50,8);
    g.fillStyle(0x2e2e2e,1); g.fillRect(272,20,14,22);
    g.fillStyle(0x1a1a1a,1); g.fillRect(100,46,20,22); g.fillRect(98,44,24,6);
    g.fillStyle(0x222222,1); g.fillRect(110,50,22,18);
    // Scope
    g.fillStyle(0x0a0a0a,1); g.fillRect(112,6,85,16);
    g.fillStyle(0x222244,1); g.fillCircle(118,14,8); g.fillCircle(193,14,10);
    g.fillStyle(0x4466cc,0.5); g.fillCircle(118,14,5); g.fillCircle(193,14,6);
    g.fillStyle(0x88aaff,0.3); g.fillCircle(116,12,3); g.fillCircle(191,12,3);
    g.fillStyle(0xaa44ff,1); g.fillRect(56,42,115,2.5);
    g.fillStyle(0x7722cc,0.4); g.fillRect(56,44,115,1);
    g.generateTexture('gun_sniper', 288, 72); g.destroy();
  }

  // ── Sloth Pirate ──────────────────────────────────────────────────────────
  _slothPirate() {
    const g = this._g();
    const cx = 22, cy = 34;
    // Legs
    g.fillStyle(0x6b4a10,1); g.fillRect(cx-9,cy+20,8,16); g.fillRect(cx+1,cy+20,8,16);
    g.fillStyle(0x8b6a2a,0.5); g.fillRect(cx-8,cy+20,3,12); g.fillRect(cx+2,cy+20,3,12);
    g.fillStyle(0x3a2200,1); g.fillRect(cx-11,cy+34,10,6); g.fillRect(cx+1,cy+34,10,6);
    // Body with fur shading
    g.fillStyle(0x7a5214,1); g.fillEllipse(cx,cy+6,30,32);
    g.fillStyle(0x9a7230,0.65); g.fillEllipse(cx-3,cy+2,18,22);
    g.fillStyle(0x4a3208,0.5); g.fillEllipse(cx+8,cy+12,12,16);
    // Pirate coat
    g.fillStyle(0x660000,0.85); g.fillRect(cx-12,cy-2,24,20);
    g.fillStyle(0x880000,0.5); g.fillRect(cx-10,cy-1,10,16);
    g.fillStyle(0xfff5cc,1); g.fillRect(cx-2,cy-2,4,18);  // white shirt front
    g.lineStyle(1,0x440000,0.7); g.lineBetween(cx-1,cy-2,cx-1,cy+18);
    // Arms with long claws
    g.fillStyle(0x7a5214,1); g.fillRect(cx-18,cy-2,7,22); g.fillRect(cx+11,cy-2,7,22);
    g.fillStyle(0x9a7230,0.4); g.fillRect(cx-17,cy-2,3,14); g.fillRect(cx+12,cy-2,3,14);
    g.fillStyle(0x2a1200,1);
    for (let i=0;i<3;i++) { g.fillRect(cx-18+i*2,cy+19,2,8); g.fillRect(cx+11+i*2,cy+19,2,8); }
    // Head
    g.fillStyle(0x7a5214,1); g.fillCircle(cx,cy-10,16);
    g.fillStyle(0x9a7230,0.7); g.fillEllipse(cx-3,cy-7,20,16);
    g.fillStyle(0x4a3208,0.4); g.fillCircle(cx+7,cy-8,8);
    // Pirate hat
    g.fillStyle(0x0a0a0a,1); g.fillRect(cx-17,cy-24,34,8); g.fillTriangle(cx-13,cy-24,cx+13,cy-24,cx,cy-42);
    g.fillStyle(0x1a1a1a,0.6); g.fillRect(cx-14,cy-23,14,6);
    g.fillStyle(0xddaa00,1); g.fillRect(cx-17,cy-27,34,5);
    g.fillStyle(0xffcc22,0.6); g.fillRect(cx-15,cy-26,16,3);
    // Skull & crossbones
    g.fillStyle(0xeeeeee,1); g.fillCircle(cx,cy-33,4.5);
    g.fillStyle(0x0a0a0a,1); g.fillCircle(cx-1,cy-34,1.2); g.fillCircle(cx+2,cy-34,1.2);
    g.lineStyle(1.5,0xeeeeee,1);
    g.lineBetween(cx-5,cy-29,cx+5,cy-29); g.lineBetween(cx-3,cy-27,cx+3,cy-31);
    // Eye patch
    g.fillStyle(0x111111,1); g.fillCircle(cx+6,cy-12,6.5);
    g.fillStyle(0x2a2a2a,0.5); g.fillCircle(cx+5,cy-13,3);
    g.lineStyle(2,0x222222,1); g.lineBetween(cx+6,cy-18,cx+15,cy-23);
    g.lineStyle(1,0x333333,0.7); g.lineBetween(cx+0,cy-12,cx+12,cy-12);
    // Left eye (sleepy)
    g.fillStyle(0x1a0e00,1); g.fillCircle(cx-6,cy-12,5);
    g.fillStyle(0x3a2810,0.6); g.fillRect(cx-11,cy-17,10,6);
    g.fillStyle(0xffffff,0.65); g.fillCircle(cx-4,cy-14,1.5);
    // Nose & smile
    g.fillStyle(0x4a2a00,1); g.fillEllipse(cx,cy-4,7,5);
    g.fillStyle(0x6a4a10,0.5); g.fillEllipse(cx-1,cy-5,4,3);
    g.lineStyle(2,0x2a1400,1);
    g.beginPath(); g.arc(cx,cy+1,6,0.2,Math.PI-0.2); g.strokePath();
    g.generateTexture('sloth_pirate', 44, 60); g.destroy();
  }

  // ── Rock Ninja ────────────────────────────────────────────────────────────
  _rockNinja() {
    const g = this._g();
    const cx = 22, cy = 34;
    // Legs (dark cloth)
    g.fillStyle(0x1a1a1a,1); g.fillRect(cx-9,cy+20,9,17); g.fillRect(cx,cy+20,9,17);
    g.fillStyle(0x2a2a2a,0.5); g.fillRect(cx-8,cy+20,4,12); g.fillRect(cx+1,cy+20,4,12);
    g.fillStyle(0x111111,1); g.fillRect(cx-11,cy+35,11,6); g.fillRect(cx,cy+35,11,6);
    // Body — rocky irregular
    g.fillStyle(0x4a4a4a,1); g.fillEllipse(cx,cy+8,30,34);
    g.fillStyle(0x646464,0.8); g.fillEllipse(cx-4,cy+2,18,22);
    g.fillStyle(0x303030,0.6); g.fillEllipse(cx+7,cy+14,14,16);
    // Rock texture cracks
    g.lineStyle(1.5,0x282828,0.9); g.lineBetween(cx+2,cy-2,cx+11,cy+12);
    g.lineStyle(1,0x282828,0.7); g.lineBetween(cx-8,cy+6,cx-2,cy+20);
    g.lineStyle(1,0x606060,0.4); g.lineBetween(cx+4,cy+4,cx+12,cy+14);
    // Arms (cloth wrapping)
    g.fillStyle(0x1a1a1a,1); g.fillRect(cx-18,cy-2,7,20); g.fillRect(cx+11,cy-2,7,20);
    g.fillStyle(0x2a2a2a,0.5); g.fillRect(cx-17,cy-2,3,14); g.fillRect(cx+12,cy-2,3,14);
    g.fillStyle(0x111111,1);
    for (let i=0;i<3;i++) { g.fillRect(cx-18+i*2,cy+17,2,7); g.fillRect(cx+11+i*2,cy+17,2,7); }
    // Head (rocky)
    g.fillStyle(0x4a4a4a,1); g.fillCircle(cx,cy-10,16);
    g.fillStyle(0x5e5e5e,0.7); g.fillCircle(cx-4,cy-14,9);
    g.fillStyle(0x303030,0.5); g.fillCircle(cx+6,cy-8,8);
    // Ninja mask (dark cloth)
    g.fillStyle(0x101010,1); g.fillRect(cx-16,cy-10,32,15);
    g.lineStyle(1,0x222222,0.6); g.lineBetween(cx-16,cy-4,cx+16,cy-4);
    g.lineStyle(1,0x1a1a1a,0.4); g.lineBetween(cx-16,cy+1,cx+16,cy+1);
    // White headband with red circle
    g.fillStyle(0xeeeeee,1); g.fillRect(cx-16,cy-23,32,8);
    g.fillStyle(0xffffff,0.5); g.fillRect(cx-14,cy-22,14,5);
    g.fillStyle(0xcc1111,1); g.fillCircle(cx,cy-19,5.5);
    g.fillStyle(0xff3333,0.5); g.fillCircle(cx-1,cy-20,3);
    // Fierce eyes
    g.fillStyle(0xffffff,1); g.fillRect(cx-13,cy-14,10,7); g.fillRect(cx+3,cy-14,10,7);
    g.fillStyle(0xee0000,1); g.fillRect(cx-11,cy-13,6,5); g.fillRect(cx+5,cy-13,6,5);
    g.fillStyle(0x000000,1); g.fillRect(cx-10,cy-12,4,3); g.fillRect(cx+6,cy-12,4,3);
    g.fillStyle(0xffffff,0.8); g.fillCircle(cx-9,cy-13,1); g.fillCircle(cx+7,cy-13,1);
    // Angry brow slant
    g.fillStyle(0xdd1111,1); g.fillTriangle(cx-13,cy-16,cx-4,cy-15,cx-13,cy-14);
    g.fillTriangle(cx+13,cy-16,cx+4,cy-15,cx+13,cy-14);
    // Shuriken on chest
    g.fillStyle(0x999999,1); g.fillRect(cx-1,cy+5,3,13); g.fillRect(cx-6,cy+10,13,3);
    g.fillStyle(0x666666,1); g.fillRect(cx,cy+6,1,11); g.fillRect(cx-5,cy+11,11,1);
    g.fillStyle(0xbbbbbb,1); g.fillCircle(cx+1,cy+12,3);
    g.fillStyle(0xdddddd,0.7); g.fillCircle(cx,cy+11,1.5);
    g.generateTexture('rock_ninja', 44, 60); g.destroy();
  }

  // ── Trash Can ─────────────────────────────────────────────────────────────
  _trashCan() {
    const g = this._g();
    const cx = 22, cy = 34;
    // Legs (stubby metal feet)
    g.fillStyle(0x5a5a5a,1); g.fillRect(cx-9,cy+22,8,15); g.fillRect(cx+1,cy+22,8,15);
    g.fillStyle(0x7a7a7a,0.5); g.fillRect(cx-8,cy+22,3,10); g.fillRect(cx+2,cy+22,3,10);
    g.fillStyle(0x3a3a3a,1); g.fillRect(cx-11,cy+35,10,6); g.fillRect(cx+1,cy+35,10,6);
    // Cylinder body
    g.fillStyle(0x6a6a6a,1); g.fillRect(cx-14,cy-10,28,36);
    // Metallic sheen (lit left, shadow right)
    g.fillStyle(0x909090,0.65); g.fillRect(cx-14,cy-10,9,36);
    g.fillStyle(0x4a4a4a,0.55); g.fillRect(cx+7,cy-10,7,36);
    g.fillStyle(0xaaaaaa,0.2); g.fillRect(cx-13,cy-10,3,36);
    // Horizontal ribs
    g.lineStyle(2,0x444444,0.8);
    g.lineBetween(cx-14,cy-2,cx+14,cy-2);
    g.lineBetween(cx-14,cy+9,cx+14,cy+9);
    g.lineBetween(cx-14,cy+20,cx+14,cy+20);
    // Dents and scratches
    g.lineStyle(2,0x383838,0.9); g.lineBetween(cx+4,cy+3,cx+11,cy+9);
    g.lineStyle(1.5,0x383838,0.7); g.lineBetween(cx-8,cy+14,cx-4,cy+22);
    g.lineStyle(1,0x808080,0.4); g.lineBetween(cx-10,cy+5,cx-6,cy+12);
    // Stub arms
    g.fillStyle(0x6a6a6a,1); g.fillRect(cx-18,cy-4,6,18); g.fillRect(cx+12,cy-4,6,18);
    g.fillStyle(0x888888,0.5); g.fillRect(cx-17,cy-4,2,12); g.fillRect(cx+13,cy-4,2,12);
    g.fillStyle(0x4a4a4a,1); g.fillCircle(cx-15,cy+15,6); g.fillCircle(cx+15,cy+15,6);
    g.fillStyle(0x6e6e6e,0.6); g.fillCircle(cx-14,cy+13,3); g.fillCircle(cx+14,cy+13,3);
    // Lid (darker, slightly wider)
    g.fillStyle(0x484848,1); g.fillRect(cx-16,cy-12,32,8);
    g.fillStyle(0x5e5e5e,0.6); g.fillRect(cx-15,cy-12,14,6);
    g.fillStyle(0x333333,1); g.fillRect(cx-16,cy-12,32,3);
    // Handle
    g.fillStyle(0x383838,1); g.fillRect(cx-5,cy-19,10,9);
    g.fillStyle(0x5e5e5e,0.7); g.fillRect(cx-4,cy-18,5,7);
    g.fillStyle(0x3a3a3a,1); g.fillRect(cx-4,cy-19,8,3);
    // Face — glowing angry eyes
    g.fillStyle(0x111111,1); g.fillRect(cx-12,cy-9,24,11);
    g.fillStyle(0xffaa00,0.35); g.fillCircle(cx-6,cy-3,7); g.fillCircle(cx+6,cy-3,7);
    g.fillStyle(0xffaa00,1); g.fillCircle(cx-6,cy-3,5.5); g.fillCircle(cx+6,cy-3,5.5);
    g.fillStyle(0xff6600,1); g.fillCircle(cx-6,cy-3,3.5); g.fillCircle(cx+6,cy-3,3.5);
    g.fillStyle(0x111111,1); g.fillCircle(cx-5,cy-4,2); g.fillCircle(cx+7,cy-4,2);
    g.fillStyle(0xffffff,0.85); g.fillCircle(cx-4,cy-5,1); g.fillCircle(cx+8,cy-5,1);
    // Angry brow ridges (dented metal)
    g.fillStyle(0x3a3a3a,1); g.fillRect(cx-10,cy-11,8,3); g.fillRect(cx+2,cy-11,8,3);
    g.fillStyle(0x555555,0.5); g.fillRect(cx-9,cy-11,4,2); g.fillRect(cx+3,cy-11,4,2);
    // Trash sticking out top
    g.fillStyle(0x8b6914,0.95); g.fillRect(cx-5,cy-21,4,10);
    g.fillStyle(0xa07e1e,0.6); g.fillRect(cx-4,cy-20,2,7);
    g.fillStyle(0x1e7a1e,0.95); g.fillRect(cx+2,cy-23,3,12);
    g.fillStyle(0xcc4422,0.9); g.fillEllipse(cx-10,cy-18,7,9);
    g.fillStyle(0xff6644,0.5); g.fillEllipse(cx-11,cy-19,4,5);
    g.generateTexture('trash_can', 44, 60); g.destroy();
  }

  // ── Shuriken (Rock Ninja special) ──────────────────────────────────────────
  _shuriken() {
    const g = this._g();
    // Cross blades
    g.fillStyle(0x999999, 1); g.fillRect(5, 0, 6, 16); g.fillRect(0, 5, 16, 6);
    // Diagonal blade points
    g.fillStyle(0x888888, 0.9);
    g.fillRect(2, 2, 4, 4); g.fillRect(10, 2, 4, 4);
    g.fillRect(2, 10, 4, 4); g.fillRect(10, 10, 4, 4);
    // Dark center
    g.fillStyle(0x444444, 1); g.fillCircle(8, 8, 3);
    // Shine
    g.fillStyle(0xdddddd, 0.7); g.fillRect(6, 1, 2, 2); g.fillRect(1, 7, 2, 2);
    g.generateTexture('shuriken', 16, 16); g.destroy();
  }

  // ── Cannonball (Sloth Pirate special) ──────────────────────────────────────
  _cannonball() {
    const g = this._g();
    // Base sphere
    g.fillStyle(0x1a1a1a, 1); g.fillCircle(11, 11, 11);
    g.fillStyle(0x333333, 0.85); g.fillCircle(11, 11, 9);
    g.fillStyle(0x555555, 0.6); g.fillCircle(9, 9, 6);
    g.fillStyle(0x888888, 0.6); g.fillCircle(7, 7, 3);
    g.fillStyle(0xcccccc, 0.5); g.fillCircle(6, 6, 1.5);
    g.generateTexture('cannonball', 22, 22); g.destroy();
  }

  _hotDog() {
    const g = this._g(), cx = 22;
    // Bun body
    g.fillStyle(0xd49a55,1); g.fillEllipse(cx,32,40,52);
    g.fillStyle(0xeabb77,0.5); g.fillEllipse(cx-4,22,24,20);
    // Sausage
    g.fillStyle(0xcc4422,1); g.fillEllipse(cx,32,34,12);
    g.fillStyle(0xaa2211,0.4); g.fillEllipse(cx-5,30,16,7);
    // Mustard
    g.fillStyle(0xffcc00,0.9); g.fillEllipse(cx,30,26,5);
    // Eyes
    g.fillStyle(0x000000,1); g.fillCircle(cx-7,16,2.5); g.fillCircle(cx+7,16,2.5);
    g.fillStyle(0xffffff,0.6); g.fillCircle(cx-6,15,1); g.fillCircle(cx+8,15,1);
    // Smile
    g.lineStyle(2,0x884422,0.9); g.beginPath(); g.arc(cx,21,5,0.1,Math.PI-0.1,false); g.strokePath();
    // Arms
    g.fillStyle(0xcc8844,1); g.fillEllipse(cx-22,28,10,8); g.fillEllipse(cx+22,28,10,8);
    // Legs
    g.fillStyle(0xd49a55,1); g.fillEllipse(cx-7,54,9,12); g.fillEllipse(cx+7,54,9,12);
    g.fillStyle(0x884422,1); g.fillEllipse(cx-7,59,12,5); g.fillEllipse(cx+7,59,12,5);
    g.generateTexture('hot_dog',44,60); g.destroy();
  }

  _cactus() {
    const g = this._g(), cx = 22;
    // Hat
    g.fillStyle(0x7a4a1a,1); g.fillRect(cx-17,3,34,6);
    g.fillStyle(0x8b5a2b,1); g.fillRect(cx-11,0,22,10);
    g.fillStyle(0xaa7733,0.35); g.fillRect(cx-9,1,9,8);
    // Body
    g.fillStyle(0x228822,1); g.fillRect(cx-10,13,20,36);
    g.fillStyle(0x44cc44,0.35); g.fillRect(cx-8,15,8,28);
    // Arms
    g.fillStyle(0x228822,1);
    g.fillRect(cx-22,23,13,7); g.fillRect(cx-22,17,7,13);
    g.fillRect(cx+9,23,13,7);  g.fillRect(cx+16,17,7,13);
    // Spikes
    g.fillStyle(0x115511,1);
    for (const [x,y] of [[cx-11,20],[cx+11,20],[cx-11,32],[cx+11,32],[cx-21,21],[cx+21,21]]) {
      g.fillTriangle(x-3,y, x+3,y, x,y-5);
    }
    // Face
    g.fillStyle(0x000000,1); g.fillCircle(cx-5,22,2); g.fillCircle(cx+5,22,2);
    g.fillStyle(0xffffff,0.5); g.fillCircle(cx-4,21,0.9); g.fillCircle(cx+6,21,0.9);
    g.fillStyle(0x44cc44,0.6); g.fillEllipse(cx,27,10,4);
    // Feet
    g.fillStyle(0x228822,1); g.fillRect(cx-8,49,7,12); g.fillRect(cx+1,49,7,12);
    g.fillStyle(0x115511,1); g.fillEllipse(cx-4,59,11,5); g.fillEllipse(cx+4,59,11,5);
    g.generateTexture('cactus',44,60); g.destroy();
  }

  _ghost() {
    const g = this._g(), cx = 22;
    // Glow aura
    g.fillStyle(0x8888ff,0.15); g.fillEllipse(cx,26,42,50);
    // Body
    g.fillStyle(0xe8e8ff,1); g.fillEllipse(cx,20,34,36);
    g.fillStyle(0xffffff,0.6); g.fillEllipse(cx-5,14,18,16);
    // Wavy bottom (3 bumps)
    g.fillStyle(0xe8e8ff,1);
    g.fillRect(cx-17,32,34,14);
    g.fillStyle(0x0d1f08,1); // erase bumps with bg colour
    g.fillEllipse(cx-11,47,13,10); g.fillEllipse(cx,47,13,10); g.fillEllipse(cx+11,47,13,10);
    // Eyes
    g.fillStyle(0x2222aa,1); g.fillEllipse(cx-7,19,10,12); g.fillEllipse(cx+7,19,10,12);
    g.fillStyle(0x000000,1); g.fillEllipse(cx-7,20,6,8);   g.fillEllipse(cx+7,20,6,8);
    g.fillStyle(0xffffff,0.8); g.fillCircle(cx-5,18,2);    g.fillCircle(cx+9,18,2);
    // Mouth
    g.fillStyle(0x4444aa,0.6); g.fillEllipse(cx,28,10,5);
    g.generateTexture('ghost',44,60); g.destroy();
  }

  _astronaut() {
    const g = this._g(), cx = 22;
    // Suit body
    g.fillStyle(0xdddddd,1); g.fillRect(cx-12,24,24,28);
    g.fillStyle(0xbbbbbb,0.4); g.fillRect(cx-10,26,10,22);
    // Helmet
    g.fillStyle(0xcccccc,1); g.fillCircle(cx,17,16);
    g.fillStyle(0xbbccff,0.55); g.fillEllipse(cx+2,16,20,20); // visor
    g.fillStyle(0x334466,0.7); g.fillEllipse(cx+2,16,16,16);
    g.fillStyle(0x8899cc,0.5); g.fillEllipse(cx-1,13,8,7);    // visor glint
    g.fillStyle(0xdddddd,1); g.strokeCircle && g.lineStyle(3,0xaaaaaa,1); g.strokeCircle(cx,17,16);
    // Arms
    g.fillStyle(0xdddddd,1); g.fillRect(cx-20,26,9,18); g.fillRect(cx+11,26,9,18);
    g.fillStyle(0xbbbbbb,0.3); g.fillRect(cx-19,27,5,14); g.fillRect(cx+12,27,5,14);
    // Gloves
    g.fillStyle(0x888888,1); g.fillEllipse(cx-16,45,10,7); g.fillEllipse(cx+16,45,10,7);
    // Legs
    g.fillStyle(0xcccccc,1); g.fillRect(cx-10,52,9,9); g.fillRect(cx+1,52,9,9);
    g.fillStyle(0x888888,1); g.fillEllipse(cx-5,59,12,6); g.fillEllipse(cx+5,59,12,6);
    // Emblem
    g.fillStyle(0xff4444,1); g.fillRect(cx-4,30,8,5);
    g.fillStyle(0xffffff,1); g.fillRect(cx-4,35,8,3);
    g.fillStyle(0x4444ff,1); g.fillRect(cx-4,38,8,4);
    g.generateTexture('astronaut',44,60); g.destroy();
  }

  _penguin() {
    const g = this._g(), cx = 22;
    // Body
    g.fillStyle(0x111122,1); g.fillEllipse(cx,32,34,46);
    g.fillStyle(0x222244,0.4); g.fillEllipse(cx-6,24,14,20);
    // White belly
    g.fillStyle(0xeeeeff,1); g.fillEllipse(cx,34,20,32);
    g.fillStyle(0xffffff,0.5); g.fillEllipse(cx-2,28,12,18);
    // Head
    g.fillStyle(0x111122,1); g.fillCircle(cx,13,13);
    g.fillStyle(0x222244,0.35); g.fillEllipse(cx-4,9,10,10);
    // Eyes
    g.fillStyle(0xffffff,1); g.fillCircle(cx-5,11,4); g.fillCircle(cx+5,11,4);
    g.fillStyle(0x000000,1); g.fillCircle(cx-4,11,2.5); g.fillCircle(cx+6,11,2.5);
    g.fillStyle(0xffffff,0.9); g.fillCircle(cx-3,10,1); g.fillCircle(cx+7,10,1);
    // Beak
    g.fillStyle(0xff8800,1); g.fillTriangle(cx-3,16,cx+3,16,cx,20);
    // Flippers
    g.fillStyle(0x111122,1); g.fillEllipse(cx-19,34,10,22); g.fillEllipse(cx+19,34,10,22);
    // Feet
    g.fillStyle(0xff8800,1); g.fillEllipse(cx-6,57,14,6); g.fillEllipse(cx+6,57,14,6);
    g.generateTexture('penguin',44,60); g.destroy();
  }

  _viking() {
    const g = this._g(), cx = 22;
    // Armour body
    g.fillStyle(0x7a5533,1); g.fillRect(cx-12,24,24,28);
    g.fillStyle(0x996644,0.5); g.fillRect(cx-10,26,10,22);
    g.fillStyle(0x554422,0.6);
    for (let y=28;y<50;y+=6) g.fillRect(cx-12,y,24,2); // armour lines
    // Shoulder pads
    g.fillStyle(0x888888,1); g.fillEllipse(cx-14,25,14,8); g.fillEllipse(cx+14,25,14,8);
    g.fillStyle(0xaaaaaa,0.4); g.fillEllipse(cx-14,24,10,5); g.fillEllipse(cx+14,24,10,5);
    // Head / skin
    g.fillStyle(0xd4956a,1); g.fillEllipse(cx,16,26,26);
    g.fillStyle(0xe8b07a,0.4); g.fillEllipse(cx-4,12,14,14);
    // Helmet
    g.fillStyle(0x777777,1); g.fillEllipse(cx,12,28,16);
    g.fillStyle(0x999999,0.4); g.fillEllipse(cx-5,9,14,10);
    g.fillStyle(0x555555,1); g.fillRect(cx-14,14,28,5); // brim
    // Horns
    g.fillStyle(0xcccccc,1);
    g.fillTriangle(cx-14,14, cx-22,2, cx-8,10);
    g.fillTriangle(cx+14,14, cx+22,2, cx+8,10);
    g.fillStyle(0xaaaaaa,0.4); g.fillTriangle(cx-14,14,cx-20,5,cx-11,11);
    // Eyes
    g.fillStyle(0x1a1a1a,1); g.fillCircle(cx-5,17,2.5); g.fillCircle(cx+5,17,2.5);
    g.fillStyle(0xffffff,0.6); g.fillCircle(cx-4,16,1); g.fillCircle(cx+6,16,1);
    // Beard
    g.fillStyle(0xffcc55,1); g.fillEllipse(cx,25,20,14);
    g.fillStyle(0xffdd77,0.5); g.fillEllipse(cx-3,24,12,10);
    g.fillStyle(0xffaa33,0.4); g.fillRect(cx-7,24,14,8);
    // Legs
    g.fillStyle(0x665533,1); g.fillRect(cx-9,52,8,9); g.fillRect(cx+1,52,8,9);
    g.fillStyle(0x443322,1); g.fillEllipse(cx-5,59,11,5); g.fillEllipse(cx+5,59,11,5);
    g.generateTexture('viking',44,60); g.destroy();
  }

  _robot() {
    const g = this._g(), cx = 22;
    // Body (torso)
    g.fillStyle(0x778899,1); g.fillRect(cx-13,22,26,28);
    g.fillStyle(0x99aabb,0.4); g.fillRect(cx-11,24,12,22);
    // Panel lines
    g.lineStyle(1,0x445566,0.8);
    g.lineBetween(cx-13,30,cx+13,30);
    g.lineBetween(cx-13,38,cx+13,38);
    // Chest light
    g.fillStyle(0x00ffcc,0.9); g.fillRect(cx-5,32,10,5);
    g.fillStyle(0xaaffee,0.5); g.fillRect(cx-4,33,5,3);
    // Head (square)
    g.fillStyle(0x889aaa,1); g.fillRect(cx-13,4,26,20);
    g.fillStyle(0xaabbcc,0.35); g.fillRect(cx-11,6,12,14);
    // Antenna
    g.fillStyle(0x556677,1); g.fillRect(cx-1,0,3,6);
    g.fillStyle(0xff3333,0.9); g.fillCircle(cx,0,3);
    // Eye strip
    g.fillStyle(0x000011,1); g.fillRect(cx-10,11,20,7);
    g.fillStyle(0xff4400,1); g.fillRect(cx-9,12,18,5); // LED strip
    g.fillStyle(0xff8800,0.6); g.fillRect(cx-8,13,8,3);
    g.fillStyle(0xffcc00,0.5); g.fillRect(cx+2,13,6,3);
    // Ear bolts
    g.fillStyle(0x556677,1); g.fillCircle(cx-13,14,3); g.fillCircle(cx+13,14,3);
    g.fillStyle(0x778899,0.5); g.fillCircle(cx-13,14,1.5); g.fillCircle(cx+13,14,1.5);
    // Arms
    g.fillStyle(0x667788,1); g.fillRect(cx-21,23,9,20); g.fillRect(cx+12,23,9,20);
    g.fillStyle(0x889aaa,0.3); g.fillRect(cx-20,24,5,16); g.fillRect(cx+13,24,5,16);
    // Hands
    g.fillStyle(0x556677,1); g.fillRect(cx-21,43,9,7); g.fillRect(cx+12,43,9,7);
    // Legs
    g.fillStyle(0x667788,1); g.fillRect(cx-10,50,9,11); g.fillRect(cx+1,50,9,11);
    g.fillStyle(0x445566,1); g.fillRect(cx-11,58,11,5); g.fillRect(cx,58,11,5);
    g.generateTexture('robot',44,60); g.destroy();
  }

  _wizard() {
    const g = this._g(), cx = 22;
    // Robe
    g.fillStyle(0x4422aa,1);
    g.fillTriangle(cx-14,58, cx+14,58, cx+10,22); // right side
    g.fillTriangle(cx-14,58, cx-10,22, cx+10,22); // body
    g.fillStyle(0x6644cc,0.45); g.fillTriangle(cx-8,56,cx-5,24,cx+4,24);
    // Stars on robe
    g.fillStyle(0xffee44,0.85);
    for (const [sx,sy] of [[cx-5,32],[cx+5,44],[cx-3,50],[cx+6,36]]) {
      g.fillCircle(sx,sy,2.5);
      g.fillTriangle(sx,sy-5, sx-2,sy+2, sx+2,sy+2);
    }
    // Belt
    g.fillStyle(0xaa8833,1); g.fillRect(cx-12,38,24,5);
    g.fillStyle(0xffcc44,0.8); g.fillRect(cx-3,39,6,4);
    // Skin
    g.fillStyle(0xf0d090,1); g.fillEllipse(cx,18,22,24);
    g.fillStyle(0xfde0a8,0.4); g.fillEllipse(cx-3,14,12,14);
    // White beard
    g.fillStyle(0xffffff,1); g.fillEllipse(cx,28,18,16);
    g.fillStyle(0xeeeeee,0.5); g.fillEllipse(cx-2,26,10,10);
    // Eyes
    g.fillStyle(0x2222aa,1); g.fillCircle(cx-5,15,2.5); g.fillCircle(cx+5,15,2.5);
    g.fillStyle(0xffffff,0.7); g.fillCircle(cx-4,14,1); g.fillCircle(cx+6,14,1);
    // Hat
    g.fillStyle(0x331188,1);
    g.fillTriangle(cx,0, cx-12,22, cx+12,22);
    g.fillStyle(0x4422aa,0.5); g.fillTriangle(cx-1,2,cx-8,20,cx+3,20);
    g.fillStyle(0x330099,1); g.fillRect(cx-14,20,28,6);
    // Hat star
    g.fillStyle(0xffee44,1); g.fillCircle(cx,7,3);
    g.generateTexture('wizard',44,60); g.destroy();
  }

  _shark() {
    const g = this._g(), cx = 22;
    // Body
    g.fillStyle(0x4477aa,1); g.fillEllipse(cx,32,28,46);
    g.fillStyle(0x6699cc,0.4); g.fillEllipse(cx-4,22,14,22);
    // White belly
    g.fillStyle(0xeeeeff,1); g.fillEllipse(cx+2,34,16,36);
    g.fillStyle(0xffffff,0.5); g.fillEllipse(cx+1,28,10,22);
    // Dorsal fin
    g.fillStyle(0x336699,1); g.fillTriangle(cx-3,6, cx+5,6, cx+1,24);
    g.fillStyle(0x4488bb,0.4); g.fillTriangle(cx-2,8,cx+4,8,cx+1,22);
    // Side fins
    g.fillStyle(0x336699,1); g.fillTriangle(cx-14,34,cx-8,28,cx-8,42);
    g.fillStyle(0x336699,1); g.fillTriangle(cx+14,34,cx+8,28,cx+8,42);
    // Head / snout
    g.fillStyle(0x4477aa,1); g.fillEllipse(cx,14,26,22);
    g.fillStyle(0x6699cc,0.3); g.fillEllipse(cx-4,10,14,14);
    // Eyes
    g.fillStyle(0x000000,1); g.fillCircle(cx-7,12,3.5); g.fillCircle(cx+7,12,3.5);
    g.fillStyle(0xffffff,1); g.fillCircle(cx-6,11,2); g.fillCircle(cx+8,11,2);
    g.fillStyle(0x000000,1); g.fillCircle(cx-6,11,1.2); g.fillCircle(cx+8,11,1.2);
    // Teeth
    g.fillStyle(0xffffff,1);
    for (let t=-3;t<=3;t+=2) g.fillTriangle(cx+t-1,21, cx+t+1,21, cx+t,26);
    // Tail
    g.fillStyle(0x336699,1); g.fillTriangle(cx-8,55,cx+8,55,cx-6,58); g.fillTriangle(cx-8,55,cx+8,55,cx+6,58);
    g.generateTexture('shark',44,60); g.destroy();
  }

  _dragon() {
    const g = this._g(), cx = 22;
    // Wings (behind body)
    g.fillStyle(0xcc2200,0.7); g.fillTriangle(cx-6,18, cx-22,4, cx-16,28);
    g.fillStyle(0xcc2200,0.7); g.fillTriangle(cx+6,18, cx+22,4, cx+16,28);
    g.fillStyle(0xff4422,0.3); g.fillTriangle(cx-7,20,cx-20,8,cx-15,26);
    g.fillStyle(0xff4422,0.3); g.fillTriangle(cx+7,20,cx+20,8,cx+15,26);
    // Body
    g.fillStyle(0xcc2200,1); g.fillEllipse(cx,34,28,42);
    g.fillStyle(0xff4422,0.45); g.fillEllipse(cx-4,26,14,22);
    // Belly scales
    g.fillStyle(0xff8844,0.8); g.fillEllipse(cx+2,34,16,30);
    g.fillStyle(0xffaa66,0.4); g.fillEllipse(cx+1,28,10,18);
    // Scale lines
    g.lineStyle(1,0xaa1100,0.5);
    for (let sy=22;sy<48;sy+=6) g.strokeEllipse(cx,sy,20,5);
    // Head
    g.fillStyle(0xcc2200,1); g.fillEllipse(cx,14,26,22);
    g.fillStyle(0xff4422,0.4); g.fillEllipse(cx-4,10,14,14);
    // Horns
    g.fillStyle(0x884400,1); g.fillTriangle(cx-7,5,cx-4,5,cx-5,0); g.fillTriangle(cx+7,5,cx+4,5,cx+5,0);
    // Eyes
    g.fillStyle(0xffcc00,1); g.fillCircle(cx-6,13,3.5); g.fillCircle(cx+6,13,3.5);
    g.fillStyle(0x000000,1); g.fillEllipse(cx-6,13,2,4); g.fillEllipse(cx+6,13,2,4);
    g.fillStyle(0xffee88,0.5); g.fillCircle(cx-5,12,1); g.fillCircle(cx+7,12,1);
    // Nostrils
    g.fillStyle(0x880000,1); g.fillCircle(cx-4,18,1.5); g.fillCircle(cx+4,18,1.5);
    // Fire breath
    g.fillStyle(0xffcc00,0.85); g.fillEllipse(cx,23,12,6);
    g.fillStyle(0xff6600,0.7); g.fillEllipse(cx,25,8,5);
    g.fillStyle(0xff4400,0.5); g.fillTriangle(cx-3,28,cx+3,28,cx,36);
    // Legs
    g.fillStyle(0xcc2200,1); g.fillRect(cx-10,52,8,9); g.fillRect(cx+2,52,8,9);
    g.fillStyle(0x884400,1); g.fillEllipse(cx-6,59,13,5); g.fillEllipse(cx+6,59,13,5);
    g.generateTexture('dragon',44,60); g.destroy();
  }

  _mystery() {
    const g = this._g(), cx = 22;
    // Dark aura
    g.fillStyle(0x220033,0.6); g.fillEllipse(cx,30,44,58);
    g.fillStyle(0x440055,0.4); g.fillEllipse(cx,28,36,50);
    // Body void
    g.fillStyle(0x080010,1); g.fillEllipse(cx,32,30,44);
    g.fillStyle(0x150025,0.7); g.fillEllipse(cx-4,24,16,22);
    // Head
    g.fillStyle(0x080010,1); g.fillCircle(cx,14,14);
    g.fillStyle(0x150025,0.5); g.fillEllipse(cx-3,11,12,12);
    // Glowing eyes
    g.fillStyle(0xee00ff,1); g.fillEllipse(cx-6,13,9,7); g.fillEllipse(cx+6,13,9,7);
    g.fillStyle(0xff44ff,0.8); g.fillEllipse(cx-6,13,7,5); g.fillEllipse(cx+6,13,7,5);
    g.fillStyle(0xffffff,0.9); g.fillEllipse(cx-6,13,4,3); g.fillEllipse(cx+6,13,4,3);
    // Eye glow halos
    g.fillStyle(0xcc00ee,0.2); g.fillCircle(cx-6,13,8); g.fillCircle(cx+6,13,8);
    // Question marks floating
    g.fillStyle(0xcc44ff,0.6);
    g.fillCircle(cx-12,8,3); g.fillCircle(cx+12,8,3); g.fillCircle(cx,4,2.5);
    g.fillStyle(0x880099,0.5);
    g.fillRect(cx-13,4,3,3); g.fillRect(cx+11,4,3,3);
    // Dark cloak edges
    g.fillStyle(0x0d0018,1);
    g.fillTriangle(cx-15,42,cx-9,58,cx-3,42);
    g.fillTriangle(cx+15,42,cx+9,58,cx+3,42);
    g.generateTexture('mystery',44,60); g.destroy();
  }
}
