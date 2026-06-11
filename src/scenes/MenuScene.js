import Phaser from 'phaser';

// ── Persistent save helpers ────────────────────────────────────────────────
const SAVE_KEY = 'bananaBlasterSave';
function loadSave()        { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } }
function writeSave(data)   { try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {} }
function getSavedCoins()      { return loadSave().coins        || 0; }
function getSavedUpgrades()   { return loadSave().upgrades     || [[0,0,0],[0,0,0],[0,0,0]]; }
function getSavedChar()       { return loadSave().character    || 'banana'; }
function getSavedUnlocked()   { return loadSave().unlocked     || ['banana']; }
function getSavedBoomDrops()  { return loadSave().boomDrops    || 0; }
function getSavedBoomDate()   { return loadSave().boomDate     || ''; }
function saveCoins(c)         { writeSave({ ...loadSave(), coins: c }); }
function saveUpgrades(ups)    { writeSave({ ...loadSave(), upgrades: ups }); }
function saveCharacter(k)     { writeSave({ ...loadSave(), character: k }); }
function saveUnlocked(arr)    { writeSave({ ...loadSave(), unlocked: arr }); }
function saveBoomDrops(n)     { writeSave({ ...loadSave(), boomDrops: n }); }
function saveBoomDate(d)      { writeSave({ ...loadSave(), boomDate: d }); }

const SW = 800, SH = 600;

