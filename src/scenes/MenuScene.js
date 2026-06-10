import Phaser from 'phaser';

// ── Persistent save helpers ────────────────────────────────────────────────
const SAVE_KEY = 'bananaBlasterSave';
function loadSave()        { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } }
function writeSave(data)   { try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {} }
function getSavedCoins()   { return loadSave().coins     || 0; }
function getSavedUpgrades(){ return loadSave().upgrades  || [[0,0,0],[0,0,0],[0,0,0]]; }
function getSavedChar()    { return loadSave().character || 'banana'; }
function saveCoins(c)      { writeSave({ ...loadSave(), coins: c }); }
function saveUpgrades(ups) { writeSave({ ...loadSave(), upgrades: ups }); }
function saveCharacter(k)  { writeSave({ ...loadSave(), character: k }); }

const SW = 800, SH = 600;

const CHARACTERS = [
  { key: 'banana',       name: 'Banana',       subtitle: '(Default)'      },
  { key: 'sloth_pirate', name: 'Sloth',         subtitle: 'Pirate'        },
  { key: 'rock_ninja',   name: 'Rock',          subtitle: 'Ninja'         },
  { key: 'trash_can',    name: 'Trash Can',     subtitle: ''              },
];

const WEAPON_NAMES  = ['Peel Launcher', 'Auto Rifle', 'Sniper'];
const WEAPON_COLORS = ['#c8960a', '#4caf50', '#2196f3'];
const UPGRADES = [
  { key: 'damage', label: 'DAMAGE',    costs: [30, 60, 100] },
  { key: 'speed',  label: 'FIRE RATE', costs: [50, 90, 140] },
  { key: 'ammo',   label: 'AMMO',      costs: [40, 70, 110] },
];

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    this.selectedChar = getSavedChar();
    this.add.rectangle(SW / 2, SH / 2, SW, SH, 0x0d1f08);

    // ── Build all views ────────────────────────────────────────────────────
    this.menuItems = [];
    this.shopItems = [];
    this._buildMenu();
    this._buildShopPanel();
    this._showMenu();
  }

  // ── Menu view ──────────────────────────────────────────────────────────────
  _buildMenu() {
    // Title
    const title = this.add.text(SW / 2, 58, 'BANANA BLASTER', {
      fontSize: '50px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000000', strokeThickness: 10,
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, alpha: { from: 0.82, to: 1 }, duration: 950, yoyo: true, repeat: -1 });
    this.menuItems.push(title);

    const sub = this.add.text(SW / 2, 110, 'Bananas vs Raccoons — Survive the waves!', {
      fontSize: '17px', fontFamily: 'Arial', color: '#aaffaa',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);
    this.menuItems.push(sub);

    // Character select header
    const cHdr = this.add.text(SW / 2, 148, 'SELECT YOUR CHARACTER', {
      fontSize: '16px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);
    this.menuItems.push(cHdr);

    // Character boxes — 4 across, centered
    // Total width: 4*165 + 3*10 = 690, left margin: (800-690)/2 = 55
    // Centers: 55+82=137, 137+175=312, 312+175=487, 487+175=662
    const BOX_CENTERS = [137, 312, 487, 662];
    const BOX_W = 165, BOX_H = 148, BOX_Y = 246;

    this.charBoxBorders = [];
    this.charSprites    = [];

    CHARACTERS.forEach((ch, i) => {
      const bx = BOX_CENTERS[i];

      // Box background
      const bg = this.add.rectangle(bx, BOX_Y, BOX_W, BOX_H, 0x000000, 0.45)
        .setStrokeStyle(3, 0x444444, 0.7).setInteractive();
      this.menuItems.push(bg);

      // Selection border (shown when selected)
      const border = this.add.rectangle(bx, BOX_Y, BOX_W, BOX_H, 0x000000, 0)
        .setStrokeStyle(4, 0xffd700, 1);
      this.menuItems.push(border);
      this.charBoxBorders.push({ key: ch.key, border, bg });

      // Character sprite (scaled up for portrait)
      const spr = this.add.image(bx, BOX_Y - 14, ch.key).setScale(2.0);
      this.menuItems.push(spr);
      this.charSprites.push(spr);

      // Name
      const nm = this.add.text(bx, BOX_Y + 52, ch.name, {
        fontSize: '14px', fontFamily: 'Arial Black', color: '#ffffff',
        stroke: '#000000', strokeThickness: 3,
      }).setOrigin(0.5);
      this.menuItems.push(nm);

      if (ch.subtitle) {
        const st = this.add.text(bx, BOX_Y + 68, ch.subtitle, {
          fontSize: '12px', fontFamily: 'Arial', color: '#aaaaaa',
          stroke: '#000000', strokeThickness: 2,
        }).setOrigin(0.5);
        this.menuItems.push(st);
      }

      // Click to select
      bg.on('pointerover', () => bg.setFillStyle(0x224422, 0.6));
      bg.on('pointerout',  () => bg.setFillStyle(0x000000, 0.45));
      bg.on('pointerdown', () => {
        this.selectedChar = ch.key;
        saveCharacter(ch.key);
        this._updateCharSelect();
      });
    });

    this._updateCharSelect();

    // Compact instructions
    const ibox = this.add.rectangle(SW / 2, 388, 580, 68, 0x000000, 0.45).setStrokeStyle(1, 0x336633, 0.5);
    this.menuItems.push(ibox);
    [
      'WASD/Arrows — Move   |   Mouse/Pointer — Aim   |   SPACE/FIRE — Shoot',
      '1/2/3 — Switch Weapons   |   R — Reload   |   Q — Sniper Scope   |   U — Shop',
    ].forEach((line, i) => {
      const t = this.add.text(SW / 2, 374 + i * 26, line, {
        fontSize: '13px', fontFamily: 'Arial', color: '#bbbbbb',
        stroke: '#000000', strokeThickness: 2,
      }).setOrigin(0.5);
      this.menuItems.push(t);
    });

    // Bank display
    this.menuCoinText = this.add.text(SW / 2, 440, '', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5);
    this.menuItems.push(this.menuCoinText);
    this._refreshMenuCoins();

    // PLAY button
    const playBtn = this.add.rectangle(SW / 2 - 135, 494, 228, 56, 0x228822)
      .setStrokeStyle(3, 0x88ff88, 0.9).setInteractive().setDepth(1);
    const playTxt = this.add.text(SW / 2 - 135, 494, '▶  PLAY', {
      fontSize: '26px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(2);
    playBtn.on('pointerover', () => playBtn.setFillStyle(0x33cc33));
    playBtn.on('pointerout',  () => playBtn.setFillStyle(0x228822));
    playBtn.on('pointerdown', () => this._go());
    this.input.keyboard.once('keydown-SPACE', () => this._go());
    this.input.keyboard.once('keydown-ENTER', () => this._go());
    this.menuItems.push(playBtn, playTxt);

    // SHOP button
    const shopBtn = this.add.rectangle(SW / 2 + 135, 494, 228, 56, 0x886600)
      .setStrokeStyle(3, 0xffcc00, 0.8).setInteractive().setDepth(1);
    const shopTxt = this.add.text(SW / 2 + 135, 494, '🛒  SHOP', {
      fontSize: '26px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(2);
    shopBtn.on('pointerover', () => shopBtn.setFillStyle(0xaa8800));
    shopBtn.on('pointerout',  () => shopBtn.setFillStyle(0x886600));
    shopBtn.on('pointerdown', () => this._openShop());
    this.menuItems.push(shopBtn, shopTxt);

    const hint = this.add.text(SW / 2, 545, 'Press SPACE to play  •  Tap a character to select', {
      fontSize: '12px', fontFamily: 'Arial', color: '#555555',
    }).setOrigin(0.5);
    this.menuItems.push(hint);
  }

  _updateCharSelect() {
    for (const { key, border, bg } of this.charBoxBorders) {
      const sel = key === this.selectedChar;
      border.setStrokeStyle(4, sel ? 0xffd700 : 0x444444, sel ? 1 : 0);
      bg.setFillStyle(sel ? 0x334400 : 0x000000, sel ? 0.6 : 0.45);
    }
  }

  _refreshMenuCoins() {
    if (this.menuCoinText) this.menuCoinText.setText('💰 Bank: ' + getSavedCoins() + ' coins');
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  _go() {
    this.cameras.main.fadeOut(280, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameScene'));
  }

  _showMenu() {
    for (const el of this.menuItems) el.setVisible(true);
    for (const el of this.shopItems) el.setVisible(false);
    this._refreshMenuCoins();
  }

  _openShop() {
    for (const el of this.menuItems) el.setVisible(false);
    for (const el of this.shopItems) el.setVisible(true);
    this._refreshShop();
  }

  // ── Shop panel ──────────────────────────────────────────────────────────────
  _buildShopPanel() {
    const PW = 620, PH = 490;
    const PX = SW / 2, PY = SH / 2;

    const bg = this.add.rectangle(PX, PY, PW, PH, 0x111128).setDepth(10)
      .setStrokeStyle(2, 0x5555cc, 0.9);
    this.shopItems.push(bg);

    const titleTxt = this.add.text(PX - PW / 2 + 18, PY - PH / 2 + 22, '🛒  WEAPON SHOP', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0, 0.5).setDepth(11);
    this.shopItems.push(titleTxt);

    this.shopCoinText = this.add.text(PX + PW / 2 - 16, PY - PH / 2 + 22, '💰 0', {
      fontSize: '19px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(1, 0.5).setDepth(11);
    this.shopItems.push(this.shopCoinText);

    const hdiv = this.add.graphics().setDepth(11);
    hdiv.lineStyle(1, 0x5555aa, 0.7);
    hdiv.lineBetween(PX - PW / 2 + 12, PY - PH / 2 + 38, PX + PW / 2 - 12, PY - PH / 2 + 38);
    this.shopItems.push(hdiv);

    this.shopBuyBtns = [];
    const startY = PY - PH / 2 + 56;
    const secH   = 132;
    const lx     = PX - PW / 2 + 20;

    for (let wi = 0; wi < 3; wi++) {
      const secY = startY + wi * secH;

      const wt = this.add.text(lx, secY + 10, WEAPON_NAMES[wi], {
        fontSize: '14px', fontFamily: 'Arial Black', color: WEAPON_COLORS[wi],
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0, 0.5).setDepth(11);
      this.shopItems.push(wt);

      if (wi < 2) {
        const sd = this.add.graphics().setDepth(11);
        sd.lineStyle(1, 0x333355, 0.7);
        sd.lineBetween(lx, secY + secH - 2, PX + PW / 2 - 20, secY + secH - 2);
        this.shopItems.push(sd);
      }

      for (let ui = 0; ui < 3; ui++) {
        const upg  = UPGRADES[ui];
        const rowY = secY + 34 + ui * 30;

        const lbl = this.add.text(lx + 8, rowY, upg.label, {
          fontSize: '12px', fontFamily: 'Arial Black', color: '#999999',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5).setDepth(11);
        this.shopItems.push(lbl);

        const lvlTxt = this.add.text(PX - 50, rowY, 'Lv 0/3', {
          fontSize: '12px', fontFamily: 'Arial', color: '#888888',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(11);
        this.shopItems.push(lvlTxt);

        const costTxt = this.add.text(PX + 70, rowY, '', {
          fontSize: '13px', fontFamily: 'Arial Black', color: '#ffd700',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(11);
        this.shopItems.push(costTxt);

        const buyBtn = this.add.rectangle(PX + PW / 2 - 54, rowY, 88, 24, 0x1a5c1a, 0.9)
          .setStrokeStyle(1, 0x88ee88, 0.6).setInteractive().setDepth(11);
        const buyTxt = this.add.text(PX + PW / 2 - 54, rowY, 'BUY', {
          fontSize: '13px', fontFamily: 'Arial Black', color: '#88ff88',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(12);
        this.shopItems.push(buyBtn, buyTxt);

        buyBtn.on('pointerover', () => buyBtn.setFillStyle(0x2a8c2a));
        buyBtn.on('pointerout',  () => buyBtn.setFillStyle(0x1a5c1a));
        buyBtn.on('pointerdown', () => {
          this._buyUpgrade(wi, upg.key);
          this._refreshShop();
        });

        this.shopBuyBtns.push({ weaponIdx: wi, type: upg.key, buyBtn, buyTxt, costTxt, lvlTxt });
      }
    }

    // Back button
    const backBtn = this.add.rectangle(PX, PY + PH / 2 - 24, 200, 34, 0x553300, 0.9)
      .setStrokeStyle(2, 0xffaa44, 0.7).setInteractive().setDepth(11);
    const backTxt = this.add.text(PX, PY + PH / 2 - 24, '◀  BACK TO MENU', {
      fontSize: '14px', fontFamily: 'Arial Black', color: '#ffcc88',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(12);
    backBtn.on('pointerover', () => backBtn.setFillStyle(0x774400));
    backBtn.on('pointerout',  () => backBtn.setFillStyle(0x553300));
    backBtn.on('pointerdown', () => this._showMenu());
    this.shopItems.push(backBtn, backTxt);
  }

  _buyUpgrade(weaponIdx, type) {
    const ups   = getSavedUpgrades().map(u => ({ damage: u[0], speed: u[1], ammo: u[2] }));
    const level = ups[weaponIdx][type];
    if (level >= 3) return;
    const cost  = UPGRADES.find(u => u.key === type).costs[level];
    const coins = getSavedCoins();
    if (coins < cost) return;
    ups[weaponIdx][type]++;
    saveCoins(coins - cost);
    saveUpgrades(ups.map(u => [u.damage, u.speed, u.ammo]));
  }

  _refreshShop() {
    const coins = getSavedCoins();
    const ups   = getSavedUpgrades().map(u => ({ damage: u[0], speed: u[1], ammo: u[2] }));
    if (this.shopCoinText) this.shopCoinText.setText('💰 ' + coins);

    for (const e of this.shopBuyBtns) {
      const level  = ups[e.weaponIdx][e.type] || 0;
      const maxed  = level >= 3;
      const upg    = UPGRADES.find(u => u.key === e.type);
      const cost   = maxed ? 0 : upg.costs[level];
      const canBuy = !maxed && coins >= cost;

      e.lvlTxt.setText(`Lv ${level}/3`).setColor(level >= 3 ? '#ffd700' : '#888888');
      e.costTxt.setText(maxed ? 'MAX' : `💰${cost}`).setColor(maxed ? '#666666' : (canBuy ? '#ffd700' : '#ff5555'));
      e.buyBtn.setFillStyle(maxed ? 0x333333 : (canBuy ? 0x1a5c1a : 0x4a1111), 0.9);
      e.buyTxt.setText(maxed ? '——' : 'BUY').setColor(maxed ? '#555555' : (canBuy ? '#88ff88' : '#ff7777'));
    }
  }
}
