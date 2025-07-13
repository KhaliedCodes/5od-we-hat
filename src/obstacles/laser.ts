import Phaser from 'phaser';

export default class Laser extends Phaser.GameObjects.Rectangle {
  private glow!: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    direction: 'up' | 'down' | 'left' | 'right',
    color: number = 0xff2222
  ) {
    const isVertical = direction === 'up' || direction === 'down';
    const width = isVertical ? 16 : 200;
    const height = isVertical ? 200 : 16;

    // Create main solid beam
    super(scene, x, y, width, height, color);
    scene.add.existing(this);
    scene.physics.add.existing(this, true); // static body
    this.setOrigin(0.5);
    this.setDepth(5); // Set it higher than tiles

    // Create glow behind the laser
    this.glow = scene.add.rectangle(x, y, width + 20, height + 20, color, 0.3);
    this.glow.setOrigin(0.5);
    this.glow.setDepth(6); // Ensure it's above tiles and below player maybe
    this.glow.setBlendMode(Phaser.BlendModes.ADD);

    // Flicker animation (optional glow flicker)
    scene.tweens.add({
      targets: [this, this.glow],
      alpha: { from: 1, to: 0.6 },
      duration: 200,
      yoyo: true,
      repeat: -1
    });
  }
}
