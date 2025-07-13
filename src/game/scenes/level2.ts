import { Scene } from 'phaser';
import Laser from '../../obstacles/laser';
import { CONSTANTS } from '../../constants';
import { Player } from '../objects/Player';
import { Ground } from '../objects/ground';
import { Ball } from "../objects/Ball";
import { WinTile } from '../objects/WinTile';
import { FileReader } from '../utils/fileReader';
import { GameTimer } from '../../constants';
export class leveltwo extends Scene {
  camera: Phaser.Cameras.Scene2D.Camera;
  background: Phaser.GameObjects.Image;
  msg_text: Phaser.GameObjects.Text;
  laserGroup!: Phaser.GameObjects.Group;
  player1: Player;
  player2: Player;
  ballTarget: Player;
  ballmoving: boolean = false;
  ball: Ball;
  winTile1: WinTile;
  winTile2: WinTile;
  cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
  keyW?: Phaser.Input.Keyboard.Key;
  keyA?: Phaser.Input.Keyboard.Key;
  keyS?: Phaser.Input.Keyboard.Key;
  keyD?: Phaser.Input.Keyboard.Key;
  smokeEmitter1: Phaser.GameObjects.Particles.ParticleEmitter;
  smokeEmitter2: Phaser.GameObjects.Particles.ParticleEmitter;
  p1hasOutline: boolean = true;
  p2hasOutline: boolean = false;
  emptyPlatforms: Ground[] = [];

  platforms: Ground[] = [];
  constructor() {
    super('leveltwo');
  }

