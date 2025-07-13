import Phaser from 'phaser';

export class MainMenu extends Phaser.Scene {
  private grid!: Phaser.GameObjects.TileSprite;

  constructor() {
    super('MainMenu');
  }

  create() {
    const { width, height } = this.scale;

    // 🌌 Background color
    this.cameras.main.setBackgroundColor('#0d0f18');

    // 🔳 Draw grid onto a dynamic texture
    const gridGraphics = this.make.graphics({ x: 0, y: 0, add: false });
    const gridSize = 40;
    gridGraphics.lineStyle(1, 0x1f1f3a, 1);

    for (let x = 0; x <= width; x += gridSize) {
      gridGraphics.lineBetween(x, 0, x, height);
    }
    for (let y = 0; y <= height; y += gridSize) {
      gridGraphics.lineBetween(0, y, width, y);
    }

    // Generate a texture from the grid graphics
    gridGraphics.generateTexture('grid_texture', width, height);
    gridGraphics.destroy();

    // 🌀 Create scrollable tile background
    this.grid = this.add.tileSprite(0, 0, width, height, 'grid_texture')
      .setOrigin(0)
      .setAlpha(0.3);

    // 🌟 Particle background (colorful)
    const circle = this.add.graphics()
      .fillStyle(0xffffff)
      .fillCircle(4, 4, 4)
      .generateTexture('circle', 8, 8)
      .destroy();

    this.add.particles(0, 0, 'circle', {
      speed: 20,
      lifespan: 2000,
      quantity: 1,
      scale: { start: 0.2, end: 0 },
      alpha: { start: 0.2, end: 0 },
      tint: [0xff4444, 0x44ccff, 0xff99cc],
      blendMode: 'ADD',
      emitZone: {
        source: new Phaser.Geom.Rectangle(0, 0, width, height),
        type: 'random',
        quantity: 2
      }
    });

    // 🧠 Game title
    const title = this.add.text(width / 2, height / 2 - 170, '💥 ESTLEM 💥', {
      fontSize: '48px',
      fontFamily: 'monospace',
      color: '#ff7777',
      stroke: '#ffffff',
      strokeThickness: 6
    }).setOrigin(0.5);

    this.tweens.add({
      targets: title,
      scale: { from: 1, to: 1.05 },
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut'
    });

    // 🔘 Create styled button
    const createButton = (offsetY: number, label: string, onClick: () => void) => {
      const y = height / 2 + offsetY;

      const btn = this.add.rectangle(width / 2, y, 240, 50, 0x111111, 0.8)
        .setStrokeStyle(2, 0xff4444)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5);

      const txt = this.add.text(width / 2, y, ` ${label}`, {
        fontSize: '18px',
        fontFamily: 'monospace',
        color: '#ffffff'
      }).setOrigin(0.5);

      // Pulsing button
      this.tweens.add({
        targets: btn,
        alpha: { from: 1, to: 0.85 },
        duration: 1000,
        yoyo: true,
        repeat: -1
      });

      // Hover effect
      btn.on('pointerover', () => {
        btn.setStrokeStyle(3, 0xff8888);
        this.tweens.add({
          targets: btn,
          x: btn.x + 2,
          duration: 60,
          yoyo: true,
          repeat: 2
        });
      });

      btn.on('pointerout', () => {
        btn.setStrokeStyle(2, 0xff4444);
      });

      btn.on('pointerup', () => {
        this.cameras.main.flash(100, 255, 0, 0);
        onClick();
      });
    };

    // 🕹 Add buttons
    createButton(-60, 'Start Game', () => this.scene.start('Game'));
    createButton(0, 'Settings', () => this.scene.start('Settings'));
    createButton(60, 'Controls', () => this.scene.start('Controls'));
    createButton(120, 'Credits', () => this.scene.start('Credits'));
  }

  update(time: number, delta: number) {
    // 🔄 Scroll grid background left to right
    this.grid.tilePositionX += 0.05 * delta;
  }
}
