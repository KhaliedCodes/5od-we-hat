import Phaser from 'phaser';

export default class RotatingLaser extends Phaser.GameObjects.Rectangle {
  private speed: number;
  public radius: number;
  private center: Phaser.Math.Vector2;
  private angleDeg: number;
  private clockwise: boolean;
  private glow!: Phaser.GameObjects.Rectangle;
  public hitbox!: Phaser.GameObjects.Rectangle;

  constructor(
    scene: Phaser.Scene,
    centerX: number,
    centerY: number,
    radius: number = 0,
    clockwise: boolean = true,
    speed: number = 0.02,
    color: number = 0xff2222
  ) {
    const width = Math.sqrt(scene.scale.width ** 2 + scene.scale.height ** 2);
    const height = 10;

    // Main visual laser
    super(scene, centerX, centerY, width, height, color);
    this.setOrigin(0.5);
    this.setAlpha(0.85);
    this.setDepth(5);
    scene.add.existing(this);

    // Glow effect
    this.glow = scene.add.rectangle(centerX, centerY, width + 20, height + 20, color, 0.3);
    this.glow.setOrigin(0.5);
    this.glow.setDepth(4);

    // Invisible hitbox for collision
    this.hitbox = scene.add.rectangle(centerX, centerY, width, height);
    scene.physics.add.existing(this.hitbox);
    const body = this.hitbox.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    this.hitbox.setVisible(false);

    // Movement setup
    this.center = new Phaser.Math.Vector2(centerX, centerY);
    this.radius = radius;
    this.angleDeg = 0;
    this.clockwise = clockwise;
    this.speed = speed;
  }

  preUpdate(time: number, delta: number) {
    this.angleDeg += (this.clockwise ? 1 : -1) * this.speed * delta;
    const rad = Phaser.Math.DegToRad(this.angleDeg);

    if (this.radius > 0) {
      this.x = this.center.x + Math.cos(rad) * this.radius;
      this.y = this.center.y + Math.sin(rad) * this.radius;
    }

    this.rotation = rad;
    this.glow.x = this.x;
    this.glow.y = this.y;
    this.glow.rotation = rad;

    // Sync hitbox position (but not rotated)
    this.hitbox.x = this.x;
    this.hitbox.y = this.y;

    const body = this.hitbox.body as Phaser.Physics.Arcade.Body;
    if (body) {
      body.setSize(this.width, this.height); // keep thin
      body.position.set(this.getTopLeft().x, this.getTopLeft().y); // sync to visual
    }
  }
}
