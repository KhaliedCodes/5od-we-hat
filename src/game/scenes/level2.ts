    import { Scene } from 'phaser';
    import Laser from '../../obstacles/laser';
    import { CONSTANTS } from '../../constants';
    import { Player } from '../objects/Player';
    import { Ground } from '../objects/ground';
    import { Ball } from "../objects/Ball";
    import { WinTile } from '../objects/WinTile';
    import { FileReader } from '../utils/fileReader';

    export class leveltwo extends Scene
    {
        camera: Phaser.Cameras.Scene2D.Camera;
        background: Phaser.GameObjects.Image;
        msg_text : Phaser.GameObjects.Text;
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

        constructor() {
            super('leveltwo');
        }

        create ()
        {
            this.camera = this.cameras.main;
            this.camera.setBackgroundColor(0x0d0f18);


            // this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            //     fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            //     stroke: '#000000', strokeThickness: 8,
            //     align: 'center'
            // });
            // this.msg_text.setOrigin(0.5);

            
            
            this.cursor = this.input?.keyboard?.createCursorKeys();
            this.keyW = this.input?.keyboard?.addKey("W");
            this.keyA = this.input?.keyboard?.addKey("A");
            this.keyS = this.input?.keyboard?.addKey("S");
            this.keyD = this.input?.keyboard?.addKey("D");
            
            let data = FileReader.readTileDataAsBooleanArray(this.cache.text.get('level2'))
            for (let y = 0; y < data.length; y++) {
                for (let x = 0; x < data[y].length; x++) {
                    if (data[y][x]) {
                        const tileX = x * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                        const tileY = y * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                        const platformTile = new Ground(this, tileX, tileY, CONSTANTS.PLATFORM);
                        this.add.existing(platformTile);
                    } else {
                        const tileX = x * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                        const tileY = y * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                        const emptyPlatform = new Ground(this, tileX, tileY, CONSTANTS.PLATFORM);
                        this.physics.add.existing(emptyPlatform);
                        emptyPlatform.setImmovable(true);
                        this.emptyPlatforms.push(emptyPlatform);
                    }
                }
            }
            this.winTile1 = new WinTile(this, CONSTANTS.WINDOW_WIDTH - CONSTANTS.TERRAIN_TILE_SIZE/2, CONSTANTS.TERRAIN_TILE_SIZE/2, CONSTANTS.WINTILE);
            this.winTile2 = new WinTile(this, CONSTANTS.TERRAIN_TILE_SIZE / 2, CONSTANTS.TERRAIN_TILE_SIZE/2, CONSTANTS.WINTILE);
            this.ball = new Ball(this, CONSTANTS.WINDOW_WIDTH - 3 * CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.BALL);
            this.ball.ball.setVisible(false);
            this.smokeEmitter1 = this.add.particles(500,500,'whiteSquare',{
                speed: { min: -50, max: 50 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                alpha: { start: 0.6, end: 0 },
                lifespan: 1000,
                frequency: 100,
                blendMode: 'ADD',
            });
            this.smokeEmitter2 = this.add.particles(500,500,'whiteSquare',{
                speed: { min: -50, max: 50 },
                angle: { min: 0, max: 360 },
                scale: { start: 1, end: 0 },
                alpha: { start: 0.6, end: 0 },
                lifespan: 1000,
                frequency: 100,
                blendMode: 'ADD',
            });
            this.spawnPlayer();

            const laser = new Laser(this, 300, 300, 'right', 0xff2222, 600);
            const laser2 = new Laser(this, 300, 400, 'right', 0xff2222, 600);
            const laser3 = new Laser(this, 790, 500, 'left', 0xff2222, 600);
            const laser4 = new Laser(this, 790, 600, 'left', 0xff2222, 600);
            const laser5 = new Laser(this, 544, 200, 'left', 0xff2222, 1100);


            this.laserGroup = this.add.group();
            this.laserGroup.add(laser);
            this.laserGroup.add(laser2);
            this.laserGroup.add(laser3);
            this.laserGroup.add(laser4);
            this.laserGroup.add(laser5);

            this.physics.add.overlap(this.player1.player, this.laserGroup, () => { 
                if(!this.p1hasOutline) {
                    this.scene.start('GameOver');
                }
            });
            this.physics.add.overlap(this.player2.player, this.laserGroup, () => {
                if(!this.p2hasOutline) {
                    this.scene.start('GameOver');
                }
            });

            this.input?.keyboard?.on('keydown-E', () => {
                if (!this.p2hasOutline) {
                    return;
                }
                this.ball.ball.setVisible(true);
                this.ball.ball.setPosition(this.player2.player.x, this.player2.player.y + CONSTANTS.PLAYER_TILE_SIZE / 4);
                this.ballTarget = this.player1;
                this.ballmoving = true;
            });
            this.input?.keyboard?.on('keydown-CTRL', () => {
                if (!this.p1hasOutline) {
                    return;
                }
                this.ball.ball.setVisible(true);
                this.ball.ball.setPosition(this.player1.player.x, this.player1.player.y + CONSTANTS.PLAYER_TILE_SIZE / 4);
                this.ballTarget = this.player2;
                this.ballmoving = true;
            });
            this.emptyPlatforms.forEach(platform => {
                this.physics.add.collider(this.player1.player, platform);
                this.physics.add.collider(this.player2.player, platform);
            })
            
        }
        
        update(time: number, delta: number): void {
            this.movePlayer(this.player2, this.p2hasOutline, this.keyW, this.keyS, this.keyA, this.keyD);
            this.movePlayer(this.player1, this.p1hasOutline, this.cursor?.up, this.cursor?.down, this.cursor?.left, this.cursor?.right);
            if (this.ballmoving) {
                if (Phaser.Math.Distance.Between(this.ballTarget.player.x, this.ballTarget.player.y + CONSTANTS.PLAYER_TILE_SIZE / 4, this.ball.ball.x, this.ball.ball.y) > CONSTANTS.PLAYER_TILE_SIZE / 4) {
                    this.tweens.add({
                        targets: this.ball.ball,
                        x: this.ballTarget.player.x,
                        y: this.ballTarget.player.y + CONSTANTS.PLAYER_TILE_SIZE / 4,
                        duration: 1000,
                        ease: 'Power2',
                    });
                }else {
                    this.ball.ball.setVelocity(0, 0);
                    this.p1hasOutline = this.player1 === this.ballTarget;
                    this.p2hasOutline = this.player2 === this.ballTarget;
                    this.ball.ball.setVisible(false);
                    this.ballmoving = false;
                }
            }
            if (this.physics.world.overlap(this.player1.player, this.winTile1.winTile) && this.physics.world.overlap(this.player2.player, this.winTile2.winTile)) {
                // TODO: replace with next level
                this.scene.start('MainMenu');
            }
            if (this.smokeEmitter1) {
                this.smokeEmitter1.setPosition(this.player1.player.x, this.player1.player.y + CONSTANTS.PLAYER_TILE_SIZE / 2);
                const isMoving = this.player1.player.body?.velocity.x !== 0 || this.player1.player.body?.velocity.y !== 0;
                if (isMoving) {
                    this.smokeEmitter1.start();
                } else {
                    this.smokeEmitter1.stop();
                }
            }
            if (this.smokeEmitter2) {
                this.smokeEmitter2.setPosition(this.player2.player.x, this.player2.player.y + CONSTANTS.PLAYER_TILE_SIZE / 2);
                const isMoving = this.player2.player.body?.velocity.x !== 0 || this.player2.player.body?.velocity.y !== 0;
                if (isMoving) {
                    this.smokeEmitter2.start();
                } else {
                    this.smokeEmitter2.stop();
                }
            }
        }
        
        spawnPlayer() {
            this.player1 = new Player(this, CONSTANTS.WINDOW_WIDTH - CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE - CONSTANTS.PLAYER_TILE_SIZE / 2 , CONSTANTS.PLAYER);
            this.player1.player.anims.play(CONSTANTS.PLAYER_IDLE_OUTLINE);
            this.player1.player.flipX = true;
            this.player1.player.tint = 0xff5555; // Change color for player 1

            // Spawn Player 2
            this.player2 = new Player(this, CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE - CONSTANTS.PLAYER_TILE_SIZE / 2 , CONSTANTS.PLAYER);
            this.player2.player.anims.play(CONSTANTS.PLAYER_IDLE);
            this.player2.player.tint = 0x5555ff; // Change color for player 2
        }
        movePlayer(player: Player, hasOutline: boolean, keyup?: Phaser.Input.Keyboard.Key, keydown?: Phaser.Input.Keyboard.Key, keyleft?: Phaser.Input.Keyboard.Key, keyright?: Phaser.Input.Keyboard.Key) {
            const playeridle = hasOutline ? CONSTANTS.PLAYER_IDLE_OUTLINE : CONSTANTS.PLAYER_IDLE;
            const playerrun = hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN;
            if (keyleft?.isDown) {
                player.player.setVelocityX(-160);
                player.player.flipX = true;
            }
            else if (keyright?.isDown) {
                player.player.setVelocityX(160);
                player.player.flipX = false;
            }else{
                player.player.setVelocityX(0);
            }
            if (keyup?.isDown) {
                player.player.setVelocityY(-160);
            }
            else if (keydown?.isDown) {
                player.player.setVelocityY(160);
            }else{
                player.player.setVelocityY(0);
            }
            if (player.player.body?.velocity.x === 0 && player.player.body?.velocity.y === 0){
                player.player.anims.play(playeridle, true);
            }else{
                player.player.anims.play(playerrun, true);
            }
        }
    }
