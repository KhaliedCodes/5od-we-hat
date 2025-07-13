import Phaser from 'phaser';

export class Credits extends Phaser.Scene {
  constructor() {
    super('Credits');
  }

  create() {
    const { width, height } = this.scale;

    this.cameras.main.setBackgroundColor('#0d0f18');

    // 🎬 Title
    this.add.text(width / 2, 80, '🎬 Credits', {
      fontSize: '42px',
      fontFamily: 'monospace',
      color: '#ffccaa',
      stroke: '#ffffff',
      strokeThickness: 3
    }).setOrigin(0.5);

    // 📝 Credits Text
    const creditsText = [
      '',
      '🔹 Estlem Game Developers 🔹',
      '',
      '👨‍💻 Mohamed Magdy (Pofo X)',
      '🔗 https://itch.io/profile/pofo-x',
      '',
      '👨‍💻 Khalied Magdy (KhaliedItches)',
      '🔗 https://itch.io/profile/khalieditches',
      '',
      '👨‍💻 Omar Masoud (Tantawii)',
      '🔗 https://tantawii.itch.io/',
      '',
      '',
      '🔹 Game Assets 🔹',
      '',
      '📦 Pupkin Assets',
      '🔗 https://trevor-pupkin.itch.io/tech-dungeon-roguelite',
      '',
      '🎵 Music by Vlad_Krotov',
      '🔗 https://pixabay.com/music/video-games-retro-game-music-245230/',
      '',
      '',
      '🙌 Thank you for playing Estlem!',
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

    // ⬆ Smooth scroll up
    this.tweens.add({
      targets: textObject,
      y: 140,
      duration: 18000,
      ease: 'Linear'
    });

    // ✨ VFX: Background particles
    const dotTex = this.add.graphics().fillStyle(0xffffff).fillCircle(2, 2, 2).generateTexture('credit_dot', 4, 4).destroy();
    this.add.particles(0, 0, 'credit_dot', {
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

    // 🔙 Return
    this.input.once('pointerdown', () => {
      this.scene.start('MainMenu');
    });
  }
}
