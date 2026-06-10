import Phaser from 'phaser';

const SW = 800, SH = 600;
const WEAPON_NAMES  = ['Peel Launcher', 'Auto Rifle', 'Sniper'];
const WEAPON_COLORS = [0xb8860b, 0x2e7d22, 0x0066aa];

export class UIScene extends Phaser.Scene {
  constructor() { super('UIScene'); }

  create() {
    // ── Coin bank (top right) ──────────────────────────────────────────────
    this.coinsText = this.add.text(SW - 14, 10, '💰 0', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000000', strokeThickness: 4, align: 'right',
    }).setOrigin(1, 0).setDepth(20);

    // ── Score ──────────────────────────────────────────────────────────────
    this.scoreText = this.add.text(12, 10, 'Score: 0', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#e8e8e8',
      stroke: '#000000', strokeThickness: 4,
    }).setDepth(20);

    // ── Health ─────────────────────────────────────────────────────────────
    this.add.text(12, 38, 'HP', { fontSize: '12px', fontFamily: 'Arial Black', color: '#aaaaaa', stroke: '#000', strokeThickness: 2 }).setDepth(20);
    this.add.rectangle(116, 47, 204, 16, 0x111111, 0.85).setOrigin(0.5, 0.5).setDepth(19);
    this.healthBar = this.add.rectangle(14, 39, 200, 14, 0x33cc33).setOrigin(0, 0).setDepth(20);

    // ── Lives ──────────────────────────────────────────────────────────────
    this.hearts = [];
    for (let i = 0; i < 3; i++) {
      this.hearts.push(this.add.image(14 + i * 28, 66, 'heart').setOrigin(0, 0.5).setDepth(20).setScale(0.85));
    }

    // ── Ammo (bottom right) ────────────────────────────────────────────────
    this.ammoText = this.add.text(SW - 14, SH - 100, '∞', {
      fontSize: '28px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000000', strokeThickness: 4, align: 'right',
    }).setOrigin(1, 1).setDepth(20);

    this.reloadBar = this.add.rectangle(SW - 14, SH - 100, 120, 8, 0xff8800).setOrigin(1, 1).setDepth(20).setVisible(false);
    this.reloadText = this.add.text(SW / 2, SH / 2 + 80, 'RELOADING', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#ff8800',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(20).setVisible(false);

    // ── Weapon gun model (bottom center) ──────────────────────────────────
    this.gunSprites = WEAPON_NAMES.map((_, i) => {
      const keys = ['gun_peel', 'gun_rifle', 'gun_sniper'];
      const yOff = [0, 5, 8];
      const s = this.add.image(SW / 2, SH - 30 + yOff[i], keys[i]).setOrigin(0.5, 1).setDepth(15).setVisible(i === 0);
      return s;
    });

    // ── Crosshair ──────────────────────────────────────────────────────────
    this.crosshair = this.add.graphics().setDepth(30);
    this._drawCrosshair(0);

    // ── Scope overlay ──────────────────────────────────────────────────────
    this.scopeOverlay = this.add.graphics().setDepth(25).setVisible(false);
    this.ironOverlay  = this.add.graphics().setDepth(25).setVisible(false);
    this._buildScopeOverlay();
    this._buildIronSights();

    // ── Weapon selector (bottom) ───────────────────────────────────────────
    this.weaponBtns = [];
    for (let i = 0; i < 3; i++) {
      const x = 205 + i * 135;
      const y = 570;
      const bg = this.add.rectangle(x, y, 122, 46, WEAPON_COLORS[i], 0.28)
        .setStrokeStyle(1, 0x555555, 0.5).setInteractive().setDepth(20);
      bg.on('pointerdown', () => { const gs = this.scene.get('GameScene'); if (gs) gs.switchWeapon(i); });
      const lbl = this.add.text(x, y - 4, WEAPON_NAMES[i], { fontSize: '11px', fontFamily: 'Arial Black', color: '#888888', stroke: '#000', strokeThickness: 2, align: 'center' }).setOrigin(0.5).setDepth(21);
      const hint = this.add.text(x, y + 12, `[${i + 1}]`, { fontSize: '11px', fontFamily: 'Arial', color: '#666666', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5).setDepth(21);
      this.weaponBtns.push({ bg, lbl, hint });
    }

    // ── SCOPE button ───────────────────────────────────────────────────────
    const scopeBtn = this.add.rectangle(SW - 70, SH - 180, 110, 38, 0x003366, 0.55)
      .setStrokeStyle(2, 0x4488cc, 0.7).setInteractive().setDepth(20);
    this.add.text(SW - 70, SH - 180, 'SCOPE [Q]', {
      fontSize: '12px', fontFamily: 'Arial Black', color: '#88bbff',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(21);
    scopeBtn.on('pointerdown', () => { const gs = this.scene.get('GameScene'); if (gs) gs.toggleScope(); });

    // ── FIRE button ────────────────────────────────────────────────────────
    const fireBtn = this.add.circle(SW - 70, SH - 110, 46, 0xcc1111, 0.5)
      .setStrokeStyle(3, 0xff6666, 0.65).setInteractive().setDepth(20);
    this.add.text(SW - 70, SH - 110, 'FIRE', { fontSize: '18px', fontFamily: 'Arial Black', color: '#ffffff', stroke: '#000', strokeThickness: 3 }).setOrigin(0.5).setDepth(21);
    fireBtn.on('pointerdown', () => { const gs = this.scene.get('GameScene'); if (gs) gs.isFiring = true; });
    fireBtn.on('pointerup',   () => { const gs = this.scene.get('GameScene'); if (gs) gs.isFiring = false; });
    fireBtn.on('pointerout',  () => { const gs = this.scene.get('GameScene'); if (gs) gs.isFiring = false; });

    // ── RELOAD button ──────────────────────────────────────────────────────
    const reloadBtn = this.add.rectangle(SW - 70, SH - 52, 100, 28, 0x333333, 0.6)
      .setStrokeStyle(1, 0x666666, 0.5).setInteractive().setDepth(20);
    this.add.text(SW - 70, SH - 52, 'RELOAD [R]', { fontSize: '10px', fontFamily: 'Arial Black', color: '#aaaaaa', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5).setDepth(21);
    reloadBtn.on('pointerdown', () => { const gs = this.scene.get('GameScene'); if (gs) gs._startReload(); });

    // ── SPECIAL ability button ─────────────────────────────────────────────
    this.specBg = this.add.rectangle(SW - 70, SH - 268, 110, 46, 0x003322, 0.75)
      .setStrokeStyle(2, 0x44ff88, 0.8).setInteractive().setDepth(20);
    this.specNameTxt = this.add.text(SW - 70, SH - 274, 'SPECIAL', {
      fontSize: '10px', fontFamily: 'Arial Black', color: '#55ffaa',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(21);
    this.add.text(SW - 70, SH - 261, '[E]', {
      fontSize: '10px', fontFamily: 'Arial', color: '#338855',
      stroke: '#000000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(21);
    // Cooldown track + bar
    this.add.rectangle(SW - 70, SH - 250, 104, 5, 0x001108, 0.95).setOrigin(0.5).setDepth(21);
    this.specCDBar = this.add.rectangle(SW - 123, SH - 250, 104, 5, 0x44ff88, 1)
      .setOrigin(0, 0.5).setDepth(22);
    this.specBg.on('pointerdown', () => { const gs = this.scene.get('GameScene'); if (gs) gs._useSpecial(); });

    // ── SHOP button ────────────────────────────────────────────────────────
    const shopBtn = this.add.rectangle(SW - 70, SH - 212, 110, 32, 0x886600, 0.7)
      .setStrokeStyle(2, 0xffcc00, 0.7).setInteractive().setDepth(20);
    this.add.text(SW - 70, SH - 212, 'SHOP [U]', {
      fontSize: '12px', fontFamily: 'Arial Black', color: '#ffcc00',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(21);
    shopBtn.on('pointerdown', () => { const gs = this.scene.get('GameScene'); if (gs) gs.toggleShop(); });

    // ── Virtual joystick ───────────────────────────────────────────────────
    this.joyBase  = this.add.image(110, 478, 'joy_base').setAlpha(0.28).setDepth(20);
    this.joyThumb = this.add.image(110, 478, 'joy_thumb').setAlpha(0.45).setDepth(21);

    // ── Shop overlay ───────────────────────────────────────────────────────
    this._buildShop();

    this.registry.events.on('changedata', this._onData, this);
    this._highlightWeapon(0);
  }

  _buildScopeOverlay() {
    const g = this.scopeOverlay;
    const cx = SW / 2, cy = SH / 2 - 30, r = 192;

    // ── Fortnite-style scope ──────────────────────────────────────────────
    // Solid black outer area (4 rectangles)
    g.fillStyle(0x000000, 1);
    g.fillRect(0, 0,     SW,      cy - r);          // top
    g.fillRect(0, cy+r,  SW,      SH - (cy+r));     // bottom
    g.fillRect(0, cy-r,  cx - r,  2 * r);           // left
    g.fillRect(cx+r, cy-r, SW-(cx+r), 2 * r);       // right

    // Very subtle blue tint inside lens area (Fortnite look)
    g.fillStyle(0x001a33, 0.12);
    g.fillCircle(cx, cy, r);

    // Thick outer lens ring (dark steel, Fortnite-accurate)
    g.lineStyle(14, 0x0a0a0a, 1);
    g.strokeCircle(cx, cy, r);
    g.lineStyle(4, 0x1a1a1a, 1);
    g.strokeCircle(cx, cy, r + 8);
    g.lineStyle(2, 0x2a2a2a, 0.6);
    g.strokeCircle(cx, cy, r + 13);

    // Inner ring highlight (glass edge glint)
    g.lineStyle(1, 0x334455, 0.5);
    g.strokeCircle(cx, cy, r - 6);

    // ── Fortnite crosshair — thin white lines, gap center, no dots ────────
    const gap = 16, len = r - 18;
    g.lineStyle(2, 0xffffff, 0.92);
    g.lineBetween(cx - len, cy,  cx - gap, cy);   // left arm
    g.lineBetween(cx + gap, cy,  cx + len, cy);   // right arm
    g.lineBetween(cx, cy - len,  cx, cy - gap);   // top arm
    g.lineBetween(cx, cy + gap,  cx, cy + len);   // bottom arm

    // Center dot (small, white — Fortnite bolt-action style)
    g.fillStyle(0xffffff, 0.95);
    g.fillCircle(cx, cy, 2.5);

    // Horizontal drop-line marks (Fortnite sniper bullet drop indicators)
    g.lineStyle(1, 0xffffff, 0.45);
    [55, 110, 170].forEach(o => {
      const w = o === 55 ? 14 : o === 110 ? 10 : 7;
      g.lineBetween(cx - w, cy + o, cx + w, cy + o);
    });
  }

  _buildIronSights() {
    // Fortnite ADS / iron-sight look — dark edge vignette, minimal overlay
    const g = this.ironOverlay;
    const cx = SW / 2, cy = SH / 2 - 20;

    // Edge vignette (Fortnite ADS darkens corners and edges)
    g.fillStyle(0x000000, 0.55);
    g.fillRect(0, 0,       SW,  90);
    g.fillRect(0, SH - 90, SW,  90);
    g.fillRect(0, 0,       100, SH);
    g.fillRect(SW - 100, 0, 100, SH);

    // Fortnite-style dot sight / front post
    g.fillStyle(0xff4400, 0.9);   // orange/red dot — like Fortnite red-dot
    g.fillCircle(cx, cy, 3);
    g.lineStyle(1, 0xff4400, 0.5);
    g.strokeCircle(cx, cy, 7);

    // Rear sight housing (subtle bracket)
    g.lineStyle(2, 0x555555, 0.6);
    g.lineBetween(cx - 30, cy + 18, cx - 14, cy + 18);
    g.lineBetween(cx + 14, cy + 18, cx + 30, cy + 18);
    g.lineBetween(cx - 30, cy + 10, cx - 30, cy + 18);
    g.lineBetween(cx + 30, cy + 10, cx + 30, cy + 18);
  }

  _drawCrosshair(mode) {
    this.crosshair.clear();
    const cx = SW / 2, cy = SH / 2 - 30;

    if (mode === 2) {
      // Sniper scoped — crosshair drawn inside scope overlay, nothing extra
    } else if (mode === 1) {
      // ADS / iron sights — Fortnite small dot already in ironOverlay, no extra lines
    } else {
      // Default hip-fire — Fortnite-style: 4 short lines + small center dot
      const gap = 8, arm = 14;
      // Thin black outline for visibility on any background
      this.crosshair.lineStyle(3, 0x000000, 0.4);
      this.crosshair.lineBetween(cx - gap - arm, cy, cx - gap, cy);
      this.crosshair.lineBetween(cx + gap, cy, cx + gap + arm, cy);
      this.crosshair.lineBetween(cx, cy - gap - arm, cx, cy - gap);
      this.crosshair.lineBetween(cx, cy + gap, cx, cy + gap + arm);
      // White lines on top
      this.crosshair.lineStyle(1, 0xffffff, 0.88);
      this.crosshair.lineBetween(cx - gap - arm, cy, cx - gap, cy);
      this.crosshair.lineBetween(cx + gap, cy, cx + gap + arm, cy);
      this.crosshair.lineBetween(cx, cy - gap - arm, cx, cy - gap);
      this.crosshair.lineBetween(cx, cy + gap, cx, cy + gap + arm);
    }
  }

  update() {
    const gs = this.scene.get('GameScene');
    if (!gs) return;
    if (gs.joystickActive) {
      this.joyThumb.setPosition(110 + gs.joystickDir.x * 34, 478 + gs.joystickDir.y * 34);
      this.joyBase.setAlpha(0.5);
    } else {
      this.joyThumb.setPosition(110, 478);
      this.joyBase.setAlpha(0.22);
    }
    // Update special ability cooldown bar
    if (this.specCDBar && gs.specialMaxCD) {
      const pct    = 1 - (gs.specialCD / gs.specialMaxCD);   // 0=just used, 1=ready
      const ready  = gs.specialCD <= 0;
      const barW   = Math.max(0, 104 * pct);
      this.specCDBar.setDisplaySize(barW, 5).setFillStyle(ready ? 0x44ff88 : 0xffaa00);
      this.specBg.setStrokeStyle(2, ready ? 0x44ff88 : 0xffaa00, ready ? 0.9 : 0.55);
    }
  }

  _onData(parent, key, value) {
    if (key === 'score') this.scoreText.setText(`Score: ${value}`);
    if (key === 'coins') this.coinsText.setText('💰 ' + value);
    if (key === 'shopOpen') {
      this._setShopVisible(!!value);
      if (value) this._refreshShop();
    }
    if (key === 'health') {
      const pct = value / 300;
      this.healthBar.setDisplaySize(Math.max(0, 200 * pct), 14);
      this.healthBar.setFillStyle(pct > 0.5 ? 0x33cc33 : pct > 0.25 ? 0xffaa00 : 0xff2222);
    }
    if (key === 'lives') this.hearts.forEach((h, i) => h.setAlpha(i < value ? 1 : 0.12));
    if (key === 'weapon') {
      this._highlightWeapon(value);
      this.gunSprites.forEach((s, i) => s.setVisible(i === value));
    }
    if (key === 'ammo') this.ammoText.setText(String(value));
    if (key === 'reloading') {
      this.reloadText.setVisible(!!value);
      this.reloadBar.setVisible(!!value);
    }
    if (key === 'scopeMode') {
      const mode = value;
      this.scopeOverlay.setVisible(mode === 2);
      this.ironOverlay.setVisible(mode === 1);
      this._drawCrosshair(mode);
    }
    if (key === 'specialName' && this.specNameTxt) {
      this.specNameTxt.setText(value);
    }
  }

  _buildShop() {
    const SW = 800, SH = 600;
    const PW = 612, PH = 444;
    const PX = SW / 2, PY = SH / 2;
    this.shopElements = [];
    this.shopBuyBtns  = [];

    // Dim overlay
    const ov = this.add.rectangle(PX, PY, SW, SH, 0x000000, 0.68).setDepth(48).setInteractive();
    this.shopElements.push(ov);

    // Panel
    const panel = this.add.rectangle(PX, PY, PW, PH, 0x111128).setDepth(49)
      .setStrokeStyle(2, 0x5555cc, 0.9);
    this.shopElements.push(panel);

    // Title
    const titleTxt = this.add.text(PX - PW / 2 + 16, PY - PH / 2 + 20, '🛒  WEAPON SHOP', {
      fontSize: '19px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0, 0.5).setDepth(50);
    this.shopElements.push(titleTxt);

    this.shopCoinText = this.add.text(PX + PW / 2 - 14, PY - PH / 2 + 20, '💰 0', {
      fontSize: '18px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(1, 0.5).setDepth(50);
    this.shopElements.push(this.shopCoinText);

    // Header divider
    const hdiv = this.add.graphics().setDepth(50);
    hdiv.lineStyle(1, 0x5555aa, 0.6);
    hdiv.lineBetween(PX - PW / 2 + 10, PY - PH / 2 + 36, PX + PW / 2 - 10, PY - PH / 2 + 36);
    this.shopElements.push(hdiv);

    const WNAMES  = ['Peel Launcher', 'Auto Rifle', 'Sniper'];
    const WCOLS   = ['#c8960a', '#4caf50', '#2196f3'];
    const UPGRADES = [
      { key: 'damage', label: 'DAMAGE',    costs: [30, 60, 100] },
      { key: 'speed',  label: 'FIRE RATE', costs: [50, 90, 140] },
      { key: 'ammo',   label: 'AMMO',      costs: [40, 70, 110] },
    ];

    const startY  = PY - PH / 2 + 52;
    const secH    = 124;
    const lx      = PX - PW / 2 + 18;

    for (let wi = 0; wi < 3; wi++) {
      const secY = startY + wi * secH;

      // Weapon name
      const wt = this.add.text(lx, secY + 10, WNAMES[wi], {
        fontSize: '13px', fontFamily: 'Arial Black', color: WCOLS[wi],
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0, 0.5).setDepth(50);
      this.shopElements.push(wt);

      // Section divider (between weapons)
      if (wi < 2) {
        const sd = this.add.graphics().setDepth(50);
        sd.lineStyle(1, 0x333355, 0.7);
        sd.lineBetween(lx, secY + secH - 2, PX + PW / 2 - 18, secY + secH - 2);
        this.shopElements.push(sd);
      }

      for (let ui = 0; ui < 3; ui++) {
        const upg  = UPGRADES[ui];
        const rowY = secY + 32 + ui * 28;

        const lbl = this.add.text(lx + 6, rowY, upg.label, {
          fontSize: '11px', fontFamily: 'Arial Black', color: '#999999',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5).setDepth(50);
        this.shopElements.push(lbl);

        const lvlTxt = this.add.text(PX - 60, rowY, 'Lv 0/3', {
          fontSize: '11px', fontFamily: 'Arial', color: '#888888',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5, 0.5).setDepth(50);
        this.shopElements.push(lvlTxt);

        const costTxt = this.add.text(PX + 60, rowY, '', {
          fontSize: '12px', fontFamily: 'Arial Black', color: '#ffd700',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5, 0.5).setDepth(50);
        this.shopElements.push(costTxt);

        const buyBtn = this.add.rectangle(PX + PW / 2 - 52, rowY, 84, 22, 0x1a5c1a, 0.9)
          .setStrokeStyle(1, 0x88ee88, 0.6).setInteractive().setDepth(50);
        const buyTxt = this.add.text(PX + PW / 2 - 52, rowY, 'BUY', {
          fontSize: '12px', fontFamily: 'Arial Black', color: '#88ff88',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(51);
        this.shopElements.push(buyBtn, buyTxt);

        buyBtn.on('pointerover', () => buyBtn.setFillStyle(0x2a8c2a));
        buyBtn.on('pointerout',  () => buyBtn.setFillStyle(0x1a5c1a));
        buyBtn.on('pointerdown', () => {
          const gs = this.scene.get('GameScene');
          if (gs) gs.buyUpgrade(wi, upg.key);
          this._refreshShop();
        });

        this.shopBuyBtns.push({ weaponIdx: wi, type: upg.key, buyBtn, buyTxt, costTxt, lvlTxt });
      }
    }

    // Close button
    const closeBtn = this.add.rectangle(PX + PW / 2 - 62, PY + PH / 2 - 22, 104, 32, 0x661111, 0.85)
      .setStrokeStyle(2, 0xff6666, 0.7).setInteractive().setDepth(50);
    const closeTxt = this.add.text(PX + PW / 2 - 62, PY + PH / 2 - 22, '✕  CLOSE', {
      fontSize: '14px', fontFamily: 'Arial Black', color: '#ff9999',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(51);
    closeBtn.on('pointerover', () => closeBtn.setFillStyle(0x992222));
    closeBtn.on('pointerout',  () => closeBtn.setFillStyle(0x661111));
    closeBtn.on('pointerdown', () => {
      const gs = this.scene.get('GameScene');
      if (gs) { gs.shopOpen = false; gs.registry.set('shopOpen', false); }
      this.scene.resume('GameScene');
    });
    this.shopElements.push(closeBtn, closeTxt);

    this._setShopVisible(false);
  }

  _setShopVisible(visible) {
    for (const el of this.shopElements) el.setVisible(visible);
  }

  _refreshShop() {
    const gs = this.scene.get('GameScene');
    if (!gs) return;
    const coins    = gs.player ? gs.player.coins : 0;
    const upgrades = gs.weaponUpgrades || [];
    if (this.shopCoinText) this.shopCoinText.setText('💰 ' + coins);

    const COSTS = { damage: [30,60,100], speed: [50,90,140], ammo: [40,70,110] };

    for (const e of this.shopBuyBtns) {
      const up    = upgrades[e.weaponIdx] || { damage: 0, speed: 0, ammo: 0 };
      const level = up[e.type] || 0;
      const maxed = level >= 3;
      const cost  = maxed ? 0 : COSTS[e.type][level];
      const canBuy = !maxed && coins >= cost;

      e.lvlTxt.setText(`Lv ${level}/3`).setColor(level >= 3 ? '#ffd700' : '#888888');
      e.costTxt.setText(maxed ? 'MAX' : `💰${cost}`).setColor(maxed ? '#666666' : (canBuy ? '#ffd700' : '#ff5555'));
      e.buyBtn.setFillStyle(maxed ? 0x333333 : (canBuy ? 0x1a5c1a : 0x4a1111), 0.9);
      e.buyTxt.setText(maxed ? '——' : 'BUY').setColor(maxed ? '#555555' : (canBuy ? '#88ff88' : '#ff7777'));
    }
  }

  _highlightWeapon(idx) {
    this.weaponBtns.forEach((btn, i) => {
      const on = i === idx;
      btn.bg.setFillStyle(WEAPON_COLORS[i], on ? 0.7 : 0.25);
      btn.bg.setStrokeStyle(on ? 2 : 1, on ? 0xaaaaaa : 0x444444, on ? 0.8 : 0.3);
      btn.lbl.setColor(on ? '#ffffff' : '#666666');
      btn.hint.setColor(on ? '#ccaa44' : '#444444');
    });
  }
}
