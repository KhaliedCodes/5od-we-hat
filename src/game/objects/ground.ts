import { Scene } from 'phaser';

export class Ground extends Phaser.GameObjects.Sprite {
    platform: Phaser.Physics.Arcade.StaticGroup;
    constructor(scene: Scene, x: number, y: number, texture: string) {
        super(scene, x, y, texture);
        
    }
}