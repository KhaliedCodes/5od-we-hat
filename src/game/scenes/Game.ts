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
    keyE?: Phaser.Input.Keyboard.Key;
    p1hasOutline: boolean = false;
    p2hasOutline: boolean = true;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);


        this.msg_text = this.add.text(512, 384, 'Make something fun!\nand share it with us:\nsupport@phaser.io', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        });
        this.msg_text.setOrigin(0.5);

        this.cursor = this.input?.keyboard?.createCursorKeys();
        this.keyW = this.input?.keyboard?.addKey("W");
        this.keyA = this.input?.keyboard?.addKey("A");
        this.keyS = this.input?.keyboard?.addKey("S");
        this.keyD = this.input?.keyboard?.addKey("D");
        this.keyE = this.input?.keyboard?.addKey("E");
        this.input?.keyboard?.on('keydown-E', () => {
            this.p1hasOutline = !this.p1hasOutline;
            this.p2hasOutline = !this.p2hasOutline;
        });
        
        this.input.once('pointerdown', () => {
            
            this.scene.start('GameOver');
            
        });
        let data = FileReader.readTileDataAsBooleanArray(this.cache.text.get('level1'))
        for (let y = 0; y < data.length; y++) {
            for (let x = 0; x < data[y].length; x++) {
                if (data[y][x]) {
                    const tileX = x * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                    const tileY = y * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                    const platformTile = new Ground(this, tileX, tileY, CONSTANTS.PLATFORM);
                    this.add.existing(platformTile);
                }
            }
        }
        this.spawnPlayer();
    }
    
    update(time: number, delta: number): void {
        //#region Player2 Movement
        if (this.keyA?.isDown) {
            console.log("A pressed");
            this.player2.player.setVelocityX(-160);
            this.player2.player.flipX = true;
            this.player2.player.anims.play(this.p1hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.keyD?.isDown) {
            console.log("D pressed");
            this.player2.player.setVelocityX(160);
            this.player2.player.flipX = false;
            this.player2.player.anims.play(this.p1hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }else{
            this.player2.player.setVelocityX(0);
        }
        if (this.keyW?.isDown) {
            console.log("W pressed");
            this.player2.player.setVelocityY(-160);
            this.player2.player.anims.play(this.p1hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.keyS?.isDown) {
            console.log("S pressed");
            this.player2.player.setVelocityY(160);
            this.player2.player.anims.play(this.p1hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }else{
            this.player2.player.setVelocityY(0);
        }
        if (this.player2.player.body?.velocity.x === 0 && this.player2.player.body?.velocity.y === 0){
            this.player2.player.anims.play(this.p1hasOutline ? CONSTANTS.PLAYER_IDLE_OUTLINE : CONSTANTS.PLAYER_IDLE, true);
        }
        //#endregion
        //#region Player1 Movement
        if (this.cursor?.left.isDown) {
            this.player1.player.setVelocityX(-160);
            this.player1.player.flipX = true;
            this.player1.player.anims.play(this.p2hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.cursor?.right.isDown) {
            this.player1.player.setVelocityX(160);
            this.player1.player.flipX = false;
            this.player1.player.anims.play(this.p2hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }else{
            this.player1.player.setVelocityX(0);
        }
        if (this.cursor?.up.isDown) {
            this.player1.player.setVelocityY(-160);
            this.player1.player.anims.play(this.p2hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }
        else if (this.cursor?.down.isDown) {
            this.player1.player.setVelocityY(160);
            this.player1.player.anims.play(this.p2hasOutline ? CONSTANTS.PLAYER_RUN_OUTLINE : CONSTANTS.PLAYER_RUN, true);
        }else{
            this.player1.player.setVelocityY(0);
        }
        if (this.player1.player.body?.velocity.x === 0 && this.player1.player.body?.velocity.y === 0){
            this.player1.player.anims.play(this.p2hasOutline ? CONSTANTS.PLAYER_IDLE_OUTLINE : CONSTANTS.PLAYER_IDLE, true);
        }
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
}
