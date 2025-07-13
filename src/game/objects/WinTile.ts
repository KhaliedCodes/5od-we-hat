import { Scene } from 'phaser';

export class WinTile {
    winTile: Phaser.Physics.Arcade.Sprite;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        this.winTile = scene.physics.add.sprite(x,y,texture);
    }
}