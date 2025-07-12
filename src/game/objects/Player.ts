import { Scene } from 'phaser';
import { CONSTANTS } from '../../constants';

export class Player {
    player: Phaser.Physics.Arcade.Sprite;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        this.player = scene.physics.add.sprite(x,y,texture);
        this.player.body?.setSize(CONSTANTS.PLAYER_TILE_SIZE/3, CONSTANTS.PLAYER_TILE_SIZE/2);
        this.player.body?.setOffset(CONSTANTS.PLAYER_TILE_SIZE/3, CONSTANTS.PLAYER_TILE_SIZE/2);
        this.player.setCollideWorldBounds(true);
        scene.anims.create({
            key:CONSTANTS.PLAYER_IDLE,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER,{start:0,end:0}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_RUN,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER,{start:24,end:27}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_DEATH,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER,{start:40,end:46}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_IDLE_OUTLINE,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER_OUTLINE,{start:0,end:0}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_RUN_OUTLINE,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER_OUTLINE,{start:24,end:27}),
            frameRate:10,
            repeat:-1
        });
        scene.anims.create({
            key:CONSTANTS.PLAYER_DEATH_OUTLINE,
            frames: scene.anims.generateFrameNumbers(CONSTANTS.PLAYER_OUTLINE,{start:40,end:46}),
            frameRate:10,
            repeat:-1
        });
    }
}