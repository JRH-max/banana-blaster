import Phaser from 'phaser';

// ── Persistent save helpers ────────────────────────────────────────────────
const SAVE_KEY = 'bananaBlasterSave';
function loadSave()        { try { return JSON.parse(localStorage.getItem(SAVE_KEY)) || {}; } catch { return {}; } }
function writeSave(data)   { try { localStorage.setItem(SAVE_KEY, JSON.stringify(data)); } catch {} }
function getSavedCoins()   { return loadSave().coins     || 0; }
function getSavedUpgrades(){ return loadSave().upgrades  || [[0,0,0],[0,0,0],[0,0,0]]; }
function getSavedChar()    { return loadSave().character || 'banana'; }
function getSavedUnlocked(){ return loadSave().unlocked  || ['banana']; }
function saveCoins(c)      { writeSave({ ...loadSave(), coins: c }); }
function saveUpgrades(ups) { writeSave({ ...loadSave(), upgrades: ups }); }
function saveCharacter(k)  { writeSave({ ...loadSave(), character: k }); }
function saveUnlocked(arr) { writeSave({ ...loadSave(), unlocked: arr }); }

const SW = 800, SH = 600;

const CHARACTERS = [
  // STARTER
  { key: 'banana',       name: 'Banana',    subtitle: '(Default)', price: 0,    ability: 'PEEL TRAP',      rarity: 'STARTER', rarityColor: '#aaaaaa', gun: 'Peel Launcher',    gunIcon: '🍌' },
  // RARE
  { key: 'sloth_pirate', name: 'Sloth',     subtitle: 'Pirate',    price: 200,  ability: 'CANNONBALL',     rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Flintlock',        gunIcon: '🔫' },
  { key: 'hot_dog',      name: 'Hot Dog',   subtitle: '',          price: 200,  ability: 'MUSTARD BLAST',  rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Mustard Gun',      gunIcon: '🌭' },
  { key: 'cactus',       name: 'Cactus',    subtitle: '',          price: 200,  ability: 'SPIKE BURST',    rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Thorn Shooter',    gunIcon: '🌵' },
  { key: 'ghost',        name: 'Ghost',     subtitle: '',          price: 200,  ability: 'SOUL SCREAM',    rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Spook Blaster',    gunIcon: '👻' },
  { key: 'astronaut',    name: 'Astronaut', subtitle: '',          price: 200,  ability: 'GRAVITY BOMB',   rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Space Pistol',     gunIcon: '🚀' },
  { key: 'penguin',      name: 'Penguin',   subtitle: '',          price: 200,  ability: 'ICE SLIDE',      rarity: 'RARE',    rarityColor: '#4488ff', gun: 'Snowball Cannon',  gunIcon: '🐧' },
  // EPIC
  { key: 'rock_ninja',   name: 'Rock',      subtitle: 'Ninja',     price: 500,  ability: 'SHURIKEN STORM', rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Shuriken',         gunIcon: '⚡' },
  { key: 'viking',       name: 'Viking',    subtitle: '',          price: 500,  ability: 'BERSERKER',      rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Axe Launcher',     gunIcon: '🪓' },
  { key: 'robot',        name: 'Robot',     subtitle: '',          price: 500,  ability: 'LASER BEAM',     rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Plasma Rifle',     gunIcon: '🤖' },
  { key: 'wizard',       name: 'Wizard',    subtitle: '',          price: 500,  ability: 'METEOR STORM',   rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Magic Staff',      gunIcon: '🧙' },
  { key: 'shark',        name: 'Shark',     subtitle: '',          price: 500,  ability: 'FEEDING FRENZY', rarity: 'EPIC',    rarityColor: '#aa44ff', gun: 'Jaw Launcher',     gunIcon: '🦈' },
  // MYTHIC
  { key: 'trash_can',    name: 'Trash Can', subtitle: '',          price: 1000, ability: 'TRASH WAVE',     rarity: 'MYTHIC',  rarityColor: '#ff8800', gun: 'Junk Cannon',      gunIcon: '🗑️' },
  { key: 'dragon',       name: 'Dragon',    subtitle: '',          price: 1000, ability: 'FIRE BREATH',    rarity: 'MYTHIC',  rarityColor: '#ff8800', gun: 'Inferno Blaster',  gunIcon: '🐲' },
  // ???
  { key: 'mystery',      name: '???',       subtitle: '',          price: 3000, ability: 'OBLITERATE',     rarity: '???',     rarityColor: '#ff00ff', gun: 'Void Cannon',      gunIcon: '❓' },
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
    this.charItems    = [];   // character panel overlay

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
    const previewBox = push(this.add.rectangle(SW / 2, 255, 260, 200, 0x000000, 0.45)
      .setStrokeStyle(2, 0x336633, 0.6));
    push(this.add.text(SW / 2, 165, 'ACTIVE CHARACTER', {
      fontSize: '13px', fontFamily: 'Arial Black', color: '#aaaaaa',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5));

    // Sprite preview — rebuilt on scene entry
    this.previewSpr = push(this.add.image(SW / 2, 245, this.selectedChar).setScale(2.8));
    this.previewNameTxt = push(this.add.text(SW / 2, 320, '', {
      fontSize: '16px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000', strokeThickness: 3,
    }).setOrigin(0.5));
    this.previewAbilityTxt = push(this.add.text(SW / 2, 340, '', {
      fontSize: '11px', fontFamily: 'Arial Black', color: '#55ffaa',
      stroke: '#000', strokeThickness: 2,
    }).setOrigin(0.5));
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
    for (const el of this.shopItems) el.setVisible(false);
    this._refreshMenuCoins();
    this._refreshPreview();
  }

  _openCharPanel() {
    this._buildCharPanel();
    for (const el of this.menuItems) el.setVisible(false);
    for (const el of this.charItems) el.setVisible(true);
    for (const el of this.shopItems) el.setVisible(false);
    if (this.charPanelCoinTxt) this.charPanelCoinTxt.setText('💰 ' + getSavedCoins());
  }

  _openShop() {
    for (const el of this.menuItems) el.setVisible(false);
    for (const el of this.charItems) el.setVisible(false);
    for (const el of this.shopItems) el.setVisible(true);
    this._refreshShop();
  }

  // ── Weapon shop panel ──────────────────────────────────────────────────────
  _buildShopPanel() {
    const PW = 620, PH = 490;
    const PX = SW / 2, PY = SH / 2;

    this.shopItems.push(
      this.add.rectangle(PX, PY, PW, PH, 0x111128).setDepth(10).setStrokeStyle(2, 0x5555cc, 0.9)
    );

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
      this.shopItems.push(this.add.text(lx, secY + 10, WEAPON_NAMES[wi], {
        fontSize: '14px', fontFamily: 'Arial Black', color: WEAPON_COLORS[wi],
        stroke: '#000', strokeThickness: 2,
      }).setOrigin(0, 0.5).setDepth(11));

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

        const lvlTxt = this.add.text(PX - 50, rowY, 'Lv 0/3', {
          fontSize: '12px', fontFamily: 'Arial', color: '#888888',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(11);

        const costTxt = this.add.text(PX + 70, rowY, '', {
          fontSize: '13px', fontFamily: 'Arial Black', color: '#ffd700',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(11);

        const buyBtn = this.add.rectangle(PX + PW / 2 - 54, rowY, 88, 24, 0x1a5c1a, 0.9)
          .setStrokeStyle(1, 0x88ee88, 0.6).setInteractive().setDepth(11);
        const buyTxt = this.add.text(PX + PW / 2 - 54, rowY, 'BUY', {
          fontSize: '13px', fontFamily: 'Arial Black', color: '#88ff88',
          stroke: '#000', strokeThickness: 2,
        }).setOrigin(0.5).setDepth(12);

        this.shopItems.push(lbl, lvlTxt, costTxt, buyBtn, buyTxt);

        buyBtn.on('pointerover', () => buyBtn.setFillStyle(0x2a8c2a));
        buyBtn.on('pointerout',  () => buyBtn.setFillStyle(0x1a5c1a));
        buyBtn.on('pointerdown', () => { this._buyUpgrade(wi, upg.key); this._refreshShop(); });

        this.shopBuyBtns.push({ weaponIdx: wi, type: upg.key, buyBtn, buyTxt, costTxt, lvlTxt });
      }
    }

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