const CHARACTERS = [
  // STARTER
  { key: 'banana',       name: 'Banana',    subtitle: '(Default)', price: 0,    ability: 'PEEL TRAP',      rarity: 'STARTER', rarityColor: '#aaaaaa', gun: 'Peel Launcher',    gunIcon: '🍌' },
  // RARE
  { key: 'sloth_pirate', name: 'Sloth',     subtitle: 'Pirate',    price: 1000, ability: 'CANNONBALL',     rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Flintlock',        gunIcon: '🔫' },
  { key: 'hot_dog',      name: 'Hot Dog',   subtitle: '',          price: 1000, ability: 'MUSTARD BLAST',  rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Mustard Gun',      gunIcon: '🌭' },
  { key: 'cactus',       name: 'Cactus',    subtitle: '',          price: 1000, ability: 'SPIKE BURST',    rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Thorn Shooter',    gunIcon: '🌵' },
  { key: 'ghost',        name: 'Ghost',     subtitle: '',          price: 1000, ability: 'SOUL SCREAM',    rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Spook Blaster',    gunIcon: '👻' },
  { key: 'astronaut',    name: 'Astronaut', subtitle: '',          price: 1000, ability: 'GRAVITY BOMB',   rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Space Pistol',     gunIcon: '🚀' },
  { key: 'penguin',      name: 'Penguin',   subtitle: '',          price: 1000, ability: 'ICE SLIDE',      rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Snowball Cannon',  gunIcon: '🐧' },
  // EPIC
  { key: 'rock_ninja',   name: 'Rock',      subtitle: 'Ninja',     price: 2000, ability: 'SHURIKEN STORM', rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Shuriken',         gunIcon: '⚡' },
  { key: 'viking',       name: 'Viking',    subtitle: '',          price: 2000, ability: 'BERSERKER',      rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Axe Launcher',     gunIcon: '🪓' },
  { key: 'robot',        name: 'Robot',     subtitle: '',          price: 2000, ability: 'LASER BEAM',     rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Plasma Rifle',     gunIcon: '🤖' },
  { key: 'wizard',       name: 'Wizard',    subtitle: '',          price: 2000, ability: 'METEOR STORM',   rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Magic Staff',      gunIcon: '🧙' },
  { key: 'shark',        name: 'Shark',     subtitle: '',          price: 2000, ability: 'FEEDING FRENZY', rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Jaw Launcher',     gunIcon: '🦈' },
  // MYTHIC
  { key: 'trash_can',    name: 'Trash Can', subtitle: '',          price: 5000, ability: 'TRASH WAVE',     rarity: 'MYTHIC',  rarityColor: '#ff8800', gun: 'Junk Cannon',      gunIcon: '🗑️' },
  { key: 'dragon',       name: 'Dragon',    subtitle: '',          price: 5000, ability: 'FIRE BREATH',    rarity: 'MYTHIC',  rarityColor: '#ff8800', gun: 'Inferno Blaster',  gunIcon: '🐲' },
  // ???
  { key: 'mystery',      name: '???',       subtitle: '',          price: 10000,ability: 'OBLITERATE',     rarity: '???',     rarityColor: '#ff00ff', gun: 'Void Cannon',      gunIcon: '❓' },
];

const WEAPON_NAMES  = ['Peel Launcher', 'Automatic Rifle', 'Sniper'];
const WEAPON_COLORS = ['#c8960a', '#4caf50', '#2196f3'];
const UPGRADES = [
  { key: 'damage', label: 'DAMAGE',    costs: [30, 60, 100] },
  { key: 'speed',  label: 'FIRE RATE', costs: [50, 90, 140] },
  { key: 'ammo',   label: 'AMMO',      costs: [40, 70, 110] },
];

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    this.selectedChar  = getSavedChar();
    this.add.rectangle(SW / 2, SH / 2, SW, SH, 0x0d1f08);

    this.menuItems    = [];
    this.shopItems    = [];
    this.charItems    = [];
    this.boomItems    = [];

    // Daily Boom Drop gift — 2 free drops each new calendar day
    const today = new Date().toDateString();
    if (getSavedBoomDate() !== today) {
      saveBoomDate(today);
      saveBoomDrops(getSavedBoomDrops() + 2);
    }

    this._buildMenu();
    this._buildShopPanel();
    this._buildCharPanel();
    this._showMenu();
  }

  // ── Main menu ──────────────────────────────────────────────────────────────
  _buildMenu() {
    const push = (...els) => { this.menuItems.push(...els); return els[0]; };

    // Title
    const title = push(this.add.text(SW / 2, 60, 'GUN STARS', {
      fontSize: '50px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000000', strokeThickness: 10,
    }).setOrigin(0.5));
    this.tweens.add({ targets: title, alpha: { from: 0.82, to: 1 }, duration: 950, yoyo: true, repeat: -1 });

    push(this.add.text(SW / 2, 114, 'Bananas vs Raccoons — Survive the waves!', {
      fontSize: '17px', fontFamily: 'Arial', color: '#aaffaa',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5));

    // ── Currently selected character preview ─────────────────────────────────
    push(this.add.rectangle(SW / 2, 248, 220, 130, 0x000000, 0.45)
      .setStrokeStyle(2, 0x336633, 0.6));
    push(this.add.text(SW / 2, 188, 'ACTIVE CHARACTER', {
      fontSize: '12px', fontFamily: 'Arial Black', color: '#aaaaaa',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5));

    // Sprite preview — small icon so it doesn't dominate the screen
    this.previewSpr = push(this.add.image(SW / 2 - 60, 248, this.selectedChar).setScale(1.5));
    this.previewNameTxt = push(this.add.text(SW / 2 + 10, 234, '', {
      fontSize: '14px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0, 0.5));
    this.previewAbilityTxt = push(this.add.text(SW / 2 + 10, 255, '', {
      fontSize: '10px', fontFamily: 'Arial Black', color: '#55ffaa',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0, 0.5));
    this._refreshPreview();

    // ── Instructions ──────────────────────────────────────────────────────────
    push(this.add.rectangle(SW / 2, 394, 700, 54, 0x000000, 0.45).setStrokeStyle(1, 0x336633, 0.5));
    [
      'WASD — Move  |  Mouse — Aim  |  SPACE/FIRE — Shoot  |  1/2/3 — Weapons',
      'R — Reload   |  Q — Scope    |  E — Special Ability  |  U — Shop',
    ].forEach((line, i) => push(this.add.text(SW / 2, 382 + i * 22, line, {
      fontSize: '12px', fontFamily: 'Arial', color: '#bbbbbb',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5)));

    // ── Bank ──────────────────────────────────────────────────────────────────
    this.menuCoinText = push(this.add.text(SW / 2, 448, '', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5));
    this._refreshMenuCoins();

    // ── Three buttons: PLAY  CHARACTERS  SHOP ────────────────────────────────
    const btnY = 506, btnH = 52;

    const playBtn = push(this.add.rectangle(142, btnY, 200, btnH, 0x228822)
      .setStrokeStyle(3, 0x88ff88, 0.9).setInteractive().setDepth(1));
    push(this.add.text(142, btnY, '▶  PLAY', {
      fontSize: '22px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(2));
    playBtn.on('pointerover', () => playBtn.setFillStyle(0x33cc33));
    playBtn.on('pointerout',  () => playBtn.setFillStyle(0x228822));
    playBtn.on('pointerdown', () => this._go());
    this.input.keyboard.once('keydown-SPACE', () => this._go());
    this.input.keyboard.once('keydown-ENTER', () => this._go());

    const charBtn = push(this.add.rectangle(400, btnY, 210, btnH, 0x1a2a6c)
      .setStrokeStyle(3, 0x66aaff, 0.9).setInteractive().setDepth(1));
    push(this.add.text(400, btnY, '🎮  CHARACTERS', {
      fontSize: '19px', fontFamily: 'Arial Black', color: '#aaddff',
      stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(2));
    charBtn.on('pointerover', () => charBtn.setFillStyle(0x2a3a9c));
    charBtn.on('pointerout',  () => charBtn.setFillStyle(0x1a2a6c));
    charBtn.on('pointerdown', () => this._openCharPanel());

    const shopBtn = push(this.add.rectangle(658, btnY, 200, btnH, 0x886600)
      .setStrokeStyle(3, 0xffcc00, 0.8).setInteractive().setDepth(1));
    push(this.add.text(658, btnY, '🛒  SHOP', {
      fontSize: '22px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(2));
    shopBtn.on('pointerover', () => shopBtn.setFillStyle(0xaa8800));
    shopBtn.on('pointerout',  () => shopBtn.setFillStyle(0x886600));
    shopBtn.on('pointerdown', () => this._openShop());

    push(this.add.text(SW / 2, 558, 'Press SPACE or ENTER to play', {
      fontSize: '12px', fontFamily: 'Arial', color: '#555555',
    }).setOrigin(0.5));

    this._buildBoomDropButton();
  }

  // ── Character panel (overlay) ──────────────────────────────────────────────
  _buildCharPanel() {
    for (const el of (this.charItems || [])) { try { el.destroy(); } catch {} }
    this.charItems         = [];
    this.charTabContentItems = [];
    this.charBoxBorders    = [];
    if (!this.charActiveTab) this.charActiveTab = 'STARTER';

    const add = el => { this.charItems.push(el); return el; };

    const PW = 780, PH = 510;
    const PX = SW / 2, PY = SH / 2;

    // Dim overlay + panel background
    add(this.add.rectangle(PX, SH / 2, SW, SH, 0x000000, 0.75).setDepth(9));
    add(this.add.rectangle(PX, PY, PW, PH, 0x081408).setDepth(10).setStrokeStyle(2, 0x338833, 0.9));

    // Header
    add(this.add.text(PX - PW / 2 + 18, PY - PH / 2 + 24, '🎮  SELECT CHARACTER', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0, 0.5).setDepth(11));

    this.charPanelCoinTxt = add(this.add.text(PX + PW / 2 - 14, PY - PH / 2 + 24, '💰 0', {
      fontSize: '18px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(1, 0.5).setDepth(11));

    const hdiv = this.add.graphics().setDepth(11);
    hdiv.lineStyle(1, 0x336633, 0.7);
    hdiv.lineBetween(PX - PW / 2 + 12, PY - PH / 2 + 42, PX + PW / 2 - 12, PY - PH / 2 + 42);
    add(hdiv);

    // ── Rarity tab row ─────────────────────────────────────────────────────
    const TABS = [
      { id: 'STARTER', label: 'STARTER', color: '#aaaaaa', active: 0x2a2a2a, inactive: 0x111111 },
      { id: 'RARE',    label: 'RARE',    color: '#4488ff', active: 0x112244, inactive: 0x060e18 },
      { id: 'EPIC',    label: 'EPIC',    color: '#aa44ff', active: 0x22114a, inactive: 0x0c0618 },
      { id: 'MYTHIC',  label: 'MYTHIC',  color: '#ff8800', active: 0x3a1e00, inactive: 0x130900 },
      { id: '???',     label: '???',     color: '#ff00ff', active: 0x330033, inactive: 0x0d000d },
    ];
    const tabY   = PY - PH / 2 + 64;
    const tabW   = 136, tabH = 30;
    const tabGap = 14;
    const tabsTotal = TABS.length * tabW + (TABS.length - 1) * tabGap;
    const tabStartX = PX - tabsTotal / 2 + tabW / 2;

    this.tabButtons = {};
    TABS.forEach((tab, ti) => {
      const tx    = tabStartX + ti * (tabW + tabGap);
      const isActive = tab.id === this.charActiveTab;
      const tintHex  = parseInt(tab.color.slice(1), 16);
      const bg = add(this.add.rectangle(tx, tabY, tabW, tabH, isActive ? tab.active : tab.inactive, 0.95)
        .setStrokeStyle(2, tintHex, isActive ? 1 : 0.35).setInteractive().setDepth(11));
      const txt = add(this.add.text(tx, tabY, tab.label, {
        fontSize: '12px', fontFamily: 'Arial Black',
        color: isActive ? tab.color : '#666666',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(12));
      this.tabButtons[tab.id] = { bg, txt, tab };
      bg.on('pointerdown', () => this._switchCharTab(tab.id));
      bg.on('pointerover',  () => { if (tab.id !== this.charActiveTab) bg.setFillStyle(tab.active, 0.6); });
      bg.on('pointerout',   () => { if (tab.id !== this.charActiveTab) bg.setFillStyle(tab.inactive, 0.95); });
    });

    const tabDiv = this.add.graphics().setDepth(11);
    tabDiv.lineStyle(1, 0x336633, 0.5);
    tabDiv.lineBetween(PX - PW / 2 + 12, PY - PH / 2 + 82, PX + PW / 2 - 12, PY - PH / 2 + 82);
    add(tabDiv);

    // ── BACK button ─────────────────────────────────────────────────────────
    const backBtn = add(this.add.rectangle(PX, PY + PH / 2 - 22, 210, 32, 0x553300, 0.9)
      .setStrokeStyle(2, 0xffaa44, 0.7).setInteractive().setDepth(11));
    add(this.add.text(PX, PY + PH / 2 - 22, '◀  BACK TO MENU', {
      fontSize: '14px', fontFamily: 'Arial Black', color: '#ffcc88',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(12));
    backBtn.on('pointerover', () => backBtn.setFillStyle(0x774400));
    backBtn.on('pointerout',  () => backBtn.setFillStyle(0x553300));
    backBtn.on('pointerdown', () => this._showMenu());

    // Build initial tab content
    this._buildCharTabContent();
    if (this.charPanelCoinTxt) this.charPanelCoinTxt.setText('💰 ' + getSavedCoins());
  }

  _switchCharTab(tabId) {
    this.charActiveTab = tabId;
    // Update tab button visuals
    const TABS = [
      { id: 'STARTER', color: '#aaaaaa', active: 0x2a2a2a, inactive: 0x111111 },
      { id: 'RARE',    color: '#4488ff', active: 0x112244, inactive: 0x060e18 },
      { id: 'EPIC',    color: '#aa44ff', active: 0x22114a, inactive: 0x0c0618 },
      { id: 'MYTHIC',  color: '#ff8800', active: 0x3a1e00, inactive: 0x130900 },
      { id: '???',     color: '#ff00ff', active: 0x330033, inactive: 0x0d000d },
    ];
    TABS.forEach(t => {
      const entry = this.tabButtons?.[t.id];
      if (!entry) return;
      const isActive = t.id === tabId;
      entry.bg.setFillStyle(isActive ? t.active : t.inactive, 0.95);
      entry.bg.setStrokeStyle(2, parseInt(t.color.slice(1), 16), isActive ? 1 : 0.35);
      entry.txt.setColor(isActive ? t.color : '#666666');
    });
    this._buildCharTabContent();
  }

  _buildCharTabContent() {
    // Destroy old content items (but keep frame items)
    for (const el of (this.charTabContentItems || [])) { try { el.destroy(); } catch {} }
    this.charTabContentItems = [];
    this.charBoxBorders = [];

    const addC = el => { this.charTabContentItems.push(el); return el; };

    const tab   = this.charActiveTab || 'STARTER';
    const chars = CHARACTERS.filter(c => c.rarity === tab);
    const n     = chars.length;
    if (n === 0) return;

    const PW = 780, PH = 510, PX = SW / 2, PY = SH / 2;
    // Content area: below tab divider (y=82 from top) to above back btn (y=40 from bottom)
    const CONTENT_TOP = PY - PH / 2 + 90;   // ~45
    const CONTENT_BOT = PY + PH / 2 - 50;   // ~505
    const CONTENT_CY  = (CONTENT_TOP + CONTENT_BOT) / 2;
    const CONTENT_H   = CONTENT_BOT - CONTENT_TOP; // ~460

    // Determine rows
    let rows;
    if (n <= 4)      { rows = [chars]; }
    else if (n === 5){ rows = [chars.slice(0, 3), chars.slice(3)]; }
    else             { rows = [chars.slice(0, 3), chars.slice(3, 6)]; }

    const numRows = rows.length;
    const BOX_H   = numRows === 1 ? Math.min(370, CONTENT_H - 10) : Math.floor((CONTENT_H - 12) / 2);
    const ROW_GAP = 12;
    const totalRowH = numRows * BOX_H + (numRows - 1) * ROW_GAP;
    const rowStartY = CONTENT_CY - totalRowH / 2 + BOX_H / 2;

    rows.forEach((rowChars, ri) => {
      const rowY = rowStartY + ri * (BOX_H + ROW_GAP);
      const nc   = rowChars.length;
      const BOX_W = Math.min(164, Math.floor((PW - 40) / nc) - 10);
      const totalW = nc * BOX_W + (nc - 1) * 10;
      const rowStartX = PX - totalW / 2 + BOX_W / 2;
      rowChars.forEach((ch, ci) => {
        const bx = rowStartX + ci * (BOX_W + 10);
        this._drawCharBox(addC, ch, bx, rowY, BOX_W, BOX_H);
      });
    });

    this._updateCharSelect();
  }

  _drawCharBox(addC, ch, bx, by, bw, bh) {
    const unlocked  = getSavedUnlocked().includes(ch.key);
    const coins     = getSavedCoins();
    const canAfford = coins >= ch.price;
    const compact   = bh < 200;

    const bg = addC(this.add.rectangle(bx, by, bw, bh, 0x000000, 0.45)
      .setStrokeStyle(2, 0x444444, 0.7).setDepth(11));
    const border = addC(this.add.rectangle(bx, by, bw, bh, 0x000000, 0)
      .setStrokeStyle(3, 0xffd700, 1).setDepth(12));
    this.charBoxBorders.push({ key: ch.key, border, bg });

    const sprScale = compact ? 1.7 : 2.5;
    const sprY     = compact ? by - bh / 2 + 40 : by - bh / 2 + 85;
    const spr = addC(this.add.image(bx, sprY, ch.key).setScale(sprScale).setDepth(12));
    if (!unlocked) spr.setTint(0x1a1a1a);

    const label  = ch.name + (ch.subtitle ? ' ' + ch.subtitle : '');
    const nameY  = compact ? by - bh / 2 + 88 : by - bh / 2 + 165;
    addC(this.add.text(bx, nameY, label, {
      fontSize: compact ? '10px' : '13px', fontFamily: 'Arial Black',
      color: unlocked ? '#ffffff' : '#555555', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(12));

    if (!compact && unlocked) {
      // Ability badge
      const abilY = by - bh / 2 + 191;
      addC(this.add.rectangle(bx, abilY, bw - 16, 20, 0x003322, 0.85)
        .setStrokeStyle(1, 0x44ff88, 0.5).setDepth(12));
      addC(this.add.text(bx, abilY, `⚡ ${ch.ability}`, {
        fontSize: '9px', fontFamily: 'Arial Black', color: '#55ffaa', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(13));
      // Gun badge
      const gunY = by - bh / 2 + 215;
      addC(this.add.rectangle(bx, gunY, bw - 16, 20, 0x1a1a00, 0.85)
        .setStrokeStyle(1, 0xccaa00, 0.5).setDepth(12));
      addC(this.add.text(bx, gunY, `${ch.gunIcon} ${ch.gun}`, {
        fontSize: '9px', fontFamily: 'Arial Black', color: '#ffdd44', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(13));
    }

    const btnY = by + bh / 2 - (compact ? 18 : 22);
    const btnH = compact ? 26 : 30;

    if (unlocked) {
      const selBg = addC(this.add.rectangle(bx, btnY, bw - 16, btnH, 0x1a4c1a, 0.9)
        .setStrokeStyle(2, 0x66ee66, 0.7).setInteractive().setDepth(12));
      addC(this.add.text(bx, btnY, 'SELECT', {
        fontSize: compact ? '10px' : '12px', fontFamily: 'Arial Black', color: '#88ff88',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(13));
      selBg.on('pointerover', () => selBg.setFillStyle(0x2a7c2a));
      selBg.on('pointerout',  () => selBg.setFillStyle(0x1a4c1a));
      selBg.on('pointerdown', () => {
        this.selectedChar = ch.key; saveCharacter(ch.key);
        this._updateCharSelect(); this._refreshPreview();
      });
      bg.setInteractive();
      bg.on('pointerover', () => bg.setFillStyle(0x112211, 0.6));
      bg.on('pointerout',  () => bg.setFillStyle(0x000000, 0.45));
      bg.on('pointerdown', () => {
        this.selectedChar = ch.key; saveCharacter(ch.key);
        this._updateCharSelect(); this._refreshPreview();
      });
    } else {
      // Locked overlay
      const lockIconY = compact ? by - bh / 2 + 65 : by - bh / 2 + 120;
      addC(this.add.text(bx, lockIconY, '🔒', { fontSize: compact ? '20px' : '26px' })
        .setOrigin(0.5).setDepth(14));
      if (!compact) {
        addC(this.add.text(bx, lockIconY + 28, `${ch.price} 💰`, {
          fontSize: '12px', fontFamily: 'Arial Black',
          color: canAfford ? '#ffd700' : '#ff5555', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(14));
      }
      const buyColor = canAfford ? 0x1a5c1a : 0x3a1111;
      const buyBrdr  = canAfford ? 0x88ee88 : 0x884444;
      const buyBg = addC(this.add.rectangle(bx, btnY, bw - 16, btnH, buyColor, 0.9)
        .setStrokeStyle(2, buyBrdr, 0.8).setDepth(13));
      addC(this.add.text(bx, btnY, canAfford ? `💰 ${ch.price}` : `🔒 ${ch.price}`, {
        fontSize: compact ? '10px' : '12px', fontFamily: 'Arial Black',
        color: canAfford ? '#88ff88' : '#aa5555', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(14));
      if (canAfford) {
        buyBg.setInteractive();
        buyBg.on('pointerover', () => buyBg.setFillStyle(0x2a8c2a));
        buyBg.on('pointerout',  () => buyBg.setFillStyle(0x1a5c1a));
        buyBg.on('pointerdown', () => this._buyCharacter(ch.key, ch.price));
      }
    }
  }

  _buyCharacter(key, price) {
    const coins = getSavedCoins();
    if (coins < price) return;
    saveCoins(coins - price);
    const unlocked = getSavedUnlocked();
    if (!unlocked.includes(key)) { unlocked.push(key); saveUnlocked(unlocked); }
    this.selectedChar = key;
    saveCharacter(key);
    this._buildCharPanel();
    for (const el of this.charItems) el.setVisible(true);
    this._refreshMenuCoins();
    this._refreshPreview();
  }

  _updateCharSelect() {
    for (const { key, border, bg } of (this.charBoxBorders || [])) {
      const unlocked = getSavedUnlocked().includes(key);
      const sel = unlocked && key === this.selectedChar;
      border.setStrokeStyle(3, sel ? 0xffd700 : 0x444444, sel ? 1 : 0);
      if (unlocked) bg.setFillStyle(sel ? 0x1a3a1a : 0x000000, sel ? 0.65 : 0.45);
    }
  }

  _refreshPreview() {
    if (!this.previewSpr) return;
    const ch = CHARACTERS.find(c => c.key === this.selectedChar) || CHARACTERS[0];
    this.previewSpr.setTexture(ch.key);
    const label = ch.subtitle ? `${ch.name} ${ch.subtitle}` : ch.name;
    this.previewNameTxt.setText(label);
    this.previewAbilityTxt.setText(`⚡ ${ch.ability}`);
  }

  _refreshMenuCoins() {
    if (this.menuCoinText) this.menuCoinText.setText('💰 Bank: ' + getSavedCoins() + ' coins');
    if (this.charPanelCoinTxt) this.charPanelCoinTxt.setText('💰 ' + getSavedCoins());
  }

  // ── Navigation ──────────────────────────────────────────────────────────────
  _go() {
    this.cameras.main.fadeOut(280, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameScene'));
  }

  _showMenu() {
    for (const el of this.menuItems) el.setVisible(true);
    for (const el of this.charItems) el.setVisible(false);
    for (const el of (this.charTabContentItems || [])) el.setVisible(false);
    for (const el of this.shopItems) el.setVisible(false);
    for (const el of (this.boomItems || [])) el.setVisible(false);
    this._refreshMenuCoins();
    this._refreshPreview();
  }

  _openCharPanel() {
    this._buildCharPanel();
    for (const el of this.menuItems) el.setVisible(false);
    for (const el of this.charItems) el.setVisible(true);
    for (const el of (this.charTabContentItems || [])) el.setVisible(true);
    for (const el of this.shopItems) el.setVisible(false);
    if (this.charPanelCoinTxt) this.charPanelCoinTxt.setText('💰 ' + getSavedCoins());
  }

  _openShop() {
    this.shopTab = this.shopTab || 'WEAPONS';
    this._buildShopPanel();
    for (const el of this.menuItems) el.setVisible(false);
    for (const el of (this.charTabContentItems || [])) el.setVisible(false);
    for (const el of this.charItems) el.setVisible(false);
    for (const el of this.shopItems) el.setVisible(true);
  }

  // ── Boom Drop ──────────────────────────────────────────────────────────────
  _buildBoomDropButton() {
    const x = SW - 52, y = 52;
    const count = getSavedBoomDrops();

    // TNT icon
    this.boomBtn = this.add.image(x, y, 'tnt').setScale(1.5).setDepth(5)
      .setInteractive({ useHandCursor: true });
    this.menuItems.push(this.boomBtn);

    // "BOOM DROP" label
    this.boomLbl = this.add.text(x, y + 38, 'BOOM DROP', {
      fontSize: '9px', fontFamily: 'Arial Black', color: '#ff6600',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(5);
    this.menuItems.push(this.boomLbl);

    // Count badge
    this.boomBadge = this.add.text(x + 20, y - 22, `×${count}`, {
      fontSize: '13px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000000', strokeThickness: 3,
      backgroundColor: count > 0 ? '#cc0000' : '#444444',
      padding: { x: 4, y: 2 },
    }).setOrigin(0.5).setDepth(6);
    this.menuItems.push(this.boomBadge);

    // Daily badge (if drops available)
    if (count > 0) {
      this.boomDailyLbl = this.add.text(x, y - 40, '🎁 DAILY!', {
        fontSize: '11px', fontFamily: 'Arial Black', color: '#ffee00',
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(6);
      this.menuItems.push(this.boomDailyLbl);
      // Bounce the daily label
      this.tweens.add({
        targets: this.boomDailyLbl,
        y: { from: y - 40, to: y - 46 }, duration: 600, yoyo: true, repeat: -1,
      });
    }

    // Pulse tween on icon when drops available
    if (count > 0) {
      this.tweens.add({
        targets: this.boomBtn,
        angle: { from: -6, to: 6 }, duration: 180, yoyo: true, repeat: -1,
      });
    }

    this.boomBtn.on('pointerover', () => this.boomBtn.setScale(1.75));
    this.boomBtn.on('pointerout',  () => this.boomBtn.setScale(1.5));
    this.boomBtn.on('pointerdown', () => {
      if (getSavedBoomDrops() > 0) this._openBoomDrop();
    });
  }

  _refreshBoomBadge() {
    const count = getSavedBoomDrops();
    if (this.boomBadge) {
      this.boomBadge.setText(`×${count}`);
      this.boomBadge.setBackgroundColor(count > 0 ? '#cc0000' : '#444444');
    }
  }

  _openBoomDrop() {
    // Hide main menu, show boom drop panel
    for (const el of this.menuItems) el.setVisible(false);
    this.boomClickCount = 0;
    for (const el of (this.boomItems || [])) { try { el.destroy(); } catch {} }
    this.boomItems = [];
    const addB = el => { this.boomItems.push(el); return el; };

    const PX = SW / 2, PY = SH / 2;

    // Full dark overlay
    addB(this.add.rectangle(PX, PY, SW, SH, 0x000000, 0.92).setDepth(20));

    // Title
    const titleTxt = addB(this.add.text(PX, 55, '💥  BOOM DROP', {
      fontSize: '36px', fontFamily: 'Arial Black', color: '#ff4400',
      stroke: '#000000', strokeThickness: 6,
    }).setOrigin(0.5).setDepth(21));
    this.tweens.add({ targets: titleTxt, scaleX: { from:1, to:1.04 }, scaleY: { from:1, to:1.04 }, duration: 500, yoyo:true, repeat:-1 });

    // Remaining count
    this.boomRemainingTxt = addB(this.add.text(PX, 95, `${getSavedBoomDrops()} remaining today`, {
      fontSize: '14px', fontFamily: 'Arial Black', color: '#ff9966',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(21));

    // Big TNT block
    this.boomTntSpr = addB(this.add.image(PX, PY - 20, 'tnt')
      .setScale(5).setDepth(22).setInteractive({ useHandCursor: true }));

    // Crack graphics layer (drawn on top of TNT)
    this.boomCrackGfx = addB(this.add.graphics().setDepth(23));

    // 4 progress dots
    this.boomDots = [];
    for (let i = 0; i < 4; i++) {
      const dx = PX - 45 + i * 30, dy = PY + 150;
      const dot = addB(this.add.rectangle(dx, dy, 22, 22, 0x222222, 1)
        .setStrokeStyle(2, 0x555555, 0.8).setDepth(22));
      addB(this.add.text(dx, dy, `${i + 1}`, {
        fontSize: '11px', fontFamily: 'Arial Black', color: '#555555',
      }).setOrigin(0.5).setDepth(23));
      this.boomDots.push(dot);
    }

    // Instruction text
    this.boomInstrTxt = addB(this.add.text(PX, PY + 186, 'TAP THE TNT  4  TIMES!', {
      fontSize: '17px', fontFamily: 'Arial Black', color: '#ffaa00',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5).setDepth(22));

    // Pulse tween
    this.boomTntTween = this.tweens.add({
      targets: this.boomTntSpr,
      scaleX: { from: 5, to: 5.25 }, scaleY: { from: 5, to: 5.25 },
      duration: 550, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
    });

    // Back button
    const backBtn = addB(this.add.rectangle(PX, SH - 32, 160, 30, 0x553300, 0.9)
      .setStrokeStyle(2, 0xffaa44, 0.7).setInteractive().setDepth(22));
    addB(this.add.text(PX, SH - 32, '◀  BACK', {
      fontSize: '13px', fontFamily: 'Arial Black', color: '#ffcc88',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(23));
    backBtn.on('pointerover', () => backBtn.setFillStyle(0x774400));
    backBtn.on('pointerout',  () => backBtn.setFillStyle(0x553300));
    backBtn.on('pointerdown', () => this._closeBoomDrop());

    // Click handler on TNT
    this.boomTntSpr.on('pointerdown', () => this._boomTap());
    this.boomTntSpr.on('pointerover', () => this.boomTntSpr.setTint(0xff9977));
    this.boomTntSpr.on('pointerout',  () => this.boomTntSpr.clearTint());
  }

  _boomTap() {
    this.boomClickCount++;
    const n = this.boomClickCount;

    // Light up dot
    const dotColors = [0xff8800, 0xff6600, 0xff3300, 0xff0000];
    this.boomDots[n - 1].setFillStyle(dotColors[n - 1], 1)
      .setStrokeStyle(2, 0xffcc00, 1);

    // Screen shake + flash — grows more intense
    this.cameras.main.shake(100 + n * 40, 0.008 + n * 0.006);
    const flashR = [255, 255, 255, 255], flashG = [200, 150, 80, 30], flashB = [0, 0, 0, 0];
    this.cameras.main.flash(80 + n * 30, flashR[n-1], flashG[n-1], flashB[n-1], 0.18 + n * 0.07);

    // Scale pop on TNT
    if (this.boomTntTween) this.boomTntTween.stop();
    const baseScale = 5 + (n - 1) * 0.2;
    this.tweens.add({
      targets: this.boomTntSpr,
      scaleX: { from: baseScale * 1.35, to: baseScale },
      scaleY: { from: baseScale * 1.35, to: baseScale },
      duration: 220, ease: 'Bounce.easeOut',
      onComplete: () => {
        if (n < 4) {
          this.boomTntTween = this.tweens.add({
            targets: this.boomTntSpr,
            scaleX: { from: baseScale, to: baseScale + 0.25 },
            scaleY: { from: baseScale, to: baseScale + 0.25 },
            duration: 500, yoyo: true, repeat: -1, ease: 'Sine.easeInOut',
          });
        }
      },
    });

    // Draw progressive cracks
    this._drawCracks(n);

    // Update instruction text
    const msgs    = ['KEEP GOING!', 'ALMOST THERE! 🔥', 'ONE MORE!! 💥', ''];
    const colors  = ['#ffaa00', '#ff8800', '#ff4400', '#ff0000'];
    if (n < 4) this.boomInstrTxt.setText(msgs[n - 1]).setColor(colors[n - 1]);

    // On 4th tap — EXPLODE
    if (n === 4) {
      this.boomTntSpr.removeInteractive();
      this.boomInstrTxt.setText('💥  B O O M !  💥').setColor('#ff0000').setFontSize(28);
      this.time.delayedCall(120, () => this._boomExplode());
    }
  }

  _drawCracks(n) {
    const g = this.boomCrackGfx;
    const PX = SW / 2, PY = SH / 2 - 20;
    g.clear();

    // Crack set 1
    if (n >= 1) {
      g.lineStyle(3, 0x000000, 0.9);
      g.beginPath(); g.moveTo(PX - 18, PY - 55); g.lineTo(PX + 5, PY - 10); g.strokePath();
      g.beginPath(); g.moveTo(PX + 5, PY - 10); g.lineTo(PX - 30, PY + 5); g.strokePath();
      g.lineStyle(2, 0x330000, 0.6);
      g.beginPath(); g.moveTo(PX + 35, PY - 40); g.lineTo(PX + 20, PY - 5); g.strokePath();
    }
    // Crack set 2
    if (n >= 2) {
      g.lineStyle(4, 0x000000, 0.9);
      g.beginPath(); g.moveTo(PX - 45, PY + 20); g.lineTo(PX + 10, PY - 5); g.lineTo(PX + 45, PY + 35); g.strokePath();
      g.lineStyle(2, 0xff2200, 0.5);
      g.beginPath(); g.moveTo(PX - 10, PY + 35); g.lineTo(PX + 22, PY + 60); g.strokePath();
      g.beginPath(); g.moveTo(PX + 48, PY - 55); g.lineTo(PX + 28, PY - 20); g.strokePath();
      // Red inner glow
      g.fillStyle(0xff2200, 0.08); g.fillCircle(PX, PY, 80);
    }
    // Crack set 3
    if (n >= 3) {
      g.lineStyle(5, 0xff1100, 0.85);
      g.beginPath(); g.moveTo(PX - 55, PY - 30); g.lineTo(PX + 8, PY + 8); g.lineTo(PX + 55, PY - 50); g.strokePath();
      g.lineStyle(3, 0xff6600, 0.7);
      g.beginPath(); g.moveTo(PX - 8, PY - 70); g.lineTo(PX - 15, PY + 10); g.lineTo(PX + 15, PY + 55); g.strokePath();
      g.beginPath(); g.moveTo(PX + 20, PY + 5); g.lineTo(PX + 52, PY + 28); g.strokePath();
      // Heavy red glow
      g.fillStyle(0xff3300, 0.18); g.fillCircle(PX, PY, 100);
      g.fillStyle(0xff6600, 0.10); g.fillCircle(PX, PY, 130);
    }
  }

  _boomExplode() {
    const PX = SW / 2, PY = SH / 2 - 20;

    // Deduct one drop
    saveBoomDrops(getSavedBoomDrops() - 1);
    this._refreshBoomBadge();
    this.boomRemainingTxt.setText(`${getSavedBoomDrops()} remaining today`);

    // Explode the TNT outward
    this.tweens.add({
      targets: this.boomTntSpr,
      scaleX: 12, scaleY: 12, alpha: 0,
      duration: 380, ease: 'Power3',
    });
    this.boomCrackGfx.clear();

    // Big flash + shake
    this.cameras.main.flash(600, 255, 140, 0, 0.95);
    this.cameras.main.shake(500, 0.05);

    // Spawn flying debris sprites
    const debrisTextures = ['peel', 'pickup', 'shuriken', 'coin'];
    for (let i = 0; i < 14; i++) {
      const angle  = (i / 14) * Math.PI * 2 + Math.random() * 0.4;
      const speed  = 200 + Math.random() * 260;
      const tex    = debrisTextures[Math.floor(Math.random() * debrisTextures.length)];
      const debris = this.add.image(PX, PY, tex).setScale(0.8 + Math.random()).setDepth(24)
        .setTint([0xff4400, 0xffcc00, 0xff8800, 0xffffff][Math.floor(Math.random() * 4)]);
      this.boomItems.push(debris);
      this.tweens.add({
        targets: debris,
        x: PX + Math.cos(angle) * speed,
        y: PY + Math.sin(angle) * speed,
        angle: Math.random() * 720 - 360,
        alpha: 0, scaleX: 0.2, scaleY: 0.2,
        duration: 700 + Math.random() * 300,
        ease: 'Power2',
        onComplete: () => { try { debris.destroy(); } catch {} },
      });
    }

    // Roll and show reward after explosion settles
    this.time.delayedCall(750, () => {
      const reward = this._rollBoomDropReward();
      this._closeBoomDrop();
      this._showBoomDropResult(reward);
    });
  }

  _rollBoomDropReward() {
    // 40% RARE, 30% EPIC, 15% MYTHIC, 5% ???, 10% coins
    const roll = Math.random() * 100;
    let rarity;
    if      (roll < 5)  rarity = '???';
    else if (roll < 20) rarity = 'MYTHIC';
    else if (roll < 50) rarity = 'EPIC';
    else if (roll < 90) rarity = 'RARE';
    else                rarity = 'COINS';

    if (rarity === 'COINS') {
      const amount = 300;
      saveCoins(getSavedCoins() + amount);
      return { type: 'coins', amount, rarity };
    }
    const unlocked  = getSavedUnlocked();
    const available = CHARACTERS.filter(c => c.rarity === rarity && !unlocked.includes(c.key));
    if (available.length === 0) {
      const bonus = { '???': 3000, 'MYTHIC': 1500, 'EPIC': 800, 'RARE': 300 }[rarity] || 300;
      saveCoins(getSavedCoins() + bonus);
      return { type: 'coins', amount: bonus, alreadyOwned: true, rarity };
    }
    const char = available[Math.floor(Math.random() * available.length)];
    unlocked.push(char.key);
    saveUnlocked(unlocked);
    return { type: 'character', char, rarity };
  }

  _showBoomDropResult(reward) {
    const RARITY_COLORS = { '???':'#ff00ff','MYTHIC':'#ff8800','EPIC':'#aa44ff','RARE':'#4488ff','COINS':'#ffd700' };
    const colorStr = RARITY_COLORS[reward.rarity] || '#ffffff';
    const colorHex = parseInt(colorStr.slice(1), 16);
    const resultItems = [];
    const addR = el => { resultItems.push(el); return el; };
    const PX = SW / 2, PY = SH / 2;

    addR(this.add.rectangle(PX, PY, SW, SH, 0x000000, 0.82).setDepth(30));

    // Result card — slides in from top
    const card = addR(this.add.rectangle(PX, PY - 300, 400, 320, 0x06060e).setDepth(31)
      .setStrokeStyle(3, colorHex, 1));
    this.tweens.add({ targets: card, y: PY, duration: 450, ease: 'Back.easeOut' });

    // Rarity banner
    const banner = addR(this.add.rectangle(PX, PY - 300 - 130, 400, 40, colorHex, 0.25).setDepth(31));
    this.tweens.add({ targets: banner, y: PY - 130, duration: 450, ease: 'Back.easeOut' });
    const rarityTxt = addR(this.add.text(PX, PY - 300 - 130, reward.rarity, {
      fontSize: '24px', fontFamily: 'Arial Black', color: colorStr,
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(32));
    this.tweens.add({ targets: rarityTxt, y: PY - 130, duration: 450, ease: 'Back.easeOut' });

    if (reward.type === 'character') {
      const spr = addR(this.add.image(PX, PY - 300 - 30, reward.char.key).setScale(2.6).setDepth(32));
      this.tweens.add({ targets: spr, y: PY - 30, duration: 450, ease: 'Back.easeOut' });
      const nameTxt = addR(this.add.text(PX, PY - 300 + 70, reward.char.name + (reward.char.subtitle ? ' '+reward.char.subtitle : ''), {
        fontSize: '20px', fontFamily: 'Arial Black', color: '#ffffff', stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5).setDepth(32));
      this.tweens.add({ targets: nameTxt, y: PY + 70, duration: 450, ease: 'Back.easeOut' });
      const unlockedTxt = addR(this.add.text(PX, PY - 300 + 96, '✨  CHARACTER UNLOCKED!', {
        fontSize: '13px', fontFamily: 'Arial Black', color: '#55ff88', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(32));
      this.tweens.add({ targets: unlockedTxt, y: PY + 96, duration: 450, ease: 'Back.easeOut' });
    } else {
      const coinTxt = addR(this.add.text(PX, PY - 300 - 20, '💰', { fontSize: '60px' }).setOrigin(0.5).setDepth(32));
      this.tweens.add({ targets: coinTxt, y: PY - 20, duration: 450, ease: 'Back.easeOut' });
      const msg = reward.alreadyOwned
        ? `All ${reward.rarity} owned!\n+${reward.amount} coins`
        : `+${reward.amount} coins`;
      const coinAmt = addR(this.add.text(PX, PY - 300 + 70, msg, {
        fontSize: '18px', fontFamily: 'Arial Black', color: '#ffd700',
        stroke: '#000', strokeThickness: 3, align: 'center',
      }).setOrigin(0.5).setDepth(32));
      this.tweens.add({ targets: coinAmt, y: PY + 70, duration: 450, ease: 'Back.easeOut' });
    }

    // Buttons (delayed so they appear after card slides in)
    this.time.delayedCall(500, () => {
      const hasMore = getSavedBoomDrops() > 0;

      if (hasMore) {
        const againBg = addR(this.add.rectangle(PX - 80, PY + 128, 144, 32, 0x882200, 0.95)
          .setStrokeStyle(2, 0xff6600, 0.9).setInteractive().setDepth(32));
        addR(this.add.text(PX - 80, PY + 128, '💥 OPEN AGAIN', {
          fontSize: '12px', fontFamily: 'Arial Black', color: '#ff9966', stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(33));
        againBg.on('pointerover', () => againBg.setFillStyle(0xbb3300));
        againBg.on('pointerout',  () => againBg.setFillStyle(0x882200));
        againBg.on('pointerdown', () => {
          for (const el of resultItems) { try { el.destroy(); } catch {} }
          this._showMenu();
          this._openBoomDrop();
        });
      }

      const okBg = addR(this.add.rectangle(hasMore ? PX + 80 : PX, PY + 128, 144, 32, 0x553300, 0.9)
        .setStrokeStyle(2, 0xffaa44, 0.7).setInteractive().setDepth(32));
      addR(this.add.text(hasMore ? PX + 80 : PX, PY + 128, '◀ BACK TO MENU', {
        fontSize: '11px', fontFamily: 'Arial Black', color: '#ffcc88', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(33));
      okBg.on('pointerover', () => okBg.setFillStyle(0x774400));
      okBg.on('pointerout',  () => okBg.setFillStyle(0x553300));
      okBg.on('pointerdown', () => {
        for (const el of resultItems) { try { el.destroy(); } catch {} }
        this._showMenu();
      });
    });
  }

  _closeBoomDrop() {
    if (this.boomTntTween) { this.boomTntTween.stop(); this.boomTntTween = null; }
    for (const el of (this.boomItems || [])) { try { el.destroy(); } catch {} }
    this.boomItems = [];
    this._showMenu();
  }

  // ── Shop panel (WEAPONS | BOXES tabs) ────────────────────────────────────
  _buildShopPanel() {
    this.shopItems    = [];
    this.shopTabItems = [];
    this.shopBuyBtns  = [];
    if (!this.shopTab) this.shopTab = 'WEAPONS';

    const add = el => { this.shopItems.push(el); return el; };

    const PW = 640, PH = 510, PX = SW / 2, PY = SH / 2;

    // Panel frame
    add(this.add.rectangle(PX, PY, PW, PH, 0x111128).setDepth(10).setStrokeStyle(2, 0x5555cc, 0.9));

    // Header
    add(this.add.text(PX - PW / 2 + 18, PY - PH / 2 + 24, '🛒  SHOP', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0, 0.5).setDepth(11));

    this.shopCoinText = add(this.add.text(PX + PW / 2 - 16, PY - PH / 2 + 24, '💰 0', {
      fontSize: '18px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(1, 0.5).setDepth(11));

    // ── Tabs: WEAPONS | BOXES ──────────────────────────────────────────────
    const SHOP_TABS = [
      { id: 'WEAPONS', label: '⚙️  WEAPONS', activeColor: 0x1a2a50, inactiveColor: 0x0a1020, border: 0x5566cc },
      { id: 'BOXES',   label: '📦  BOXES',   activeColor: 0x2a1050, inactiveColor: 0x0a0820, border: 0x9955cc },
    ];
    const tabY = PY - PH / 2 + 54, tabW = 180, tabH = 28;
    const tabStartX = PX - (SHOP_TABS.length * tabW + (SHOP_TABS.length - 1) * 8) / 2 + tabW / 2;

    this.shopTabBtns = {};
    SHOP_TABS.forEach((t, i) => {
      const tx = tabStartX + i * (tabW + 8);
      const isActive = t.id === this.shopTab;
      const bg = add(this.add.rectangle(tx, tabY, tabW, tabH,
        isActive ? t.activeColor : t.inactiveColor, 0.95)
        .setStrokeStyle(2, t.border, isActive ? 1 : 0.35).setInteractive().setDepth(11));
      const txt = add(this.add.text(tx, tabY, t.label, {
        fontSize: '13px', fontFamily: 'Arial Black',
        color: isActive ? '#ffffff' : '#555577', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(12));
      this.shopTabBtns[t.id] = { bg, txt, t };
      bg.on('pointerdown', () => this._switchShopTab(t.id));
      bg.on('pointerover',  () => { if (t.id !== this.shopTab) bg.setFillStyle(t.activeColor, 0.6); });
      bg.on('pointerout',   () => { if (t.id !== this.shopTab) bg.setFillStyle(t.inactiveColor, 0.95); });
    });

    const tabDiv = this.add.graphics().setDepth(11);
    tabDiv.lineStyle(1, 0x334488, 0.6);
    tabDiv.lineBetween(PX - PW / 2 + 12, PY - PH / 2 + 72, PX + PW / 2 - 12, PY - PH / 2 + 72);
    add(tabDiv);

    // Back button
    const backBtn = add(this.add.rectangle(PX, PY + PH / 2 - 24, 200, 34, 0x553300, 0.9)
      .setStrokeStyle(2, 0xffaa44, 0.7).setInteractive().setDepth(11));
    add(this.add.text(PX, PY + PH / 2 - 24, '◀  BACK TO MENU', {
      fontSize: '14px', fontFamily: 'Arial Black', color: '#ffcc88',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(12));
    backBtn.on('pointerover', () => backBtn.setFillStyle(0x774400));
    backBtn.on('pointerout',  () => backBtn.setFillStyle(0x553300));
    backBtn.on('pointerdown', () => this._showMenu());

    this._buildShopTabContent();
  }

  _switchShopTab(tabId) {
    this.shopTab = tabId;
    const SHOP_TABS = [
      { id: 'WEAPONS', activeColor: 0x1a2a50, inactiveColor: 0x0a1020, border: 0x5566cc },
      { id: 'BOXES',   activeColor: 0x2a1050, inactiveColor: 0x0a0820, border: 0x9955cc },
    ];
    SHOP_TABS.forEach(t => {
      const entry = this.shopTabBtns?.[t.id];
      if (!entry) return;
      const isActive = t.id === tabId;
      entry.bg.setFillStyle(isActive ? t.activeColor : t.inactiveColor, 0.95);
      entry.bg.setStrokeStyle(2, t.border, isActive ? 1 : 0.35);
      entry.txt.setColor(isActive ? '#ffffff' : '#555577');
    });
    this._buildShopTabContent();
    if (this.shopCoinText) this.shopCoinText.setText('💰 ' + getSavedCoins());
  }

  _buildShopTabContent() {
    for (const el of (this.shopTabItems || [])) { try { el.destroy(); } catch {} }
    this.shopTabItems = [];
    this.shopBuyBtns  = [];
    const addT = el => { this.shopTabItems.push(el); this.shopItems.push(el); return el; };

    const PW = 640, PH = 510, PX = SW / 2, PY = SH / 2;
    const contentTop = PY - PH / 2 + 80;  // below tabs

    if (this.shopTab === 'WEAPONS') {
      // ── Weapon upgrades ──────────────────────────────────────────────────
      const lx    = PX - PW / 2 + 20;
      const secH  = 124;
      for (let wi = 0; wi < 3; wi++) {
        const secY = contentTop + wi * secH;
        addT(this.add.text(lx, secY + 8, WEAPON_NAMES[wi], {
          fontSize: '14px', fontFamily: 'Arial Black', color: WEAPON_COLORS[wi],
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0, 0.5).setDepth(11));

        if (wi < 2) {
          const sd = this.add.graphics().setDepth(11);
          sd.lineStyle(1, 0x333355, 0.7);
          sd.lineBetween(lx, secY + secH - 2, PX + PW / 2 - 20, secY + secH - 2);
          addT(sd);
        }

        for (let ui = 0; ui < 3; ui++) {
          const upg  = UPGRADES[ui];
          const rowY = secY + 30 + ui * 28;

          addT(this.add.text(lx + 8, rowY, upg.label, {
            fontSize: '12px', fontFamily: 'Arial Black', color: '#999999',
            stroke: '#000', strokeThickness: 2,
          }).setOrigin(0, 0.5).setDepth(11));

          const lvlTxt = addT(this.add.text(PX - 50, rowY, 'Lv 0/3', {
            fontSize: '12px', fontFamily: 'Arial', color: '#888888',
            stroke: '#000', strokeThickness: 2,
          }).setOrigin(0.5).setDepth(11));

          const costTxt = addT(this.add.text(PX + 70, rowY, '', {
            fontSize: '13px', fontFamily: 'Arial Black', color: '#ffd700',
            stroke: '#000', strokeThickness: 2,
          }).setOrigin(0.5).setDepth(11));

          const buyBtn = addT(this.add.rectangle(PX + PW / 2 - 54, rowY, 88, 24, 0x1a5c1a, 0.9)
            .setStrokeStyle(1, 0x88ee88, 0.6).setInteractive().setDepth(11));
          const buyTxt = addT(this.add.text(PX + PW / 2 - 54, rowY, 'BUY', {
            fontSize: '13px', fontFamily: 'Arial Black', color: '#88ff88',
            stroke: '#000', strokeThickness: 2,
          }).setOrigin(0.5).setDepth(12));

          buyBtn.on('pointerover', () => buyBtn.setFillStyle(0x2a8c2a));
          buyBtn.on('pointerout',  () => buyBtn.setFillStyle(0x1a5c1a));
          buyBtn.on('pointerdown', () => { this._buyUpgrade(wi, upg.key); this._refreshShop(); });

          this.shopBuyBtns.push({ weaponIdx: wi, type: upg.key, buyBtn, buyTxt, costTxt, lvlTxt });
        }
      }
      this._refreshShop();

    } else {
      // ── Mystery Boxes (two cards side-by-side) ────────────────────────────
      const coins = getSavedCoins();

      const BOX_DEFS = [
        {
          id: 'small', label: '📦 SMALL BOX', cost: 500,
          borderColor: 0x9955cc, glowColor: '#dd99ff',
          odds: [
            { label: '???',       color: '#ff00ff', pct: '0.1%' },
            { label: 'MYTHIC',    color: '#ff8800', pct: '1%'   },
            { label: 'EPIC',      color: '#aa44ff', pct: '5%'   },
            { label: 'RARE',      color: '#4488ff', pct: '10%'  },
            { label: '500 COINS', color: '#ffd700', pct: '83.9%'},
          ],
        },
        {
          id: 'big', label: '🎁 BIG BOX', cost: 1000,
          borderColor: 0xffaa00, glowColor: '#ffdd66',
          odds: [
            { label: '???',       color: '#ff00ff', pct: '1%'  },
            { label: 'MYTHIC',    color: '#ff8800', pct: '5%'  },
            { label: 'EPIC',      color: '#aa44ff', pct: '10%' },
            { label: 'RARE',      color: '#4488ff', pct: '20%' },
            { label: '500 COINS', color: '#ffd700', pct: '64%' },
          ],
        },
      ];

      // Card geometry
      const CARD_W = 282, CARD_H = 340;
      const gap    = 16;
      const card1X = PX - CARD_W / 2 - gap / 2;
      const card2X = PX + CARD_W / 2 + gap / 2;
      const cardY  = contentTop + CARD_H / 2 + 14;

      BOX_DEFS.forEach((box, bi) => {
        const cx = bi === 0 ? card1X : card2X;
        const canAfford = coins >= box.cost;

        // Card background
        addT(this.add.rectangle(cx, cardY, CARD_W, CARD_H, 0x0a0818, 0.96)
          .setStrokeStyle(2, box.borderColor, 0.85).setDepth(11));

        // Title
        addT(this.add.text(cx, cardY - CARD_H / 2 + 20, box.label, {
          fontSize: '16px', fontFamily: 'Arial Black', color: box.glowColor,
          stroke: '#000', strokeThickness: 3,
        }).setOrigin(0.5).setDepth(12));

        // Cost
        addT(this.add.text(cx, cardY - CARD_H / 2 + 40, `${box.cost} 💰 per box`, {
          fontSize: '12px', fontFamily: 'Arial', color: '#999999',
          stroke: '#000', strokeThickness: 1,
        }).setOrigin(0.5).setDepth(12));

        // Divider
        const dv = this.add.graphics().setDepth(12);
        dv.lineStyle(1, box.borderColor, 0.4);
        dv.lineBetween(cx - CARD_W / 2 + 12, cardY - CARD_H / 2 + 52,
                       cx + CARD_W / 2 - 12, cardY - CARD_H / 2 + 52);
        addT(dv);

        // Odds rows
        const rowStart = cardY - CARD_H / 2 + 68;
        box.odds.forEach((o, i) => {
          const oy = rowStart + i * 28;
          addT(this.add.text(cx - 100, oy, o.label, {
            fontSize: '12px', fontFamily: 'Arial Black', color: o.color,
            stroke: '#000', strokeThickness: 2,
          }).setOrigin(0, 0.5).setDepth(12));
          addT(this.add.text(cx + 68, oy, o.pct, {
            fontSize: '12px', fontFamily: 'Arial Black', color: '#dddddd',
            stroke: '#000', strokeThickness: 2,
          }).setOrigin(1, 0.5).setDepth(12));
        });

        // Open button
        const btnY = cardY + CARD_H / 2 - 28;
        const openBg = addT(this.add.rectangle(cx, btnY, CARD_W - 24, 36,
          canAfford ? (bi === 0 ? 0x5a1a7c : 0x7a4400) : 0x1a1122, 0.95)
          .setStrokeStyle(2, canAfford ? box.borderColor : 0x332244, 0.9).setDepth(12));
        addT(this.add.text(cx, btnY,
          canAfford ? `OPEN  (${box.cost} 💰)` : `NEED ${box.cost} 💰`, {
            fontSize: '13px', fontFamily: 'Arial Black',
            color: canAfford ? box.glowColor : '#443355',
            stroke: '#000', strokeThickness: 2,
          }).setOrigin(0.5).setDepth(13));
        if (canAfford) {
          const hoverCol = bi === 0 ? 0x7a2aac : 0xaa6600;
          const baseCol  = bi === 0 ? 0x5a1a7c : 0x7a4400;
          openBg.setInteractive();
          openBg.on('pointerover', () => openBg.setFillStyle(hoverCol));
          openBg.on('pointerout',  () => openBg.setFillStyle(baseCol));
          openBg.on('pointerdown', () => this._rollBox(box.id));
        }
      });
    }
    if (this.shopCoinText) this.shopCoinText.setText('💰 ' + getSavedCoins());
  }

  _rollBox(boxId = 'small') {
    const cost = boxId === 'big' ? 1000 : 500;
    const coins = getSavedCoins();
    if (coins < cost) return;
    saveCoins(coins - cost);

    // Small box: 0.1% ???, 1% MYTHIC, 5% EPIC, 10% RARE, 83.9% = 500 coins
    // Big box:   1%   ???, 5% MYTHIC, 10% EPIC, 20% RARE, 64%   = 500 coins
    const roll = Math.random() * 1000; // use 1000 for 0.1% precision
    let rarity;
    if (boxId === 'big') {
      if      (roll < 10)  rarity = '???';
      else if (roll < 60)  rarity = 'MYTHIC';
      else if (roll < 160) rarity = 'EPIC';
      else if (roll < 360) rarity = 'RARE';
      else                 rarity = 'COINS_500';
    } else {
      if      (roll < 1)   rarity = '???';
      else if (roll < 11)  rarity = 'MYTHIC';
      else if (roll < 61)  rarity = 'EPIC';
      else if (roll < 161) rarity = 'RARE';
      else                 rarity = 'COINS_500';
    }

    let reward;
    if (rarity === 'COINS_500') {
      saveCoins(getSavedCoins() + 500);
      reward = { type: 'coins', amount: 500, rarity: 'COINS' };
    } else {
      const unlocked  = getSavedUnlocked();
      const available = CHARACTERS.filter(c => c.rarity === rarity && !unlocked.includes(c.key));
      if (available.length === 0) {
        const bonus = { '???': 3000, 'MYTHIC': 1500, 'EPIC': 800, 'RARE': 300 }[rarity] || 300;
        saveCoins(getSavedCoins() + bonus);
        reward = { type: 'coins', amount: bonus, alreadyOwned: true, rarity };
      } else {
        const char = available[Math.floor(Math.random() * available.length)];
        unlocked.push(char.key);
        saveUnlocked(unlocked);
        reward = { type: 'character', char, rarity };
      }
    }

    this._showBoxResult(reward, rarity, boxId);
  }

  _showBoxResult(reward, rarity, boxId = 'small') {
    const RARITY_COLORS = {
      '???': '#ff00ff', 'MYTHIC': '#ff8800', 'EPIC': '#aa44ff',
      'RARE': '#4488ff', 'COINS_500': '#ffd700', 'COINS': '#ffd700',
    };
    const colorStr = RARITY_COLORS[rarity] || '#ffffff';
    const colorHex = parseInt(colorStr.slice(1), 16);

    const PX = SW / 2, PY = SH / 2;
    const spinLabels = ['???', 'MYTHIC', 'EPIC', 'RARE', '1000 💰', '500 💰'];
    const spinColors = ['#ff00ff', '#ff8800', '#aa44ff', '#4488ff', '#ffd700', '#ccaa00'];
    let spinCount = 0;
    const totalSpins = 18;

    const dimBg  = this.add.rectangle(PX, PY, SW, SH, 0x000000, 0.65).setDepth(30);
    const spinBox = this.add.rectangle(PX, PY, 380, 110, 0x050510).setDepth(31).setStrokeStyle(2, 0x888888, 0.6);
    const spinTxt = this.add.text(PX, PY, '...', {
      fontSize: '34px', fontFamily: 'Arial Black', color: '#ffffff', stroke: '#000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(32);

    const spinTimer = this.time.addEvent({
      delay: 55, repeat: totalSpins - 1,
      callback: () => {
        spinCount++;
        const idx = spinCount % spinLabels.length;
        spinTxt.setText(spinLabels[idx]).setColor(spinColors[idx]);
        if (spinCount > totalSpins - 5) spinTimer.delay = 130;
        if (spinCount === totalSpins - 1) {
          const finalLabel = rarity === 'COINS_500' ? '500 💰' : rarity;
          spinTxt.setText(finalLabel).setColor(colorStr);
          spinBox.setStrokeStyle(3, colorHex, 1);
        }
        if (spinCount >= totalSpins) {
          this.time.delayedCall(380, () => {
            dimBg.destroy(); spinBox.destroy(); spinTxt.destroy();
            this._showBoxCard(reward, rarity, colorStr, colorHex, boxId);
          });
        }
      },
    });
  }

  _showBoxCard(reward, rarity, colorStr, colorHex, boxId = 'small') {
    const resultItems = [];
    const addR = el => { resultItems.push(el); this.shopItems.push(el); return el; };
    const PX = SW / 2, PY = SH / 2;

    addR(this.add.rectangle(PX, PY, SW, SH, 0x000000, 0.72).setDepth(30));
    addR(this.add.rectangle(PX, PY, 380, 300, 0x06060e).setDepth(31).setStrokeStyle(3, colorHex, 1));

    // Rarity banner
    addR(this.add.rectangle(PX, PY - 118, 380, 36, colorHex, 0.2).setDepth(31));
    const displayRarity = rarity === 'COINS_500' ? '500 COINS' : rarity;
    addR(this.add.text(PX, PY - 118, displayRarity, {
      fontSize: '22px', fontFamily: 'Arial Black', color: colorStr, stroke: '#000000', strokeThickness: 4,
    }).setOrigin(0.5).setDepth(32));

    if (reward.type === 'character') {
      addR(this.add.image(PX, PY - 38, reward.char.key).setScale(2.4).setDepth(32));
      addR(this.add.text(PX, PY + 58, reward.char.name + (reward.char.subtitle ? ' ' + reward.char.subtitle : ''), {
        fontSize: '18px', fontFamily: 'Arial Black', color: '#ffffff', stroke: '#000', strokeThickness: 3,
      }).setOrigin(0.5).setDepth(32));
      addR(this.add.text(PX, PY + 82, '✨  CHARACTER UNLOCKED!', {
        fontSize: '12px', fontFamily: 'Arial Black', color: '#55ff88', stroke: '#000', strokeThickness: 2,
      }).setOrigin(0.5).setDepth(32));
    } else {
      addR(this.add.text(PX, PY - 28, '💰', { fontSize: '54px' }).setOrigin(0.5).setDepth(32));
      const msg = reward.alreadyOwned
        ? `Already own all ${reward.rarity}s!\n+${reward.amount} coins consolation`
        : `+${reward.amount} coins`;
      addR(this.add.text(PX, PY + 52, msg, {
        fontSize: '16px', fontFamily: 'Arial Black', color: '#ffd700',
        stroke: '#000', strokeThickness: 3, align: 'center',
      }).setOrigin(0.5).setDepth(32));
    }

    // Buttons
    const againBg = addR(this.add.rectangle(PX - 76, PY + 118, 136, 32, 0x5a1a7c, 0.9)
      .setStrokeStyle(2, 0xcc66ff, 0.8).setInteractive().setDepth(32));
    addR(this.add.text(PX - 76, PY + 118, '📦 OPEN AGAIN', {
      fontSize: '11px', fontFamily: 'Arial Black', color: '#dd99ff', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(33));
    againBg.on('pointerover', () => againBg.setFillStyle(0x7a2aac));
    againBg.on('pointerout',  () => againBg.setFillStyle(0x5a1a7c));
    againBg.on('pointerdown', () => {
      for (const el of resultItems) { try { el.destroy(); } catch {} }
      this.shopItems = this.shopItems.filter(e => !resultItems.includes(e));
      this._switchShopTab('BOXES');
      this._rollBox(boxId);
    });

    const backBg = addR(this.add.rectangle(PX + 76, PY + 118, 136, 32, 0x553300, 0.9)
      .setStrokeStyle(2, 0xffaa44, 0.7).setInteractive().setDepth(32));
    addR(this.add.text(PX + 76, PY + 118, '◀ BACK TO SHOP', {
      fontSize: '10px', fontFamily: 'Arial Black', color: '#ffcc88', stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5).setDepth(33));
    backBg.on('pointerover', () => backBg.setFillStyle(0x774400));
    backBg.on('pointerout',  () => backBg.setFillStyle(0x553300));
    backBg.on('pointerdown', () => {
      for (const el of resultItems) { try { el.destroy(); } catch {} }
      this.shopItems = this.shopItems.filter(e => !resultItems.includes(e));
      this._switchShopTab('BOXES');
    });
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