  private timerText!: Phaser.GameObjects.Text;
  private timerEvent!: Phaser.Time.TimerEvent;
  create() {
    this.camera = this.cameras.main;
    this.camera.setBackgroundColor(0x0d0f18);
    const currentElapsed = Math.floor((Date.now() - GameTimer.startTime) / 1000);
    this.timerText = this.add.text(this.cameras.main.centerX, this.cameras.main.height - 30, `Time: ${currentElapsed}`, {
        fontSize: '32px',
        color: '#ffffff',
    }).setOrigin(0.5);

    this.timerEvent = this.time.addEvent({
        delay: 1000,
        loop: true,
        callback: () => {
            const elapsed = Math.floor((Date.now() - GameTimer.startTime) / 1000);
            this.timerText.setText(`Time: ${elapsed}`);
        }
    });
    this.cursor = this.input?.keyboard?.createCursorKeys();
    this.keyW = this.input?.keyboard?.addKey("W");
    this.keyA = this.input?.keyboard?.addKey("A");
    this.keyS = this.input?.keyboard?.addKey("S");
    this.keyD = this.input?.keyboard?.addKey("D");
    
    let data = FileReader.readTileDataAsBooleanArray(this.cache.text.get('level2'));
    for (let y = 0; y < data.length; y++) {
      for (let x = 0; x < data[y].length; x++) {
        const tileX = x * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
        const tileY = y * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
        if (data[y][x]) {
          const platformTile = new Ground(this, tileX, tileY, CONSTANTS.FALLING_PLATFORM);
          this.add.existing(platformTile);
          this.physics.add.existing(platformTile);
          this.platforms.push(platformTile);
        } else {
          const emptyPlatform = new Ground(this, tileX, tileY, CONSTANTS.PLATFORM);
          this.physics.add.existing(emptyPlatform);
          emptyPlatform.setImmovable(true);
          this.emptyPlatforms.push(emptyPlatform);
        }
      }
    }

    this.winTile1 = new WinTile(this, CONSTANTS.WINDOW_WIDTH - CONSTANTS.TERRAIN_TILE_SIZE / 2, CONSTANTS.TERRAIN_TILE_SIZE / 2, CONSTANTS.WINTILE);
    this.winTile2 = new WinTile(this, CONSTANTS.TERRAIN_TILE_SIZE / 2, CONSTANTS.TERRAIN_TILE_SIZE / 2, CONSTANTS.WINTILE);
    this.ball = new Ball(this, CONSTANTS.WINDOW_WIDTH - 3 * CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.BALL);
    this.ball.ball.setVisible(false);

    this.smokeEmitter1 = this.add.particles(500, 500, 'whiteSquare', {
      speed: { min: -50, max: 50 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 1000,
      frequency: 100,
      blendMode: 'ADD',
    });

    this.smokeEmitter2 = this.add.particles(500, 500, 'whiteSquare', {
      speed: { min: -50, max: 50 },
      angle: { min: 0, max: 360 },
      scale: { start: 1, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 1000,
      frequency: 100,
      blendMode: 'ADD',
    });

    this.spawnPlayer();

    // ✅ Regular static lasers
    const laser1 = new Laser(this, 300, 300, 'right', 0xff2222, 600);
    const laser2 = new Laser(this, 300, 400, 'right', 0xff2222, 600);
    const laser3 = new Laser(this, 790, 500, 'left', 0xff2222, 600);
    const laser4 = new Laser(this, 790, 600, 'left', 0xff2222, 600);
    const laser5 = new Laser(this, 544, 200, 'left', 0xff2222, 1100);

    this.laserGroup = this.add.group([laser1, laser2, laser3, laser4, laser5]);

    this.physics.add.overlap(this.player1.player, this.laserGroup, () => {
      if (!this.p1hasOutline) this.scene.start('GameOver');
    });

    this.physics.add.overlap(this.player2.player, this.laserGroup, () => {
      if (!this.p2hasOutline) this.scene.start('GameOver');
    });

    this.input?.keyboard?.on('keydown-E', () => {
      if (!this.p2hasOutline) return;
      this.ball.ball.setVisible(true);
      this.ball.ball.setPosition(this.player2.player.x, this.player2.player.y + CONSTANTS.PLAYER_TILE_SIZE / 4);
      this.ballTarget = this.player1;
      this.ballmoving = true;
    });

    this.input?.keyboard?.on('keydown-CTRL', () => {
      if (!this.p1hasOutline) return;
      this.ball.ball.setVisible(true);
      this.ball.ball.setPosition(this.player1.player.x, this.player1.player.y + CONSTANTS.PLAYER_TILE_SIZE / 4);
      this.ballTarget = this.player2;
      this.ballmoving = true;
    });

    this.emptyPlatforms.forEach(platform => {
      this.physics.add.collider(this.player1.player, platform);
      this.physics.add.collider(this.player2.player, platform);
    });
    this.platforms.forEach(platform => {
      this.physics.add.overlap(this.player1.player, platform, () => {
        if (!this.p1hasOutline)
          this.tweens.add({
            targets: platform,
            duration: 3000,
            tint: 0xff0000,
            onComplete: () => {
              platform.setVisible(false);
              const isOverlapped = this.physics.world.overlap(this.player1.player, platform)
              if (isOverlapped) this.scene.start('GameOver');
            }
          });
      });

      this.physics.add.overlap(this.player2.player, platform, () => {
        if (!this.p2hasOutline)
          this.tweens.add({
            targets: platform,
            duration: 3000,
            tint: 0xff0000,
            onComplete: () => {
              platform.setVisible(false);
              const isOverlapped = this.physics.world.overlap(this.player2.player, platform)
              if (isOverlapped) this.scene.start('GameOver');
            }
          });
      });
    })
  }

  update(time: number, delta: number): void {

    this.movePlayer(this.player2, this.p2hasOutline, this.keyW, this.keyS, this.keyA, this.keyD);
    this.movePlayer(this.player1, this.p1hasOutline, this.cursor?.up, this.cursor?.down, this.cursor?.left, this.cursor?.right);

    if (this.ballmoving) {
      const targetX = this.ballTarget.player.x;
      const targetY = this.ballTarget.player.y + CONSTANTS.PLAYER_TILE_SIZE / 4;
      if (Phaser.Math.Distance.Between(targetX, targetY, this.ball.ball.x, this.ball.ball.y) > CONSTANTS.PLAYER_TILE_SIZE / 4) {
        this.tweens.add({
          targets: this.ball.ball,
          x: targetX,
          y: targetY,
          duration: 1000,
          ease: 'Power2',
        });
      } else {
        this.ball.ball.setVelocity(0, 0);
        this.p1hasOutline = this.player1 === this.ballTarget;
        this.p2hasOutline = this.player2 === this.ballTarget;
        this.ball.ball.setVisible(false);
        this.ballmoving = false;
      }
    }

    if (
      this.physics.world.overlap(this.player1.player, this.winTile1.winTile) &&
      this.physics.world.overlap(this.player2.player, this.winTile2.winTile)
    ) {
      GameTimer.endTime = Date.now();
      this.scene.start('Win');
    }

    if (this.smokeEmitter1) {
      this.smokeEmitter1.setPosition(this.player1.player.x, this.player1.player.y + CONSTANTS.PLAYER_TILE_SIZE / 2);
      const isMoving = this.player1.player.body?.velocity.x !== 0 || this.player1.player.body?.velocity.y !== 0;
      isMoving ? this.smokeEmitter1.start() : this.smokeEmitter1.stop();
    }

    if (this.smokeEmitter2) {
      this.smokeEmitter2.setPosition(this.player2.player.x, this.player2.player.y + CONSTANTS.PLAYER_TILE_SIZE / 2);
      const isMoving = this.player2.player.body?.velocity.x !== 0 || this.player2.player.body?.velocity.y !== 0;
      isMoving ? this.smokeEmitter2.start() : this.smokeEmitter2.stop();
    }
  }

  spawnPlayer() {
    this.player1 = new Player(this, CONSTANTS.WINDOW_WIDTH - CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE - CONSTANTS.PLAYER_TILE_SIZE / 2, CONSTANTS.PLAYER);
    this.player1.player.anims.play(CONSTANTS.PLAYER_IDLE_OUTLINE);
    this.player1.player.flipX = true;
    this.player1.player.tint = 0xff5555;

    this.player2 = new Player(this, CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE - CONSTANTS.PLAYER_TILE_SIZE / 2, CONSTANTS.PLAYER);
    this.player2.player.anims.play(CONSTANTS.PLAYER_IDLE);
    this.player2.player.tint = 0x5555ff;
  }

  movePlayer(player: Player, hasOutline: boolean, keyup?: Phaser.Input.Keyboard.Key, keydown?: Phaser.Input.Keyboard.Key, keyleft?: Phaser.Input.Keyboard.Key, keyright?: Phaser.Input.Keyboard.Key) {
    const idleAnim = hasOutline ? CONSTANTS.PLAYER_IDLE_OUTLINE : CONSTANTS.PLAYER_IDLE;
    const runAnim = hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN;

    if (keyleft?.isDown) {
      player.player.setVelocityX(-160);
      player.player.flipX = true;
    } else if (keyright?.isDown) {
      player.player.setVelocityX(160);
      player.player.flipX = false;
    } else {
      player.player.setVelocityX(0);
    }

    if (keyup?.isDown) {
      player.player.setVelocityY(-160);
    } else if (keydown?.isDown) {
      player.player.setVelocityY(160);
    } else {
      player.player.setVelocityY(0);
    }

    const velocity = player.player.body?.velocity;
    if (velocity?.x === 0 && velocity?.y === 0) {
      player.player.anims.play(idleAnim, true);
    } else {
      player.player.anims.play(runAnim, true);
    }
  }
}
