import Phaser from 'phaser';

export default class Laser extends Phaser.GameObjects.Rectangle {
  private glow!: Phaser.GameObjects.Rectangle;

  constructor(scene: Phaser.Scene, x: number, y: number, direction: 'up' | 'down' | 'left' | 'right', color: number = 0xff2222) {
    const width = direction === 'left' || direction === 'right' ? 200 : 16;
    const height = direction === 'up' || direction === 'down' ? 200 : 16;

    // Create main solid beam
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body
    this.setOrigin(0.5);

    // Create glow beam behind it
    this.glow = scene.add.rectangle(x, y, width + 20, height + 20, color, 0.3);
    this.glow.setOrigin(0.5);
    this.glow.setDepth(this.depth - 1);
    this.glow.setBlendMode(Phaser.BlendModes.ADD); // Fake bloom

    // Set rotation based on direction
    switch (direction) {
      case 'up':
        this.setAngle(-90);
        this.glow.setAngle(-90);
        break;
      case 'down':
        this.setAngle(90);
        this.glow.setAngle(90);
        break;
      case 'left':
        this.setAngle(180);
        this.glow.setAngle(180);
        break;
      case 'right':
      default:
        this.setAngle(0);
        this.glow.setAngle(0);
        break;
    }

    // Flicker animation (optional)
    scene.tweens.add({
      targets: [this, this.glow],
      alpha: { from: 1, to: 0.6 },
      duration: 200,
      yoyo: true,
      repeat: -1
    });
  }
}
