import Phaser from 'phaser';

export class Credits extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#0d0f18');

    // 🏷️ Title
    const title = this.add.text(width / 2, 80, '🎬 Credits', {
      fontSize: '42px',
      fontFamily: 'monospace',
      color: '#ffccaa',
      stroke: '#ffffff',
      strokeThickness: 3
    }).setOrigin(0.5);

    // 📝 Scrollable Text Container
    const creditsText = [
      '',
      '🔹 Estlem Game Assets 🔹',
      '',
      '📦 Pupkin Assets',
      '🔗 https://trevor-pupkin.itch.io/tech-dungeon-roguelite',
      '',
      '🎵 Music by Vlad_Krotov',
      '🔗 https://pixabay.com/music/video-games-retro-game-music-245230/',
      '',
      '🙌 Thank you for making this game possible!',
      '',
      '',
      '← Tap anywhere to go back'
    ];

    const textObject = this.add.text(width / 2, height, creditsText.join('\n'), {
      fontSize: '20px',
      fontFamily: 'monospace',
      color: '#ffffff',
      align: 'center',
      wordWrap: { width: width - 100 }
    }).setOrigin(0.5, 0);

    // ☁️ Floating text animation (scroll up)
    this.tweens.add({
      targets: textObject,
      y: 140,
      duration: 15000,
      ease: 'Linear'
    });

    // ✨ Background particles for flair
    const dotTex = this.add.graphics().fillStyle(0xffffff).fillCircle(2, 2, 2).generateTexture('credit_dot', 4, 4).destroy();
    const particles = this.add.particles(0, 0, 'credit_dot', {
      speedY: { min: 10, max: 30 },
      lifespan: 3000,
      alpha: { start: 0.4, end: 0 },
      scale: { start: 0.4, end: 0 },
      quantity: 2,
      blendMode: 'ADD',
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, width, height),
        quantity: 20
      }
    });

    // 🔙 Back to menu on click/tap
    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }
}
