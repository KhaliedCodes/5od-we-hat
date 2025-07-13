import { Scene } from 'phaser';

export class Ball {
    ball: Phaser.Physics.Arcade.Sprite;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        this.ball = scene.physics.add.sprite(x,y,texture);
    }
}