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
    this._tnt();
    this._taco();
    this._snowman();
    this._mushroom();
    this._pineapple();
    this._stormCloud();
    this._mummy();
    this._samurai();
    this._werewolf();
    this._knight();
    this._alien();
    this._zombie();
    this._phoenix();
    this._kraken();
    this._witch();
    this._glitch();
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

    // Bush tile — dark green for hiding spots
    const PTS_B = [{ x:32,y:0 },{ x:64,y:16 },{ x:32,y:32 },{ x:0,y:16 }];
    g = this._g();
    g.fillStyle(0x1a5c0e, 1); g.fillPoints(PTS_B, true);
    g.fillStyle(0x227010, 0.7); g.fillPoints(PTS_B, true);
    g.fillStyle(0x2a8818, 0.4); g.fillEllipse(22, 12, 18, 8); g.fillEllipse(42, 20, 14, 6);
    g.fillStyle(0x0e3a08, 0.5); g.fillEllipse(32, 16, 10, 5);
    g.lineStyle(1, 0x0e3a08, 0.5); g.strokePoints(PTS_B, true);
    g.generateTexture('tile_bush', 64, 32); g.destroy();

    // Water tile — blue for corners
    g = this._g();
    g.fillStyle(0x1a4a8c, 1); g.fillPoints(PTS_B, true);
    g.fillStyle(0x2060aa, 0.7); g.fillPoints(PTS_B, true);
    g.fillStyle(0x3070cc, 0.35); g.fillEllipse(20, 12, 22, 8); g.fillEllipse(46, 18, 14, 6);
    g.lineStyle(1, 0x0a2a5a, 0.6); g.strokePoints(PTS_B, true);
    g.lineStyle(1, 0x4488dd, 0.3);
    g.lineBetween(10,14,20,10); g.lineBetween(30,8,40,12); g.lineBetween(44,18,52,14);
    g.generateTexture('tile_water', 64, 32); g.destroy();

    // Stone wall block — isometric gray cube (48×56 sprite)
    g = this._g();
    // Top face
    g.fillStyle(0x9e9e9e, 1); g.fillPoints([{x:24,y:0},{x:48,y:12},{x:24,y:24},{x:0,y:12}], true);
    g.fillStyle(0xbbbbbb, 0.4); g.fillEllipse(24,10,20,8);
    // Left face
    g.fillStyle(0x707070, 1); g.fillPoints([{x:0,y:12},{x:24,y:24},{x:24,y:56},{x:0,y:44}], true);
    g.fillStyle(0x505050, 0.3); g.fillRect(3,22,8,20);
    // Right face
    g.fillStyle(0x888888, 1); g.fillPoints([{x:24,y:24},{x:48,y:12},{x:48,y:44},{x:24,y:56}], true);
    g.fillStyle(0x666666, 0.3); g.fillRect(30,22,8,20);
    // Cracks/detail
    g.lineStyle(1, 0x505050, 0.6); g.lineBetween(4,28,14,24); g.lineBetween(4,36,12,32);
    g.lineStyle(1, 0x606060, 0.6); g.lineBetween(30,26,40,22); g.lineBetween(32,38,42,34);
    g.lineStyle(1, 0x606060, 0.4); g.lineBetween(6,14,20,8); g.lineBetween(28,6,40,12);
    g.generateTexture('wall_block', 48, 56); g.destroy();
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

  // ── Taco ──────────────────────────────────────────────────────────────────
  _taco() {
    const g = this._g(), cx = 22;
    // Shell
    g.fillStyle(0xddaa44, 1); g.fillEllipse(cx, 38, 40, 28);
    g.fillStyle(0xeebb66, 0.6); g.fillEllipse(cx - 4, 34, 20, 14);
    // Shell fold / taco shape
    g.fillStyle(0xcc9933, 1); g.fillRect(cx - 18, 30, 36, 8);
    g.fillStyle(0xddaa44, 0.7); g.fillRect(cx - 16, 30, 14, 6);
    // Filling - lettuce
    g.fillStyle(0x44bb44, 1); g.fillEllipse(cx, 28, 34, 10);
    g.fillStyle(0x66dd66, 0.5); g.fillEllipse(cx - 4, 26, 16, 7);
    // Filling - tomato
    g.fillStyle(0xee3322, 1); g.fillCircle(cx - 6, 27, 4); g.fillCircle(cx + 6, 27, 4);
    g.fillStyle(0xff5544, 0.5); g.fillCircle(cx - 5, 26, 2); g.fillCircle(cx + 7, 26, 2);
    // Salsa drips
    g.fillStyle(0xff3300, 0.8); g.fillEllipse(cx, 24, 28, 8);
    g.fillStyle(0xff5533, 0.5); g.fillEllipse(cx - 3, 23, 14, 5);
    // Face on shell
    g.fillStyle(0x000000, 1); g.fillCircle(cx - 5, 36, 2); g.fillCircle(cx + 5, 36, 2);
    g.fillStyle(0xffffff, 0.6); g.fillCircle(cx - 4, 35, 1); g.fillCircle(cx + 6, 35, 1);
    g.lineStyle(2, 0x8b4513, 0.8);
    g.beginPath(); g.arc(cx, 39, 5, 0.1, Math.PI - 0.1, false); g.strokePath();
    // Body/arms
    g.fillStyle(0xddaa44, 1); g.fillEllipse(cx - 16, 30, 8, 6); g.fillEllipse(cx + 16, 30, 8, 6);
    // Legs
    g.fillStyle(0xcc9933, 1); g.fillEllipse(cx - 6, 52, 9, 12); g.fillEllipse(cx + 6, 52, 9, 12);
    g.fillStyle(0x8b4513, 1); g.fillEllipse(cx - 6, 57, 12, 5); g.fillEllipse(cx + 6, 57, 12, 5);
    g.generateTexture('taco', 44, 60); g.destroy();
  }

  // ── Snowman ────────────────────────────────────────────────────────────────
  _snowman() {
    const g = this._g(), cx = 22;
    // Bottom ball
    g.fillStyle(0xe8f0ff, 1); g.fillCircle(cx, 44, 16);
    g.fillStyle(0xffffff, 0.6); g.fillCircle(cx - 4, 40, 9);
    g.fillStyle(0xbbccee, 0.4); g.fillCircle(cx + 5, 48, 8);
    // Middle ball
    g.fillStyle(0xeef4ff, 1); g.fillCircle(cx, 26, 12);
    g.fillStyle(0xffffff, 0.5); g.fillCircle(cx - 3, 22, 7);
    // Scarf
    g.fillStyle(0xcc2222, 1); g.fillRect(cx - 12, 32, 24, 6);
    g.fillStyle(0xff4444, 0.5); g.fillRect(cx - 10, 33, 10, 3);
    // Head
    g.fillStyle(0xeef4ff, 1); g.fillCircle(cx, 13, 11);
    g.fillStyle(0xffffff, 0.5); g.fillCircle(cx - 3, 10, 6);
    // Hat
    g.fillStyle(0x1a1a1a, 1); g.fillRect(cx - 12, 1, 24, 5); g.fillRect(cx - 8, -6, 16, 9);
    g.fillStyle(0x333333, 0.4); g.fillRect(cx - 6, -5, 8, 7);
    // Eyes
    g.fillStyle(0x222244, 1); g.fillCircle(cx - 4, 11, 2); g.fillCircle(cx + 4, 11, 2);
    g.fillStyle(0xffffff, 0.6); g.fillCircle(cx - 3, 10, 0.8); g.fillCircle(cx + 5, 10, 0.8);
    // Carrot nose
    g.fillStyle(0xff8800, 1); g.fillTriangle(cx - 1, 14, cx + 1, 14, cx + 5, 16);
    // Mouth (dots)
    g.fillStyle(0x333355, 1);
    for (let i = -2; i <= 2; i++) g.fillCircle(cx + i * 2.5, 18, 1.2);
    // Arms
    g.fillStyle(0x7a4a1a, 1); g.fillRect(cx - 22, 22, 10, 3); g.fillRect(cx + 12, 22, 10, 3);
    // Buttons on body
    g.fillStyle(0x333355, 1);
    g.fillCircle(cx, 20, 2); g.fillCircle(cx, 26, 2); g.fillCircle(cx, 32, 2);
    g.generateTexture('snowman', 44, 60); g.destroy();
  }

  // ── Mushroom ───────────────────────────────────────────────────────────────
  _mushroom() {
    const g = this._g(), cx = 22;
    // Cap
    g.fillStyle(0xcc3311, 1); g.fillEllipse(cx, 20, 40, 30);
    g.fillStyle(0xee4422, 0.6); g.fillEllipse(cx - 5, 14, 20, 16);
    // White spots
    g.fillStyle(0xffffff, 1);
    g.fillCircle(cx - 8, 14, 5); g.fillCircle(cx + 8, 14, 4); g.fillCircle(cx, 10, 3.5);
    g.fillStyle(0xeeeeee, 0.5);
    g.fillCircle(cx - 7, 13, 2.5); g.fillCircle(cx + 9, 15, 2); g.fillCircle(cx + 1, 9, 2);
    // Stem
    g.fillStyle(0xeeddcc, 1); g.fillRect(cx - 9, 30, 18, 22);
    g.fillStyle(0xffffff, 0.4); g.fillRect(cx - 7, 31, 7, 18);
    g.fillStyle(0xbbaa99, 0.4); g.fillRect(cx + 3, 31, 5, 18);
    // Gills (cap underside)
    g.fillStyle(0xffccaa, 0.7); g.fillEllipse(cx, 32, 38, 10);
    g.fillStyle(0xeebb99, 0.5); g.fillEllipse(cx - 3, 31, 18, 6);
    // Face
    g.fillStyle(0x000000, 1); g.fillCircle(cx - 4, 36, 2.5); g.fillCircle(cx + 4, 36, 2.5);
    g.fillStyle(0xffffff, 0.7); g.fillCircle(cx - 3, 35, 1); g.fillCircle(cx + 5, 35, 1);
    g.lineStyle(2, 0x774422, 0.9);
    g.beginPath(); g.arc(cx, 40, 5, 0.1, Math.PI - 0.1, false); g.strokePath();
    // Arms
    g.fillStyle(0xeeddcc, 1); g.fillEllipse(cx - 18, 34, 10, 8); g.fillEllipse(cx + 18, 34, 10, 8);
    // Feet
    g.fillStyle(0xddccbb, 1); g.fillEllipse(cx - 5, 54, 10, 13); g.fillEllipse(cx + 5, 54, 10, 13);
    g.fillStyle(0x774422, 1); g.fillEllipse(cx - 5, 59, 13, 5); g.fillEllipse(cx + 5, 59, 13, 5);
    g.generateTexture('mushroom', 44, 60); g.destroy();
  }

  // ── Pineapple ──────────────────────────────────────────────────────────────
  _pineapple() {
    const g = this._g(), cx = 22;
    // Body
    g.fillStyle(0xddaa22, 1); g.fillEllipse(cx, 35, 30, 42);
    g.fillStyle(0xeebb44, 0.5); g.fillEllipse(cx - 4, 28, 16, 22);
    g.fillStyle(0xbb8811, 0.4); g.fillEllipse(cx + 5, 38, 12, 18);
    // Diamond scale pattern
    g.lineStyle(1, 0xaa7700, 0.7);
    for (let y = 18; y < 54; y += 7) {
      for (let x = cx - 12; x < cx + 14; x += 7) {
        const ox = (Math.floor((y - 18) / 7) % 2) * 3.5;
        g.strokeRect(x + ox - 3, y - 3, 6, 6);
      }
    }
    // Crown leaves
    g.fillStyle(0x228822, 1);
    g.fillTriangle(cx, 0, cx - 8, 14, cx + 2, 16);
    g.fillTriangle(cx - 5, 2, cx - 14, 14, cx - 2, 16);
    g.fillTriangle(cx + 5, 2, cx + 14, 14, cx + 4, 16);
    g.fillStyle(0x44aa44, 0.5);
    g.fillTriangle(cx, 1, cx - 5, 13, cx + 3, 13);
    // Face
    g.fillStyle(0x000000, 1); g.fillCircle(cx - 5, 32, 2.5); g.fillCircle(cx + 5, 32, 2.5);
    g.fillStyle(0xffffff, 0.7); g.fillCircle(cx - 4, 31, 1); g.fillCircle(cx + 6, 31, 1);
    g.fillStyle(0xff9900, 1); g.fillEllipse(cx, 37, 8, 5);
    g.lineStyle(2, 0x885500, 0.9);
    g.beginPath(); g.arc(cx, 41, 5, 0.1, Math.PI - 0.1, false); g.strokePath();
    // Arms
    g.fillStyle(0xddaa22, 1); g.fillEllipse(cx - 19, 36, 10, 7); g.fillEllipse(cx + 19, 36, 10, 7);
    // Feet
    g.fillStyle(0xccaa22, 1); g.fillEllipse(cx - 5, 54, 9, 11); g.fillEllipse(cx + 5, 54, 9, 11);
    g.fillStyle(0xaa7700, 1); g.fillEllipse(cx - 5, 59, 13, 5); g.fillEllipse(cx + 5, 59, 13, 5);
    g.generateTexture('pineapple', 44, 60); g.destroy();
  }

  // ── Storm Cloud ────────────────────────────────────────────────────────────
  _stormCloud() {
    const g = this._g(), cx = 22;
    // Cloud puffs
    g.fillStyle(0x667788, 1); g.fillCircle(cx, 22, 16);
    g.fillStyle(0x778899, 1); g.fillCircle(cx - 10, 26, 12); g.fillCircle(cx + 10, 26, 12);
    g.fillStyle(0x889aaa, 0.7); g.fillCircle(cx - 5, 18, 10); g.fillCircle(cx + 5, 18, 10);
    g.fillStyle(0x99aabb, 0.5); g.fillCircle(cx, 15, 8);
    // Dark underside
    g.fillStyle(0x334455, 0.8); g.fillEllipse(cx, 34, 38, 14);
    g.fillStyle(0x445566, 0.5); g.fillEllipse(cx - 5, 33, 18, 9);
    // Lightning bolts
    g.fillStyle(0xffee00, 1);
    g.fillTriangle(cx - 6, 34, cx - 2, 34, cx - 8, 46);
    g.fillTriangle(cx - 8, 46, cx - 4, 46, cx - 10, 58);
    g.fillStyle(0xffffaa, 0.7);
    g.fillTriangle(cx - 5, 34, cx - 2, 34, cx - 7, 46);
    // Second bolt
    g.fillStyle(0xffee00, 1);
    g.fillTriangle(cx + 4, 34, cx + 8, 34, cx + 2, 46);
    g.fillTriangle(cx + 2, 46, cx + 6, 46, cx, 56);
    // Eyes (glowing electric)
    g.fillStyle(0xffee00, 0.3); g.fillCircle(cx - 5, 22, 7); g.fillCircle(cx + 5, 22, 7);
    g.fillStyle(0xffee00, 1); g.fillCircle(cx - 5, 22, 4); g.fillCircle(cx + 5, 22, 4);
    g.fillStyle(0xffffff, 0.9); g.fillCircle(cx - 4, 21, 2); g.fillCircle(cx + 6, 21, 2);
    // Mouth
    g.fillStyle(0x334455, 1); g.fillEllipse(cx, 28, 12, 5);
    g.fillStyle(0xaaddff, 0.5); g.fillEllipse(cx, 27, 8, 3);
    g.generateTexture('storm_cloud', 44, 60); g.destroy();
  }

  // ── Mummy ──────────────────────────────────────────────────────────────────
  _mummy() {
    const g = this._g(), cx = 22;
    // Body bandages
    g.fillStyle(0xeeddcc, 1); g.fillEllipse(cx, 34, 28, 36);
    // Bandage wrapping lines
    g.lineStyle(3, 0xddccbb, 1);
    for (let y = 20; y < 52; y += 6) {
      g.lineBetween(cx - 13, y, cx + 13, y + 2);
    }
    g.lineStyle(2, 0xccbbaa, 0.7);
    g.lineBetween(cx - 12, 23, cx + 12, 25);
    g.lineBetween(cx - 12, 35, cx + 12, 37);
    g.lineBetween(cx - 12, 47, cx + 12, 49);
    // Head
    g.fillStyle(0xeeddcc, 1); g.fillCircle(cx, 14, 13);
    g.fillStyle(0xddccbb, 0.8); g.fillCircle(cx - 3, 10, 7);
    // Head bandages
    g.lineStyle(3, 0xddccbb, 1);
    for (let y = 6; y < 24; y += 5) g.lineBetween(cx - 12, y, cx + 12, y + 1);
    // Eyes (glowing through bandages)
    g.fillStyle(0x00cc00, 0.3); g.fillCircle(cx - 5, 12, 6); g.fillCircle(cx + 5, 12, 6);
    g.fillStyle(0x00ff00, 1); g.fillCircle(cx - 5, 12, 3.5); g.fillCircle(cx + 5, 12, 3.5);
    g.fillStyle(0x88ff88, 0.7); g.fillCircle(cx - 4, 11, 1.5); g.fillCircle(cx + 6, 11, 1.5);
    // Arms (wrapped)
    g.fillStyle(0xeeddcc, 1); g.fillRect(cx - 20, 22, 8, 20); g.fillRect(cx + 12, 22, 8, 20);
    g.lineStyle(2, 0xddccbb, 0.8);
    for (let y = 24; y < 42; y += 5) {
      g.lineBetween(cx - 20, y, cx - 12, y + 1);
      g.lineBetween(cx + 12, y, cx + 20, y + 1);
    }
    // Loose bandage end
    g.fillStyle(0xeeddcc, 0.9); g.fillRect(cx + 12, 40, 10, 3);
    // Legs
    g.fillStyle(0xeeddcc, 1); g.fillRect(cx - 10, 50, 9, 11); g.fillRect(cx + 1, 50, 9, 11);
    g.lineStyle(2, 0xddccbb, 0.8);
    g.lineBetween(cx - 10, 53, cx - 1, 54); g.lineBetween(cx + 1, 53, cx + 10, 54);
    g.fillStyle(0xccbbaa, 1); g.fillEllipse(cx - 5, 59, 12, 5); g.fillEllipse(cx + 5, 59, 12, 5);
    g.generateTexture('mummy', 44, 60); g.destroy();
  }

  // ── Samurai ────────────────────────────────────────────────────────────────
  _samurai() {
    const g = this._g(), cx = 22;
    // Hakama (wide pants)
    g.fillStyle(0x1a2244, 1); g.fillRect(cx - 13, 30, 26, 24);
    g.fillStyle(0x2233aa, 0.3); g.fillRect(cx - 11, 32, 11, 18);
    g.lineStyle(1, 0x112233, 0.7); g.lineBetween(cx, 30, cx, 54);
    // Armour plates
    g.fillStyle(0x882211, 1); g.fillRect(cx - 13, 18, 26, 14);
    g.fillStyle(0xaa3322, 0.5); g.fillRect(cx - 11, 20, 11, 10);
    // Horizontal armour slat lines
    g.lineStyle(2, 0x661100, 0.8);
    g.lineBetween(cx - 13, 22, cx + 13, 22); g.lineBetween(cx - 13, 26, cx + 13, 26);
    // Shoulder guards
    g.fillStyle(0x882211, 1); g.fillEllipse(cx - 16, 20, 12, 8); g.fillEllipse(cx + 16, 20, 12, 8);
    g.fillStyle(0xaa3322, 0.4); g.fillEllipse(cx - 16, 19, 8, 5); g.fillEllipse(cx + 16, 19, 8, 5);
    // Head (skin)
    g.fillStyle(0xf0c880, 1); g.fillEllipse(cx, 12, 20, 22);
    g.fillStyle(0xf8d898, 0.5); g.fillEllipse(cx - 3, 8, 10, 12);
    // Kabuto helmet
    g.fillStyle(0x882211, 1); g.fillEllipse(cx, 5, 26, 16);
    g.fillStyle(0xaa3322, 0.5); g.fillEllipse(cx - 4, 2, 14, 10);
    g.fillStyle(0x882211, 1); g.fillRect(cx - 13, 7, 26, 6); // brim
    g.fillStyle(0x660000, 1); g.fillRect(cx - 11, 12, 22, 3); // cheek guard
    // Crest
    g.fillStyle(0xddaa00, 1); g.fillTriangle(cx - 2, -4, cx + 2, -4, cx, 5);
    // Eyes
    g.fillStyle(0x000000, 1); g.fillCircle(cx - 4, 12, 2); g.fillCircle(cx + 4, 12, 2);
    g.fillStyle(0xffffff, 0.6); g.fillCircle(cx - 3, 11, 1); g.fillCircle(cx + 5, 11, 1);
    // Arms (gauntlets)
    g.fillStyle(0x882211, 1); g.fillRect(cx - 21, 20, 9, 18); g.fillRect(cx + 12, 20, 9, 18);
    g.lineStyle(2, 0x661100, 0.8);
    g.lineBetween(cx - 21, 24, cx - 12, 24); g.lineBetween(cx - 21, 30, cx - 12, 30);
    g.lineBetween(cx + 12, 24, cx + 21, 24); g.lineBetween(cx + 12, 30, cx + 21, 30);
    // Feet/boots
    g.fillStyle(0x1a2244, 1); g.fillRect(cx - 10, 53, 9, 8); g.fillRect(cx + 1, 53, 9, 8);
    g.fillStyle(0x000011, 1); g.fillEllipse(cx - 5, 59, 12, 5); g.fillEllipse(cx + 5, 59, 12, 5);
    g.generateTexture('samurai', 44, 60); g.destroy();
  }

  // ── Werewolf ───────────────────────────────────────────────────────────────
  _werewolf() {
    const g = this._g(), cx = 22;
    // Legs (furry)
    g.fillStyle(0x5a3a1a, 1); g.fillRect(cx - 10, 34, 9, 20); g.fillRect(cx + 1, 34, 9, 20);
    g.fillStyle(0x7a5a2a, 0.5); g.fillRect(cx - 9, 35, 4, 14); g.fillRect(cx + 2, 35, 4, 14);
    g.fillStyle(0x2a1a00, 1); g.fillEllipse(cx - 5, 56, 13, 6); g.fillEllipse(cx + 5, 56, 13, 6);
    // Claws on feet
    g.fillStyle(0x1a1a00, 1);
    for (let i = -1; i <= 1; i++) { g.fillTriangle(cx - 5 + i * 4, 55, cx - 4 + i * 4, 55, cx - 4.5 + i * 4, 59); }
    // Body
    g.fillStyle(0x5a3a1a, 1); g.fillEllipse(cx, 22, 28, 30);
    g.fillStyle(0x7a5a2a, 0.55); g.fillEllipse(cx - 4, 16, 16, 18);
    g.fillStyle(0x3a2008, 0.5); g.fillEllipse(cx + 6, 26, 12, 14);
    // Torn shirt (rags)
    g.fillStyle(0x3a2244, 0.7); g.fillRect(cx - 11, 12, 22, 20);
    g.fillStyle(0x2a1133, 0.5); g.fillRect(cx - 9, 14, 9, 14);
    // Ragged tears
    g.fillStyle(0x5a3a1a, 0.9);
    g.fillTriangle(cx - 11, 30, cx - 5, 30, cx - 8, 36);
    g.fillTriangle(cx + 5, 30, cx + 11, 30, cx + 8, 36);
    // Arms (muscular, clawed)
    g.fillStyle(0x5a3a1a, 1); g.fillRect(cx - 19, 12, 9, 22); g.fillRect(cx + 10, 12, 9, 22);
    g.fillStyle(0x7a5a2a, 0.4); g.fillRect(cx - 18, 13, 4, 16); g.fillRect(cx + 11, 13, 4, 16);
    // Claws on hands
    g.fillStyle(0x1a1a00, 1);
    for (let i = 0; i < 3; i++) {
      g.fillTriangle(cx - 19 + i * 3, 33, cx - 17 + i * 3, 33, cx - 18 + i * 3, 38);
      g.fillTriangle(cx + 10 + i * 3, 33, cx + 12 + i * 3, 33, cx + 11 + i * 3, 38);
    }
    // Head
    g.fillStyle(0x5a3a1a, 1); g.fillCircle(cx, 8, 14);
    g.fillStyle(0x7a5a2a, 0.6); g.fillCircle(cx - 4, 4, 8);
    // Muzzle
    g.fillStyle(0x4a2a0a, 1); g.fillEllipse(cx, 12, 14, 10);
    g.fillStyle(0x1a0a00, 1); g.fillEllipse(cx, 10, 9, 6);
    // Fangs
    g.fillStyle(0xffffff, 1); g.fillTriangle(cx - 4, 14, cx - 2, 14, cx - 3, 18); g.fillTriangle(cx + 2, 14, cx + 4, 14, cx + 3, 18);
    // Eyes (yellow)
    g.fillStyle(0xffee00, 0.3); g.fillCircle(cx - 5, 6, 6); g.fillCircle(cx + 5, 6, 6);
    g.fillStyle(0xffdd00, 1); g.fillCircle(cx - 5, 6, 4); g.fillCircle(cx + 5, 6, 4);
    g.fillStyle(0x000000, 1); g.fillEllipse(cx - 5, 6, 2, 5); g.fillEllipse(cx + 5, 6, 2, 5);
    g.fillStyle(0xffffff, 0.7); g.fillCircle(cx - 4, 5, 1.2); g.fillCircle(cx + 6, 5, 1.2);
    // Ears
    g.fillStyle(0x4a2a0a, 1); g.fillTriangle(cx - 8, -2, cx - 14, -2, cx - 11, 6); g.fillTriangle(cx + 8, -2, cx + 14, -2, cx + 11, 6);
    g.fillStyle(0x7a4a2a, 0.6); g.fillTriangle(cx - 9, -1, cx - 13, -1, cx - 11, 5); g.fillTriangle(cx + 9, -1, cx + 13, -1, cx + 11, 5);
    g.generateTexture('werewolf', 44, 60); g.destroy();
  }

  // ── Knight ─────────────────────────────────────────────────────────────────
  _knight() {
    const g = this._g(), cx = 22;
    // Greaves (leg armour)
    g.fillStyle(0x778899, 1); g.fillRect(cx - 10, 36, 9, 18); g.fillRect(cx + 1, 36, 9, 18);
    g.fillStyle(0x99aabb, 0.45); g.fillRect(cx - 9, 37, 4, 12); g.fillRect(cx + 2, 37, 4, 12);
    g.lineStyle(2, 0x556677, 0.8);
    g.lineBetween(cx - 10, 42, cx - 1, 42); g.lineBetween(cx + 1, 42, cx + 10, 42);
    g.lineBetween(cx - 10, 48, cx - 1, 48); g.lineBetween(cx + 1, 48, cx + 10, 48);
    g.fillStyle(0x445566, 1); g.fillEllipse(cx - 5, 57, 12, 5); g.fillEllipse(cx + 5, 57, 12, 5);
    // Chest plate
    g.fillStyle(0x778899, 1); g.fillRect(cx - 13, 18, 26, 20);
    g.fillStyle(0x99aabb, 0.5); g.fillRect(cx - 11, 20, 11, 14);
    g.fillStyle(0x556677, 0.5); g.fillRect(cx + 2, 20, 9, 14);
    g.lineStyle(2, 0x556677, 0.9);
    g.lineBetween(cx, 18, cx, 38); g.lineBetween(cx - 13, 28, cx + 13, 28);
    // Heraldic cross on chest
    g.fillStyle(0xddaa00, 0.9); g.fillRect(cx - 2, 19, 4, 18); g.fillRect(cx - 10, 26, 20, 4);
    // Pauldrons
    g.fillStyle(0x667788, 1); g.fillEllipse(cx - 16, 20, 14, 10); g.fillEllipse(cx + 16, 20, 14, 10);
    g.fillStyle(0x889aaa, 0.4); g.fillEllipse(cx - 16, 18, 9, 6); g.fillEllipse(cx + 16, 18, 9, 6);
    // Gauntlets
    g.fillStyle(0x667788, 1); g.fillRect(cx - 21, 20, 9, 20); g.fillRect(cx + 12, 20, 9, 20);
    g.lineStyle(2, 0x556677, 0.8);
    g.lineBetween(cx - 21, 26, cx - 12, 26); g.lineBetween(cx - 21, 32, cx - 12, 32);
    g.lineBetween(cx + 12, 26, cx + 21, 26); g.lineBetween(cx + 12, 32, cx + 21, 32);
    // Helmet (great helm)
    g.fillStyle(0x778899, 1); g.fillRect(cx - 13, 3, 26, 18);
    g.fillStyle(0x99aabb, 0.4); g.fillRect(cx - 11, 5, 11, 12);
    g.fillStyle(0x556677, 1); g.fillRect(cx - 13, 3, 26, 3); // brim
    // Visor slit
    g.fillStyle(0x000000, 1); g.fillRect(cx - 10, 10, 20, 4);
    g.fillStyle(0x00aaff, 0.2); g.fillRect(cx - 9, 11, 18, 2); // eye glow through visor
    // Plume
    g.fillStyle(0xff4444, 1); g.fillRect(cx - 2, -4, 4, 9);
    g.fillStyle(0xff6666, 0.6); g.fillRect(cx - 1, -3, 2, 7);
    g.generateTexture('knight', 44, 60); g.destroy();
  }

  // ── Alien ──────────────────────────────────────────────────────────────────
  _alien() {
    const g = this._g(), cx = 22;
    // Spacesuit body
    g.fillStyle(0x228844, 1); g.fillEllipse(cx, 34, 28, 36);
    g.fillStyle(0x44aa66, 0.5); g.fillEllipse(cx - 4, 26, 16, 20);
    g.fillStyle(0x115522, 0.5); g.fillEllipse(cx + 5, 38, 12, 16);
    // Belt/trim
    g.fillStyle(0x66cc88, 0.7); g.fillRect(cx - 13, 38, 26, 5);
    g.fillStyle(0x88eebb, 0.4); g.fillRect(cx - 11, 39, 11, 3);
    // Suit details
    g.fillStyle(0x004422, 0.8); g.fillRect(cx - 6, 26, 12, 12);
    g.fillStyle(0x00ff88, 0.6); g.fillRect(cx - 4, 28, 8, 8);
    g.fillStyle(0xaaffdd, 0.5); g.fillRect(cx - 3, 29, 4, 5);
    // Arms
    g.fillStyle(0x228844, 1); g.fillRect(cx - 20, 22, 8, 20); g.fillRect(cx + 12, 22, 8, 20);
    g.fillStyle(0x44aa66, 0.3); g.fillRect(cx - 19, 23, 4, 14); g.fillRect(cx + 13, 23, 4, 14);
    // 3-fingered hands
    g.fillStyle(0x33aa55, 1);
    for (let i = 0; i < 3; i++) {
      g.fillEllipse(cx - 20 + i * 3, 42, 5, 8);
      g.fillEllipse(cx + 12 + i * 3, 42, 5, 8);
    }
    // Head (classic big alien cranium)
    g.fillStyle(0x228844, 1); g.fillEllipse(cx, 12, 30, 28);
    g.fillStyle(0x44aa66, 0.4); g.fillEllipse(cx - 5, 7, 16, 16);
    // Giant almond eyes
    g.fillStyle(0x000000, 1); g.fillEllipse(cx - 7, 12, 14, 9); g.fillEllipse(cx + 7, 12, 14, 9);
    g.fillStyle(0x00ffcc, 0.3); g.fillEllipse(cx - 7, 12, 11, 7); g.fillEllipse(cx + 7, 12, 11, 7);
    g.fillStyle(0x00ffcc, 1); g.fillEllipse(cx - 7, 12, 6, 5); g.fillEllipse(cx + 7, 12, 6, 5);
    g.fillStyle(0xffffff, 0.8); g.fillCircle(cx - 5, 10, 2); g.fillCircle(cx + 9, 10, 2);
    // Tiny nose slits
    g.fillStyle(0x004422, 1); g.fillEllipse(cx - 2, 18, 3, 4); g.fillEllipse(cx + 2, 18, 3, 4);
    // Thin mouth
    g.lineStyle(2, 0x004422, 0.9); g.lineBetween(cx - 6, 22, cx + 6, 22);
    // Legs
    g.fillStyle(0x228844, 1); g.fillRect(cx - 9, 50, 8, 10); g.fillRect(cx + 1, 50, 8, 10);
    g.fillStyle(0x115522, 1); g.fillEllipse(cx - 5, 58, 12, 5); g.fillEllipse(cx + 5, 58, 12, 5);
    g.generateTexture('alien', 44, 60); g.destroy();
  }

  // ── Zombie ─────────────────────────────────────────────────────────────────
  _zombie() {
    const g = this._g(), cx = 22;
    // Torn trousers
    g.fillStyle(0x334422, 1); g.fillRect(cx - 10, 34, 9, 20); g.fillRect(cx + 1, 34, 9, 20);
    g.fillStyle(0x445533, 0.4); g.fillRect(cx - 9, 36, 4, 14); g.fillRect(cx + 2, 36, 4, 14);
    g.fillStyle(0x112200, 0.6);
    g.fillTriangle(cx - 10, 50, cx - 5, 50, cx - 7, 55);
    g.fillTriangle(cx + 4, 50, cx + 10, 50, cx + 7, 55);
    g.fillStyle(0x1a2200, 1); g.fillEllipse(cx - 5, 58, 13, 5); g.fillEllipse(cx + 5, 58, 13, 5);
    // Body (rotten flesh)
    g.fillStyle(0x7a9955, 1); g.fillEllipse(cx, 22, 28, 30);
    g.fillStyle(0x99bb66, 0.5); g.fillEllipse(cx - 4, 16, 14, 18);
    g.fillStyle(0x556633, 0.5); g.fillEllipse(cx + 5, 26, 12, 14);
    // Torn shirt
    g.fillStyle(0x3a4422, 0.7); g.fillRect(cx - 12, 12, 24, 20);
    g.fillStyle(0x2a3311, 0.5); g.fillRect(cx - 10, 14, 9, 14);
    // Wounds/rot marks
    g.fillStyle(0x442211, 0.8); g.fillCircle(cx + 4, 18, 3); g.fillCircle(cx - 5, 26, 2.5);
    // Arms (outstretched)
    g.fillStyle(0x7a9955, 1); g.fillRect(cx - 21, 14, 10, 20); g.fillRect(cx + 11, 14, 10, 20);
    g.fillStyle(0x99bb66, 0.4); g.fillRect(cx - 20, 15, 5, 14); g.fillRect(cx + 12, 15, 5, 14);
    // Bony fingers
    g.fillStyle(0xbbcc99, 1);
    for (let i = 0; i < 4; i++) {
      g.fillRect(cx - 22 + i * 2.5, 33, 2, 7);
      g.fillRect(cx + 11 + i * 2.5, 33, 2, 7);
    }
    // Head
    g.fillStyle(0x7a9955, 1); g.fillCircle(cx, 9, 12);
    g.fillStyle(0x99bb66, 0.5); g.fillCircle(cx - 3, 6, 7);
    // Rot mark on head
    g.fillStyle(0x442211, 0.7); g.fillCircle(cx + 5, 6, 3);
    // Eyes (dead white with pupils)
    g.fillStyle(0xccddaa, 1); g.fillCircle(cx - 5, 8, 4); g.fillCircle(cx + 5, 8, 4);
    g.fillStyle(0x556633, 0.6); g.fillCircle(cx - 5, 8, 2.5); g.fillCircle(cx + 5, 8, 2.5);
    g.fillStyle(0x000000, 1); g.fillCircle(cx - 4, 8, 1.5); g.fillCircle(cx + 6, 8, 1.5);
    // Stitched mouth
    g.fillStyle(0x112200, 1); g.fillRect(cx - 6, 14, 12, 4);
    g.lineStyle(1.5, 0xaabb88, 0.8);
    for (let i = -2; i <= 2; i++) g.lineBetween(cx + i * 2.5, 14, cx + i * 2.5, 18);
    g.generateTexture('zombie', 44, 60); g.destroy();
  }

  // ── Phoenix ────────────────────────────────────────────────────────────────
  _phoenix() {
    const g = this._g(), cx = 22;
    // Tail feathers (flame-like)
    g.fillStyle(0xff4400, 0.8); g.fillTriangle(cx - 10, 50, cx, 32, cx - 5, 58);
    g.fillStyle(0xff6600, 0.8); g.fillTriangle(cx, 50, cx + 5, 32, cx + 2, 60);
    g.fillStyle(0xff8800, 0.7); g.fillTriangle(cx + 10, 50, cx + 2, 32, cx + 8, 58);
    g.fillStyle(0xffcc00, 0.5); g.fillTriangle(cx - 5, 48, cx + 1, 32, cx - 2, 56);
    // Wings (expanded)
    g.fillStyle(0xff5500, 0.9); g.fillTriangle(cx - 5, 22, cx - 22, 6, cx - 18, 34);
    g.fillStyle(0xff5500, 0.9); g.fillTriangle(cx + 5, 22, cx + 22, 6, cx + 18, 34);
    g.fillStyle(0xff8800, 0.6); g.fillTriangle(cx - 6, 24, cx - 20, 10, cx - 17, 32);
    g.fillStyle(0xff8800, 0.6); g.fillTriangle(cx + 6, 24, cx + 20, 10, cx + 17, 32);
    // Feather tips glow
    g.fillStyle(0xffee00, 0.5); g.fillTriangle(cx - 22, 6, cx - 16, 10, cx - 18, 2);
    g.fillStyle(0xffee00, 0.5); g.fillTriangle(cx + 22, 6, cx + 16, 10, cx + 18, 2);
    // Body
    g.fillStyle(0xdd4400, 1); g.fillEllipse(cx, 28, 22, 28);
    g.fillStyle(0xff7722, 0.6); g.fillEllipse(cx - 4, 22, 12, 16);
    g.fillStyle(0xaa2200, 0.4); g.fillEllipse(cx + 4, 32, 10, 12);
    // Golden underbelly
    g.fillStyle(0xffcc44, 0.85); g.fillEllipse(cx + 2, 28, 12, 20);
    g.fillStyle(0xffee88, 0.5); g.fillEllipse(cx + 1, 24, 8, 12);
    // Head
    g.fillStyle(0xdd4400, 1); g.fillCircle(cx, 12, 11);
    g.fillStyle(0xff7722, 0.5); g.fillCircle(cx - 3, 9, 7);
    // Beak
    g.fillStyle(0xffcc00, 1); g.fillTriangle(cx - 1, 14, cx + 1, 14, cx + 8, 16);
    g.fillStyle(0xddaa00, 0.5); g.fillTriangle(cx, 15, cx + 1, 15, cx + 6, 17);
    // Crest (flame crown)
    g.fillStyle(0xffcc00, 1); g.fillTriangle(cx - 2, 2, cx + 2, 2, cx, -4);
    g.fillStyle(0xff8800, 1); g.fillTriangle(cx - 5, 4, cx - 1, 4, cx - 3, -2);
    g.fillStyle(0xff8800, 1); g.fillTriangle(cx + 5, 4, cx + 1, 4, cx + 3, -2);
    // Eyes
    g.fillStyle(0xffee00, 0.3); g.fillCircle(cx - 3, 11, 5); g.fillCircle(cx + 5, 11, 5);
    g.fillStyle(0xffcc00, 1); g.fillCircle(cx - 3, 11, 3.5); g.fillCircle(cx + 5, 11, 3.5);
    g.fillStyle(0x000000, 1); g.fillCircle(cx - 2, 11, 2); g.fillCircle(cx + 6, 11, 2);
    g.fillStyle(0xffffff, 0.9); g.fillCircle(cx - 1, 10, 1); g.fillCircle(cx + 7, 10, 1);
    g.generateTexture('phoenix', 44, 60); g.destroy();
  }

  // ── Kraken ─────────────────────────────────────────────────────────────────
  _kraken() {
    const g = this._g(), cx = 22;
    // Tentacles (background ones)
    g.fillStyle(0x113344, 0.7); g.fillEllipse(cx - 16, 52, 9, 22); g.fillEllipse(cx + 16, 52, 9, 22);
    g.fillStyle(0x224455, 0.6); g.fillEllipse(cx - 8, 54, 8, 14); g.fillEllipse(cx + 8, 54, 8, 14);
    // Main body
    g.fillStyle(0x224466, 1); g.fillEllipse(cx, 28, 34, 40);
    g.fillStyle(0x336688, 0.5); g.fillEllipse(cx - 5, 20, 18, 22);
    g.fillStyle(0x112233, 0.5); g.fillEllipse(cx + 7, 32, 14, 18);
    // Suction cup markings on body
    g.fillStyle(0x446688, 0.6);
    for (let i = 0; i < 5; i++) {
      const sx = cx - 10 + i * 5, sy = 30 + (i % 2) * 6;
      g.fillCircle(sx, sy, 2.5);
    }
    // Mantle (head)
    g.fillStyle(0x2a5577, 1); g.fillEllipse(cx, 14, 28, 24);
    g.fillStyle(0x336688, 0.5); g.fillEllipse(cx - 4, 9, 16, 14);
    // Eyes (huge ominous)
    g.fillStyle(0xffcc00, 0.3); g.fillCircle(cx - 7, 13, 8); g.fillCircle(cx + 7, 13, 8);
    g.fillStyle(0xddaa00, 1); g.fillCircle(cx - 7, 13, 5.5); g.fillCircle(cx + 7, 13, 5.5);
    g.fillStyle(0x000000, 1); g.fillEllipse(cx - 7, 13, 3, 7); g.fillEllipse(cx + 7, 13, 3, 7);
    g.fillStyle(0xffffff, 0.8); g.fillCircle(cx - 5, 11, 1.5); g.fillCircle(cx + 9, 11, 1.5);
    // Mouth beak
    g.fillStyle(0x1a2a33, 1); g.fillTriangle(cx - 3, 18, cx + 3, 18, cx, 23);
    g.fillStyle(0x334455, 0.5); g.fillTriangle(cx - 2, 19, cx + 2, 19, cx, 22);
    // Front tentacles (arms)
    g.fillStyle(0x224466, 1); g.fillEllipse(cx - 19, 32, 10, 26); g.fillEllipse(cx + 19, 32, 10, 26);
    g.fillStyle(0x336688, 0.4); g.fillEllipse(cx - 18, 28, 7, 16); g.fillEllipse(cx + 18, 28, 7, 16);
    // Sucker dots on tentacles
    g.fillStyle(0x446688, 0.7);
    for (let i = 0; i < 4; i++) {
      g.fillCircle(cx - 19, 24 + i * 6, 2); g.fillCircle(cx + 19, 24 + i * 6, 2);
    }
    g.generateTexture('kraken', 44, 60); g.destroy();
  }

  // ── Witch ──────────────────────────────────────────────────────────────────
  _witch() {
    const g = this._g(), cx = 22;
    // Legs (dark robe base)
    g.fillStyle(0x220033, 1); g.fillRect(cx - 10, 36, 9, 18); g.fillRect(cx + 1, 36, 9, 18);
    g.fillStyle(0x330044, 0.4); g.fillRect(cx - 9, 38, 4, 12); g.fillRect(cx + 2, 38, 4, 12);
    // Boots
    g.fillStyle(0x110011, 1); g.fillEllipse(cx - 5, 58, 13, 5); g.fillEllipse(cx + 5, 58, 13, 5);
    // Robe body (dark purple/black)
    g.fillStyle(0x220033, 1); g.fillEllipse(cx, 26, 30, 36);
    g.fillStyle(0x330044, 0.5); g.fillEllipse(cx - 4, 18, 16, 22);
    g.fillStyle(0x110022, 0.5); g.fillEllipse(cx + 6, 30, 12, 16);
    // Robe hem flare (wider at bottom)
    g.fillStyle(0x1a0028, 1); g.fillRect(cx - 14, 40, 28, 8);
    g.fillStyle(0x2a0038, 0.5); g.fillRect(cx - 12, 41, 12, 5);
    // Purple star/moon emblem on robe
    g.fillStyle(0x9900cc, 0.7); g.fillCircle(cx, 28, 6);
    g.fillStyle(0xbb22ee, 0.5); g.fillCircle(cx - 1, 27, 3);
    // Arms
    g.fillStyle(0x220033, 1); g.fillRect(cx - 19, 16, 8, 22); g.fillRect(cx + 11, 16, 8, 22);
    g.fillStyle(0x330044, 0.4); g.fillRect(cx - 18, 17, 4, 14); g.fillRect(cx + 12, 17, 4, 14);
    // Hands (green tinted)
    g.fillStyle(0x33aa44, 1); g.fillCircle(cx - 15, 39, 5); g.fillCircle(cx + 15, 39, 5);
    g.fillStyle(0x55cc66, 0.5); g.fillCircle(cx - 14, 38, 3); g.fillCircle(cx + 16, 38, 3);
    // Wand in right hand
    g.fillStyle(0x4a2800, 1); g.fillRect(cx + 13, 30, 3, 18);
    g.fillStyle(0x9900cc, 1); g.fillCircle(cx + 14, 29, 4);
    g.fillStyle(0xcc44ff, 0.7); g.fillCircle(cx + 13, 28, 2);
    // Neck (green)
    g.fillStyle(0x44cc44, 1); g.fillRect(cx - 4, 6, 8, 8);
    // Head (green face)
    g.fillStyle(0x44cc44, 1); g.fillCircle(cx, 3, 12);
    g.fillStyle(0x66ee66, 0.45); g.fillCircle(cx - 4, -1, 7);
    g.fillStyle(0x228822, 0.4); g.fillCircle(cx + 5, 5, 6);
    // Nose (long, witchy)
    g.fillStyle(0x228822, 1); g.fillTriangle(cx - 1, 5, cx + 1, 5, cx + 5, 10);
    // Eyes (glowing yellow)
    g.fillStyle(0xffee00, 0.3); g.fillCircle(cx - 5, 1, 5); g.fillCircle(cx + 5, 1, 5);
    g.fillStyle(0xffdd00, 1); g.fillCircle(cx - 5, 1, 3.5); g.fillCircle(cx + 5, 1, 3.5);
    g.fillStyle(0x000000, 1); g.fillCircle(cx - 4, 1, 2); g.fillCircle(cx + 6, 1, 2);
    g.fillStyle(0xffffff, 0.8); g.fillCircle(cx - 3, 0, 1); g.fillCircle(cx + 7, 0, 1);
    // Smile (crooked)
    g.fillStyle(0x115511, 1); g.fillRect(cx - 5, 8, 10, 3);
    g.fillStyle(0xffffff, 1); g.fillRect(cx - 4, 8, 3, 2); g.fillRect(cx + 1, 8, 3, 2);
    // Tall pointy black hat (brim + cone)
    g.fillStyle(0x000000, 1); g.fillRect(cx - 17, 2, 34, 7); // brim
    g.fillStyle(0x111111, 0.5); g.fillRect(cx - 15, 3, 14, 4);
    g.fillStyle(0x000000, 1); g.fillTriangle(cx - 10, 2, cx + 10, 2, cx, -22); // cone
    g.fillStyle(0x111111, 0.5); g.fillTriangle(cx - 7, 2, cx + 4, 2, cx - 2, -18);
    // Hat band (purple)
    g.fillStyle(0x9900cc, 1); g.fillRect(cx - 10, -2, 20, 5);
    g.fillStyle(0xcc44ff, 0.5); g.fillRect(cx - 8, -1, 8, 3);
    g.generateTexture('witch', 44, 60); g.destroy();
  }

  // ── Glitch ─────────────────────────────────────────────────────────────────
  _glitch() {
    const g = this._g(), cx = 22;
    // Corrupted base body — static-y rectangles
    const glitchCols = [0xff00ff, 0x00ffff, 0xffff00, 0xff0066, 0x00ff88, 0x0066ff];
    for (let i = 0; i < 30; i++) {
      const gx = Math.random() * 44;
      const gy = Math.random() * 60;
      const gw = 4 + Math.random() * 18;
      const gh = 2 + Math.random() * 6;
      g.fillStyle(glitchCols[i % glitchCols.length], 0.6 + Math.random() * 0.4);
      g.fillRect(gx, gy, gw, gh);
    }
    // Dark void base shape
    g.fillStyle(0x080010, 0.7); g.fillEllipse(cx, 34, 28, 44);
    g.fillStyle(0x0d0018, 0.6); g.fillCircle(cx, 12, 13);
    // Glitch scanlines
    for (let y = 0; y < 60; y += 4) {
      g.fillStyle(0x000000, 0.25); g.fillRect(0, y, 44, 2);
    }
    // Fragmented/shifted outlines
    g.fillStyle(0x00ffff, 0.8); g.fillRect(cx - 4, 8, 10, 3);
    g.fillStyle(0xff00ff, 0.8); g.fillRect(cx - 7, 11, 8, 3);
    g.fillStyle(0xffff00, 0.8); g.fillRect(cx, 14, 12, 3);
    // Eyes — glitching between colors
    g.fillStyle(0xff00ff, 1); g.fillEllipse(cx - 5, 12, 10, 8); g.fillEllipse(cx + 5, 12, 10, 8);
    g.fillStyle(0x00ffff, 0.85); g.fillEllipse(cx - 4, 11, 7, 5); g.fillEllipse(cx + 6, 11, 7, 5);
    g.fillStyle(0xffffff, 0.95); g.fillEllipse(cx - 5, 12, 4, 3); g.fillEllipse(cx + 5, 12, 4, 3);
    // Offset ghost (glitch double)
    g.fillStyle(0xff00ff, 0.2); g.fillEllipse(cx + 4, 34, 20, 36);
    g.fillStyle(0x00ffff, 0.2); g.fillEllipse(cx - 4, 34, 20, 36);
    // Random pixel scatter
    const scatterCols = [0xffffff, 0xff00ff, 0x00ffff, 0xffff00];
    for (let i = 0; i < 20; i++) {
      g.fillStyle(scatterCols[i % 4], 0.9);
      g.fillRect(Math.random() * 44, Math.random() * 60, 2, 2);
    }
    // ERROR text hint (mouth area)
    g.fillStyle(0xffffff, 0.7); g.fillRect(cx - 8, 21, 16, 3);
    g.fillStyle(0x000000, 0.8); g.fillRect(cx - 7, 21, 5, 2); g.fillRect(cx - 1, 21, 5, 2);
    g.generateTexture('glitch', 44, 60); g.destroy();
  }

  // ── TNT (Boom Drop) ────────────────────────────────────────────────────────
  _tnt() {
    const g = this._g(), W = 48, H = 52;
    // Main red body
    g.fillStyle(0xdd1111, 1); g.fillRect(0, 8, W, H - 8);
    // Black band top
    g.fillStyle(0x110000, 1); g.fillRect(0, 8, W, 8);
    // Black band middle
    g.fillStyle(0x110000, 1); g.fillRect(0, 26, W, 9);
    // Black band bottom
    g.fillStyle(0x110000, 1); g.fillRect(0, 44, W, 8);
    // White label panel
    g.fillStyle(0xffffff, 0.95); g.fillRect(6, 27, 36, 18);
    // Red diamond corners on label
    g.fillStyle(0xdd1111, 1);
    g.fillRect(6, 27, 6, 6);  g.fillRect(36, 27, 6, 6);
    g.fillRect(6, 39, 6, 6);  g.fillRect(36, 39, 6, 6);
    g.fillRect(19, 27, 10, 18);
    // Light red highlight on body
    g.fillStyle(0xff4444, 0.35); g.fillRect(6, 9, 14, 15);
    g.fillStyle(0xff4444, 0.20); g.fillRect(6, 35, 14, 8);
    // Fuse rope
    g.fillStyle(0x886644, 1); g.fillRect(20, 0, 5, 10);
    g.fillStyle(0xaa7755, 0.5); g.fillRect(21, 1, 2, 9);
    // Fuse spark glow
    g.fillStyle(0xffee00, 0.9); g.fillCircle(22, 2, 4);
    g.fillStyle(0xff8800, 0.7); g.fillCircle(22, 2, 2.5);
    g.fillStyle(0xffffff, 0.8); g.fillCircle(22, 1, 1.2);
    g.generateTexture('tnt', W, H); g.destroy();
  }
}
