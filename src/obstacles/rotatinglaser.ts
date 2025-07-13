import Phaser from 'phaser';

export default class RotatingLaser extends Phaser.GameObjects.Container {
  private beam: Phaser.GameObjects.Rectangle;
  private hitbox: Phaser.GameObjects.Rectangle;
  private bodyRef: Phaser.Physics.Arcade.Body;
  private center: Phaser.Math.Vector2;
  private angleDeg: number = 0;
  private radius: number;
  private speed: number;
  private clockwise: boolean;

  constructor(
    scene: Phaser.Scene,
    centerX: number,
    centerY: number,
    radius: number = 0,
    clockwise: boolean = true,
    speed: number = 0.03,
    color: number = 0xff2222
  ) {
    super(scene, centerX, centerY);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.center = new Phaser.Math.Vector2(centerX, centerY);
    this.radius = radius;
    this.speed = speed;
    this.clockwise = clockwise;

    const beamWidth = 300;
    const beamHeight = 10;

    // Visual beam
    this.beam = scene.add.rectangle(0, 0, beamWidth, beamHeight, color);
    this.beam.setOrigin(0.5);

    // Collider hitbox
    this.hitbox = scene.add.rectangle(0, 0, beamWidth, beamHeight);
    this.hitbox.setOrigin(0.5);
    this.hitbox.setVisible(false);

    this.add(this.beam);
    this.add(this.hitbox);

    // Set up physics body
    scene.physics.add.existing(this.hitbox);
    this.bodyRef = this.hitbox.body as Phaser.Physics.Arcade.Body;
    this.bodyRef.setAllowGravity(false);
    this.bodyRef.setImmovable(true);
  }

  preUpdate(time: number, delta: number) {
    this.angleDeg += (this.clockwise ? 1 : -1) * this.speed * delta;
    const rad = Phaser.Math.DegToRad(this.angleDeg);

    // Laser rotates around a center point
    const x = this.center.x + Math.cos(rad) * this.radius;
    const y = this.center.y + Math.sin(rad) * this.radius;

    // Visual beam updates
    this.setPosition(x, y);
    this.setRotation(rad);
    this.beam.setRotation(rad);

    // Update hitbox position (match beam center)
    const hitboxX = x;
    const hitboxY = y;

    this.hitbox.setPosition(hitboxX, hitboxY);
    this.hitbox.setRotation(rad); // for visual debug if needed

    // Simulate rotated body position: move top-left manually
    const body = this.bodyRef;
    const width = this.hitbox.width;
    const height = this.hitbox.height;

    const offsetX = Math.cos(rad) * (-width / 2) - Math.sin(rad) * (-height / 2);
    const offsetY = Math.sin(rad) * (-width / 2) + Math.cos(rad) * (-height / 2);

    body.setSize(width, height);
    body.setOffset(0, 0); // reset offset
    body.position.set(hitboxX + offsetX, hitboxY + offsetY);
  }

  getBody(): Phaser.Physics.Arcade.Body {
    return this.bodyRef;
  }
}
