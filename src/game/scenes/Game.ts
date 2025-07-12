import { Scene } from 'phaser';
import { CONSTANTS } from '../../constants';
import { Player } from '../objects/Player';
import { Ground } from '../objects/ground';
import { FileReader } from '../utils/fileReader';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    player1: Player;
    player2: Player;
    cursor?: Phaser.Types.Input.Keyboard.CursorKeys;
    keyW?: Phaser.Input.Keyboard.Key;
    keyA?: Phaser.Input.Keyboard.Key;
    keyS?: Phaser.Input.Keyboard.Key;
    keyD?: Phaser.Input.Keyboard.Key;
    p1hasOutline: boolean = false;
    p2hasOutline: boolean = true;
    emptyPlatforms: Ground[] = [];

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);


        this.cursor = this.input?.keyboard?.createCursorKeys();
        this.keyW = this.input?.keyboard?.addKey("W");
        this.keyA = this.input?.keyboard?.addKey("A");
        this.keyS = this.input?.keyboard?.addKey("S");
        this.keyD = this.input?.keyboard?.addKey("D");
        this.input?.keyboard?.on('keydown-E', () => {
            if (this.p2hasOutline) {
                this.p1hasOutline = true;
                this.p2hasOutline = false;
            }
        });
        this.input?.keyboard?.on('keydown-CTRL', () => {
            if (this.p1hasOutline) {
                this.p1hasOutline = false;
                this.p2hasOutline = true;
            }
        });

        let data = FileReader.readTileDataAsBooleanArray(this.cache.text.get('level1'))
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
        this.spawnPlayer();
        this.emptyPlatforms.forEach(platform => {
            this.physics.add.collider(this.player1.player, platform);
            this.physics.add.collider(this.player2.player, platform);
        })

    }
    
    update(time: number, delta: number): void {
        //#region Player2 Movement
        this.movePlayer(this.player2, this.p2hasOutline, this.keyW, this.keyS, this.keyA, this.keyD);
        //#endregion
        //#region Player1 Movement
        this.movePlayer(this.player1, this.p1hasOutline, this.cursor?.up, this.cursor?.down, this.cursor?.left, this.cursor?.right);
        //#endregion
    }

    spawnPlayer() {
        this.player1 = new Player(this, CONSTANTS.WINDOW_WIDTH - CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE - CONSTANTS.PLAYER_TILE_SIZE / 2 , CONSTANTS.PLAYER);
        this.player1.player.anims.play(CONSTANTS.PLAYER_IDLE);
        this.player1.player.flipX = true;
        this.player1.player.tint = 0xff5555; // Change color for player 1

         // Spawn Player 2
        this.player2 = new Player(this, CONSTANTS.TERRAIN_TILE_SIZE, CONSTANTS.WINDOW_HEIGHT - CONSTANTS.TERRAIN_TILE_SIZE - CONSTANTS.PLAYER_TILE_SIZE / 2 , CONSTANTS.PLAYER);
        this.player2.player.anims.play(CONSTANTS.PLAYER_IDLE_OUTLINE);
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
