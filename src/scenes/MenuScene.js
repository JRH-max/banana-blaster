import Phaser from 'phaser';

export class MenuScene extends Phaser.Scene {
  constructor() { super('MenuScene'); }

  create() {
    const SW = 800, SH = 600;
    this.add.rectangle(SW / 2, SH / 2, SW, SH, 0x0d1f08);

    // Animated title
    const title = this.add.text(SW / 2, 105, 'BANANA BLASTER', {
      fontSize: '54px', fontFamily: 'Arial Black', color: '#ffd700',
      stroke: '#000000', strokeThickness: 10,
    }).setOrigin(0.5);
    this.tweens.add({ targets: title, alpha: { from: 0.82, to: 1 }, duration: 950, yoyo: true, repeat: -1 });

    this.add.text(SW / 2, 163, 'Bananas vs Raccoons — Survive the waves!', {
      fontSize: '18px', fontFamily: 'Arial', color: '#aaffaa',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);

    // Instructions box
    this.add.rectangle(SW / 2, 358, 570, 306, 0x000000, 0.52).setStrokeStyle(2, 0x336633, 0.7);

    this.add.text(SW / 2, 226, 'HOW TO PLAY', {
      fontSize: '16px', fontFamily: 'Arial Black', color: '#ffdd44',
      stroke: '#000000', strokeThickness: 3,
    }).setOrigin(0.5);

    [
      'WASD / Arrow Keys — Move',
      'Mouse / Pointer — Aim at enemies',
      'SPACE / FIRE button — Shoot',
      '1 / 2 / 3 Keys — Switch Weapons',
      'R — Reload      Q — Sniper Scope',
      'Kill bots to earn COINS  💰',
      'Press U or tap SHOP to upgrade weapons',
      'Walk over ★ stars to restore health',
    ].forEach((line, i) => {
      this.add.text(SW / 2, 258 + i * 31, line, {
        fontSize: '15px', fontFamily: 'Arial', color: '#dddddd',
        stroke: '#000000', strokeThickness: 2,
      }).setOrigin(0.5);
    });

    // Play button
    const btn = this.add.rectangle(SW / 2, 534, 240, 58, 0x228822)
      .setStrokeStyle(3, 0x88ff88, 0.9).setInteractive().setDepth(1);
    this.add.text(SW / 2, 534, '▶  PLAY', {
      fontSize: '30px', fontFamily: 'Arial Black', color: '#ffffff',
      stroke: '#000000', strokeThickness: 5,
    }).setOrigin(0.5).setDepth(2);

    btn.on('pointerover', () => btn.setFillStyle(0x33cc33));
    btn.on('pointerout',  () => btn.setFillStyle(0x228822));
    btn.on('pointerdown', () => this._go());
    this.input.keyboard.once('keydown-SPACE', () => this._go());
    this.input.keyboard.once('keydown-ENTER', () => this._go());

    this.add.text(SW / 2, 581, 'Press SPACE or tap PLAY to start', {
      fontSize: '12px', fontFamily: 'Arial', color: '#555555',
    }).setOrigin(0.5);
  }

  _go() {
    this.cameras.main.fadeOut(280, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => this.scene.start('GameScene'));
  }
}
