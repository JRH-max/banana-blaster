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
    this._weaponModels();
    this._botGun();
    this._coin();
    this._slothPirate();
    this._rockNinja();
    this._trashCan();
    this.scene.start('MenuScene');
  }

  _g() { return this.make.graphics({ x: 0, y: 0, add: false }); }

  _tiles() {
    const diamond = (g, pts) => {
      g.fillPoints(pts, true);
    };
    const PTS = [{ x:32,y:0 },{ x:64,y:16 },{ x:32,y:32 },{ x:0,y:16 }];

    // Road tile with faint center-line dashes
    let g = this._g();
    g.fillStyle(0x1e1e1e, 1); diamond(g, PTS);
    g.lineStyle(1, 0x333333, 0.5); g.strokePoints(PTS, true);
    g.fillStyle(0xffee00, 0.55);
    g.fillRect(30, 14, 4, 5); g.fillRect(30, 22, 4, 5);  // dashed yellow center line
    g.generateTexture('tile_road', 64, 32); g.destroy();

    // Sidewalk / concrete tile
    g = this._g();
    g.fillStyle(0x484848, 1); diamond(g, PTS);
    g.lineStyle(1, 0x3a3a3a, 0.6); g.strokePoints(PTS, true);
    g.fillStyle(0x555555, 0.4); g.fillRect(14, 14, 10, 6); g.fillRect(40, 16, 8, 5);
    g.generateTexture('tile_sidewalk', 64, 32); g.destroy();

    // Grass (kept for potential parks)
    g = this._g();
    g.fillStyle(0x3a7a28, 1); diamond(g, PTS);
    g.lineStyle(1, 0x1e4e10, 0.5); g.strokePoints(PTS, true);
    g.generateTexture('tile_grass',  64, 32); g.destroy();
    g = this._g();
    g.fillStyle(0x4a8a36, 1); diamond(g, PTS);
    g.lineStyle(1, 0x2a6a18, 0.5); g.strokePoints(PTS, true);
    g.generateTexture('tile_grass2', 64, 32); g.destroy();
  }

  _tree() {
    const g = this._g();
    g.fillStyle(0x6b3a1f, 1); g.fillRect(24, 55, 12, 34);
    g.fillStyle(0x4a2810, 1); g.fillRect(28, 55, 4, 34);
    g.fillStyle(0x1a4a0a, 0.5); g.fillEllipse(30, 68, 48, 14);
    g.fillStyle(0x1e5e0e, 1); g.fillCircle(30, 42, 30);
    g.fillStyle(0x2a7a18, 1); g.fillCircle(30, 38, 26);
    g.fillStyle(0x3a9428, 1); g.fillCircle(26, 32, 18);
    g.fillStyle(0x4ab030, 1); g.fillCircle(34, 30, 12);
    g.fillStyle(0x5acc3a, 0.6); g.fillCircle(22, 26, 8);
    g.fillStyle(0x104008, 0.4); g.fillCircle(38, 44, 8); g.fillCircle(18, 46, 6);
    g.generateTexture('tree', 60, 92); g.destroy();
  }

  _banana() {
    const g = this._g();
    const cx = 22, cy = 34;
    g.fillStyle(0xffd700, 1); g.fillEllipse(cx, cy, 30, 42);
    g.fillStyle(0xf0c800, 0.5); g.fillEllipse(cx-4, cy-6, 14, 20);
    g.fillStyle(0x111111, 1); g.fillRect(cx-13, cy+8, 26, 22);
    g.fillStyle(0xffffff, 1);
    g.fillTriangle(cx-2,cy+8, cx-10,cy+8, cx-2,cy+22);
    g.fillTriangle(cx+2,cy+8, cx+10,cy+8, cx+2,cy+22);
    g.fillStyle(0xcc0000, 1);
    g.fillTriangle(cx-6,cy+7, cx,cy+11, cx-6,cy+15);
    g.fillTriangle(cx+6,cy+7, cx,cy+11, cx+6,cy+15);
    g.fillCircle(cx, cy+11, 2.5);
    g.fillStyle(0x111111, 1); g.fillRect(cx-14, cy-16, 28, 10); g.fillRect(cx-10, cy-26, 20, 12);
    g.fillStyle(0xffaa00, 0.8);
    g.fillRect(cx-13, cy-14, 11, 7); g.fillRect(cx+2, cy-14, 11, 7);
    g.lineStyle(3, 0x8b6914, 1);
    g.beginPath(); g.arc(cx-1, cy-24, 12, Phaser.Math.DegToRad(215), Phaser.Math.DegToRad(325)); g.strokePath();
    g.fillStyle(0x111111, 1); g.fillRect(cx-10, cy+30, 8, 14); g.fillRect(cx+2, cy+30, 8, 14);
    g.fillStyle(0x333333, 1); g.fillRect(cx-12, cy+42, 10, 5); g.fillRect(cx, cy+42, 10, 5);
    g.generateTexture('banana', 44, 60); g.destroy();
  }

  _drawRaccoonBase(g, cx, cy, furCol, furDark) {
    g.fillStyle(furCol, 1); g.fillEllipse(cx, cy+34, 64, 56);
    g.fillStyle(furCol, 1); g.fillCircle(cx, cy, 32);
    g.fillStyle(furDark, 1);
    g.fillTriangle(cx-24,cy-28, cx-18,cy-12, cx-32,cy-12);
    g.fillTriangle(cx+24,cy-28, cx+18,cy-12, cx+32,cy-12);
    g.fillStyle(0x2a2a2a, 1); g.fillRect(cx-29, cy-15, 58, 13);
    g.fillStyle(0xffee66, 1); g.fillCircle(cx-12,cy-9, 10); g.fillCircle(cx+12,cy-9, 10);
    g.fillStyle(0xff4400, 1); g.fillCircle(cx-12,cy-9, 6);  g.fillCircle(cx+12,cy-9, 6);
    g.fillStyle(0x111111, 1); g.fillCircle(cx-11,cy-10, 3); g.fillCircle(cx+13,cy-10, 3);
    g.fillStyle(0xffffff, 1); g.fillCircle(cx-9,cy-12, 2);  g.fillCircle(cx+15,cy-12, 2);
    g.lineStyle(3, 0x111111, 1);
    g.beginPath(); g.moveTo(cx-22,cy-22); g.lineTo(cx-4,cy-18); g.strokePath();
    g.beginPath(); g.moveTo(cx+22,cy-22); g.lineTo(cx+4,cy-18); g.strokePath();
    g.fillStyle(0xbbbbbb, 1); g.fillEllipse(cx, cy+8, 20, 13);
    g.fillStyle(0x444444, 1); g.fillEllipse(cx, cy+6, 10, 7);
    g.fillStyle(0x1a1a1a, 1); g.fillRect(cx-16, cy+12, 32, 12);
    g.fillStyle(0xffffff, 1);
    for (let i = 0; i < 5; i++) g.fillTriangle(cx-14+i*7,cy+12, cx-10+i*7,cy+12, cx-12+i*7+3,cy+20);
    g.fillStyle(furDark, 1);
    g.fillEllipse(cx-34,cy+40, 18,32); g.fillEllipse(cx+34,cy+40, 18,32);
    g.fillStyle(0x777777, 1); g.fillEllipse(cx+56, cy+48, 14,36);
    g.fillStyle(0x333333, 1);
    [29,36,43,50].forEach(y => g.fillRect(cx+50, cy+y, 12, 3));
  }

  _raccoonNormal() {
    const g = this._g();
    this._drawRaccoonBase(g, 44, 52, 0x888888, 0x666666);
    g.generateTexture('raccoon_normal', 88, 120); g.destroy();
  }

  _raccoonArmored() {
    const g = this._g();
    const cx = 44, cy = 52;
    this._drawRaccoonBase(g, cx, cy, 0x707070, 0x505050);
    g.fillStyle(0x444455, 1); g.fillEllipse(cx, cy-18, 68, 42);
    g.fillStyle(0x55556a, 1); g.fillRect(cx-26, cy-24, 52, 12);
    g.fillStyle(0x333344, 1); g.fillRect(cx-22, cy-6, 44, 8);
    g.fillStyle(0x88aaff, 0.4); g.fillRect(cx-20, cy-5, 40, 6);
    g.fillStyle(0x445566, 1); g.fillRect(cx-28,cy+18, 56,28);
    g.fillStyle(0x556677, 1); g.fillRect(cx-26,cy+20, 52,12);
    g.lineStyle(1, 0x334455, 0.8);
    g.lineBetween(cx-28,cy+30, cx+28,cy+30); g.lineBetween(cx,cy+18, cx,cy+46);
    g.fillStyle(0x445566, 1);
    g.fillRect(cx-44,cy+16, 16,18); g.fillRect(cx+28,cy+16, 16,18);
    g.generateTexture('raccoon_armored', 88, 120); g.destroy();
  }

  _raccoonBoss() {
    const g = this._g();
    const cx = 52, cy = 60;
    this._drawRaccoonBase(g, cx, cy, 0x7755aa, 0x553388);
    g.fillStyle(0xffd700, 1); g.fillRect(cx-20,cy-44, 40,14);
    [-16,-5,6,17].forEach(x => g.fillTriangle(cx+x,cy-58, cx+x+6,cy-44, cx+x-6,cy-44));
    g.fillStyle(0xff2244, 1); [-16,-5,6,17].forEach(x => g.fillCircle(cx+x+3,cy-52, 4));
    g.fillStyle(0x221122, 1); g.fillRect(cx-32,cy+10, 64,30);
    g.fillStyle(0x331133, 1); g.fillRect(cx-30,cy+12, 60,14);
    g.lineStyle(2, 0x660066, 1);
    g.lineBetween(cx,cy+10, cx,cy+40); g.lineBetween(cx-32,cy+25, cx+32,cy+25);
    g.fillStyle(0xffdd00, 1); g.fillCircle(cx-12,cy-9, 12); g.fillCircle(cx+12,cy-9, 12);
    g.fillStyle(0xff0000, 1); g.fillCircle(cx-12,cy-9, 7);  g.fillCircle(cx+12,cy-9, 7);
    g.fillStyle(0x111111, 1); g.fillCircle(cx-11,cy-10, 4); g.fillCircle(cx+13,cy-10, 4);
    g.generateTexture('raccoon_boss', 106, 140); g.destroy();
  }

  _peel() {
    const g = this._g();
    g.fillStyle(0x7a4f00, 1); g.fillEllipse(14, 9, 26, 12);
    g.fillStyle(0xc49016, 1); g.fillEllipse(14, 8, 18, 8);
    g.generateTexture('peel', 28, 18); g.destroy();
  }

  _explosion() {
    const g = this._g();
    g.fillStyle(0xff6600, 1); g.fillRect(44, 55, 18, 30);
    g.fillStyle(0xffaa00, 0.6); g.fillRect(49, 55, 8, 30);
    g.fillStyle(0xff2200, 1); g.fillEllipse(53, 55, 90, 40);
    g.fillStyle(0xff5500, 1); g.fillEllipse(53, 46, 70, 30);
    g.fillStyle(0xffcc88, 1); g.fillCircle(53, 38, 24);
    g.fillStyle(0xfff0dd, 0.85);
    g.fillCircle(36,44, 17); g.fillCircle(70,43, 18); g.fillCircle(53,26, 15);
    g.generateTexture('explosion', 106, 90); g.destroy();
  }

  _pickup() {
    const g = this._g();
    g.fillStyle(0xffd700, 1);
    const pts = [];
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI * 2 / 10) - Math.PI / 2;
      pts.push({ x: 12 + Math.cos(a)*(i%2===0?11:5), y: 12 + Math.sin(a)*(i%2===0?11:5) });
    }
    g.fillPoints(pts, true);
    g.generateTexture('pickup', 24, 24); g.destroy();
  }

  _heart() {
    const g = this._g();
    g.fillStyle(0xff3333, 1);
    g.fillCircle(8, 8, 8); g.fillCircle(18, 8, 8);
    g.fillTriangle(0, 11, 26, 11, 13, 26);
    g.generateTexture('heart', 26, 26); g.destroy();
  }

  _muzzleFlash() {
    const g = this._g();
    g.fillStyle(0xffcc00, 0.9); g.fillCircle(26, 26, 16);
    g.fillStyle(0xff8800, 0.75); g.fillCircle(26, 26, 11);
    g.fillStyle(0xffffff, 0.95); g.fillCircle(26, 26, 5);
    [[0,-24],[17,-17],[24,0],[17,17],[0,24],[-17,17],[-24,0],[-17,-17]].forEach(([dx,dy]) => {
      g.fillStyle(0xffaa00, 0.7);
      g.fillTriangle(26+dx*0.35,26+dy*0.35, 26+dx,26+dy, 26-dy*0.2,26+dx*0.2);
    });
    g.generateTexture('muzzle_flash', 52, 52); g.destroy();
  }

  _hitSpark() {
    const g = this._g();
    g.fillStyle(0xff6600, 1); g.fillCircle(10, 10, 7);
    g.fillStyle(0xffee00, 0.9); g.fillCircle(10, 10, 4);
    g.generateTexture('hit_spark', 20, 20); g.destroy();
  }

  _joystick() {
    let g = this._g();
    g.fillStyle(0xffffff, 0.08); g.fillCircle(50, 50, 50);
    g.lineStyle(2, 0xffffff, 0.2); g.strokeCircle(50, 50, 50);
    g.generateTexture('joy_base', 100, 100); g.destroy();

    g = this._g();
    g.fillStyle(0xffffff, 0.28); g.fillCircle(28, 28, 28);
    g.generateTexture('joy_thumb', 56, 56); g.destroy();
  }

  _botGun() {
    const g = this._g();
    g.fillStyle(0x333333, 1); g.fillRect(0, 3, 22, 6);
    g.fillStyle(0x555555, 1); g.fillRect(14, 1, 8, 4);
    g.fillStyle(0x222222, 1); g.fillRect(6, 9, 6, 8);
    g.generateTexture('bot_gun', 24, 16); g.destroy();
  }

  _coin() {
    const g = this._g();
    g.fillStyle(0xffd700, 1); g.fillCircle(10, 10, 10);
    g.fillStyle(0xffaa00, 1); g.fillCircle(10, 10, 7);
    g.fillStyle(0xffe566, 1); g.fillCircle(8, 8, 4);
    g.lineStyle(2, 0xcc8800, 1); g.strokeCircle(10, 10, 10);
    g.generateTexture('coin', 20, 20); g.destroy();
  }

  _slothPirate() {
    const g = this._g();
    const cx = 22, cy = 34;
    // Legs
    g.fillStyle(0x6b4a10, 1); g.fillRect(cx-9, cy+20, 8, 16); g.fillRect(cx+1, cy+20, 8, 16);
    g.fillStyle(0x3a2200, 1); g.fillRect(cx-11, cy+34, 10, 6); g.fillRect(cx+1, cy+34, 10, 6);
    // Body
    g.fillStyle(0x7a5214, 1); g.fillEllipse(cx, cy+6, 30, 32);
    g.fillStyle(0x9a7230, 1); g.fillEllipse(cx, cy+4, 20, 22);
    // Arms with long sloth claws
    g.fillStyle(0x7a5214, 1); g.fillRect(cx-18, cy-2, 7, 20); g.fillRect(cx+11, cy-2, 7, 20);
    g.fillStyle(0x3a2200, 1);
    for (let i = 0; i < 3; i++) { g.fillRect(cx-18+i*2, cy+17, 2, 7); g.fillRect(cx+11+i*2, cy+17, 2, 7); }
    // Head
    g.fillStyle(0x7a5214, 1); g.fillCircle(cx, cy-10, 16);
    g.fillStyle(0x9a7230, 1); g.fillEllipse(cx, cy-7, 21, 16);
    // Pirate hat
    g.fillStyle(0x111111, 1);
    g.fillRect(cx-17, cy-24, 34, 7);
    g.fillTriangle(cx-12, cy-24, cx+12, cy-24, cx, cy-42);
    g.fillStyle(0xddaa00, 1); g.fillRect(cx-17, cy-26, 34, 4);
    g.fillStyle(0xeeeeee, 1); g.fillCircle(cx, cy-32, 4);
    g.fillStyle(0x111111, 1); g.fillCircle(cx-1, cy-33, 1); g.fillCircle(cx+2, cy-33, 1);
    g.lineStyle(1, 0xeeeeee, 1);
    g.lineBetween(cx-5, cy-28, cx+5, cy-28); g.lineBetween(cx-3, cy-26, cx+3, cy-30);
    // Eye patch on right eye
    g.fillStyle(0x111111, 1); g.fillCircle(cx+6, cy-12, 6);
    g.lineStyle(2, 0x222222, 1); g.lineBetween(cx+6, cy-18, cx+14, cy-22);
    // Left eye (sleepy, half-closed)
    g.fillStyle(0x2a1800, 1); g.fillCircle(cx-6, cy-12, 5);
    g.fillStyle(0x7a5214, 1); g.fillRect(cx-11, cy-17, 10, 6);
    g.fillStyle(0xffffff, 0.6); g.fillCircle(cx-4, cy-13, 1.5);
    // Nose & smile
    g.fillStyle(0x4a2a00, 1); g.fillEllipse(cx, cy-4, 7, 5);
    g.lineStyle(2, 0x3a2200, 1);
    g.beginPath(); g.arc(cx, cy+1, 5, 0.2, Math.PI-0.2); g.strokePath();
    g.generateTexture('sloth_pirate', 44, 60); g.destroy();
  }

  _rockNinja() {
    const g = this._g();
    const cx = 22, cy = 34;
    // Legs
    g.fillStyle(0x3a3a3a, 1); g.fillRect(cx-9, cy+20, 9, 16); g.fillRect(cx, cy+20, 9, 16);
    g.fillStyle(0x222222, 1); g.fillRect(cx-11, cy+34, 11, 6); g.fillRect(cx, cy+34, 11, 6);
    // Body - rocky lumpy shape
    g.fillStyle(0x555555, 1); g.fillEllipse(cx, cy+8, 30, 34);
    g.fillStyle(0x6a6a6a, 1); g.fillEllipse(cx-3, cy+2, 18, 20);
    g.fillStyle(0x3a3a3a, 1); g.fillEllipse(cx+6, cy+14, 12, 14);
    g.lineStyle(1, 0x333333, 0.9); g.lineBetween(cx+2, cy-2, cx+10, cy+10); g.lineBetween(cx-8, cy+6, cx-2, cy+18);
    // Arms
    g.fillStyle(0x4a4a4a, 1); g.fillRect(cx-18, cy-2, 7, 18); g.fillRect(cx+11, cy-2, 7, 18);
    g.fillStyle(0x333333, 1);
    for (let i = 0; i < 3; i++) { g.fillRect(cx-18+i*2, cy+15, 2, 6); g.fillRect(cx+11+i*2, cy+15, 2, 6); }
    // Head
    g.fillStyle(0x555555, 1); g.fillCircle(cx, cy-10, 16);
    g.fillStyle(0x4a4a4a, 1); g.fillCircle(cx+4, cy-8, 8);
    // Ninja mask (dark, lower face)
    g.fillStyle(0x1a1a1a, 1); g.fillRect(cx-16, cy-10, 32, 14);
    g.lineStyle(1, 0x333333, 0.5); g.lineBetween(cx-16, cy-4, cx+16, cy-4);
    // White headband + red circle
    g.fillStyle(0xeeeeee, 1); g.fillRect(cx-16, cy-22, 32, 7);
    g.fillStyle(0xcc1111, 1); g.fillCircle(cx, cy-18, 5);
    // Fierce eyes
    g.fillStyle(0xffffff, 1); g.fillRect(cx-13, cy-14, 10, 6); g.fillRect(cx+3, cy-14, 10, 6);
    g.fillStyle(0x000000, 1); g.fillRect(cx-11, cy-13, 6, 4); g.fillRect(cx+5, cy-13, 6, 4);
    g.fillStyle(0xff2222, 1); g.fillRect(cx-12, cy-15, 8, 2); g.fillRect(cx+4, cy-15, 8, 2);
    // Shuriken on chest
    g.fillStyle(0x888888, 1);
    g.fillRect(cx-1, cy+6, 3, 12); g.fillRect(cx-6, cy+11, 13, 3);
    g.fillCircle(cx+1, cy+12, 3);
    g.generateTexture('rock_ninja', 44, 60); g.destroy();
  }

  _trashCan() {
    const g = this._g();
    const cx = 22, cy = 34;
    // Legs (stubby)
    g.fillStyle(0x666666, 1); g.fillRect(cx-9, cy+22, 8, 14); g.fillRect(cx+1, cy+22, 8, 14);
    g.fillStyle(0x444444, 1); g.fillRect(cx-11, cy+34, 10, 6); g.fillRect(cx+1, cy+34, 10, 6);
    // Cylinder body
    g.fillStyle(0x787878, 1); g.fillRect(cx-14, cy-10, 28, 36);
    g.fillStyle(0x999999, 0.55); g.fillRect(cx-14, cy-10, 8, 36);
    g.fillStyle(0x555555, 0.5); g.fillRect(cx+7, cy-10, 7, 36);
    g.lineStyle(2, 0x555555, 0.7);
    g.lineBetween(cx-14, cy-1, cx+14, cy-1); g.lineBetween(cx-14, cy+10, cx+14, cy+10); g.lineBetween(cx-14, cy+21, cx+14, cy+21);
    // Dents / scratches
    g.lineStyle(2, 0x444444, 0.9); g.lineBetween(cx+4, cy+2, cx+10, cy+7); g.lineBetween(cx-8, cy+13, cx-4, cy+20);
    // Stub arms
    g.fillStyle(0x787878, 1); g.fillRect(cx-18, cy-4, 6, 16); g.fillRect(cx+12, cy-4, 6, 16);
    g.fillStyle(0x666666, 1); g.fillCircle(cx-15, cy+13, 5); g.fillCircle(cx+15, cy+13, 5);
    // Lid (slightly wider, darker)
    g.fillStyle(0x555555, 1); g.fillRect(cx-16, cy-12, 32, 8);
    g.fillStyle(0x444444, 1); g.fillRect(cx-16, cy-12, 32, 3);
    g.fillStyle(0x444444, 1); g.fillRect(cx-5, cy-18, 10, 8);
    g.fillStyle(0x666666, 1); g.fillRect(cx-4, cy-16, 8, 6);
    // Face — angry glowing eyes
    g.fillStyle(0x111111, 1); g.fillRect(cx-12, cy-9, 24, 10);
    g.fillStyle(0xffaa00, 1); g.fillCircle(cx-6, cy-4, 5); g.fillCircle(cx+6, cy-4, 5);
    g.fillStyle(0xff5500, 1); g.fillCircle(cx-6, cy-4, 3); g.fillCircle(cx+6, cy-4, 3);
    g.fillStyle(0x111111, 1); g.fillCircle(cx-5, cy-5, 1.5); g.fillCircle(cx+7, cy-5, 1.5);
    // Angry brow ridges
    g.fillStyle(0x444444, 1); g.fillRect(cx-10, cy-10, 8, 3); g.fillRect(cx+2, cy-10, 8, 3);
    // Trash peeking out top
    g.fillStyle(0x8b6914, 0.9); g.fillRect(cx-4, cy-20, 4, 9);
    g.fillStyle(0x2a8a2a, 0.9); g.fillRect(cx+2, cy-22, 3, 11);
    g.fillStyle(0xcc4422, 0.9); g.fillEllipse(cx-9, cy-17, 6, 8);
    g.generateTexture('trash_can', 44, 60); g.destroy();
  }

  _weaponModels() {
    let g = this._g();
    g.fillStyle(0x2255aa, 1); g.fillRect(30, 22, 180, 30);
    g.fillStyle(0x1a3d88, 1); g.fillRect(30, 24, 178, 12);
    g.fillStyle(0x111122, 1); g.fillCircle(210, 37, 18);
    g.fillStyle(0x0a0a1a, 1); g.fillCircle(210, 37, 11);
    g.fillStyle(0x1a1a2a, 1); g.fillRect(70, 52, 22, 26); g.fillRect(68, 50, 26, 6);
    g.fillStyle(0x3366cc, 1); g.fillRect(80, 18, 90, 6);
    g.fillStyle(0x4488ff, 1); g.fillRect(30, 50, 180, 3);
    g.generateTexture('gun_peel', 240, 80); g.destroy();

    g = this._g();
    g.fillStyle(0x8B6914, 1); g.fillRect(0, 24, 55, 26);
    g.fillStyle(0xc8920a, 1); g.fillRect(50, 20, 130, 26);
    g.fillStyle(0xd4a020, 1); g.fillRect(55, 14, 120, 10);
    g.fillStyle(0x3a2808, 1); g.fillRect(100, 46, 20, 26); g.fillRect(98, 44, 24, 6);
    g.fillStyle(0x888820, 1); g.fillRect(175, 24, 60, 12);
    g.fillStyle(0xb88010, 1); g.fillRect(140, 20, 40, 24);
    g.fillStyle(0xffcc00, 1); g.fillRect(50, 44, 130, 3);
    g.generateTexture('gun_rifle', 240, 76); g.destroy();

    g = this._g();
    g.fillStyle(0x3a2a18, 1); g.fillRect(0, 24, 60, 28);
    g.fillStyle(0x2a2a2a, 1); g.fillRect(55, 20, 110, 24);
    g.fillStyle(0x1a1a1a, 1); g.fillRect(100, 44, 18, 24); g.fillRect(98, 42, 22, 6);
    g.fillStyle(0x222222, 1); g.fillRect(110, 50, 20, 20);
    g.fillStyle(0x1e1e1e, 1); g.fillRect(160, 24, 120, 14);
    g.fillStyle(0x383838, 1); g.fillRect(272, 20, 12, 22);
    g.fillStyle(0x111111, 1); g.fillRect(112, 8, 85, 14);
    g.fillStyle(0x002244, 1); g.fillCircle(118, 15, 7); g.fillCircle(193, 15, 9);
    g.fillStyle(0x0033aa, 0.4); g.fillCircle(118, 15, 5); g.fillCircle(193, 15, 6);
    g.fillStyle(0xaa44ff, 1); g.fillRect(55, 42, 110, 3);
    g.generateTexture('gun_sniper', 288, 72); g.destroy();
  }
}
