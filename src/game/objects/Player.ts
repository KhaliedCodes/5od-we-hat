import { Scene } from 'phaser';
import { CONSTANTS } from '../../constants';

export class Player {
    player: Phaser.Physics.Arcade.Sprite;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        this.player = scene.physics.add.sprite(x,y,texture);
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
    }
}