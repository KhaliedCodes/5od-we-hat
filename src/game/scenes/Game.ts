import { Scene } from 'phaser';
import Laser from '../../obstacles/laser';
import { Ground } from '../objects/ground';
import { CONSTANTS } from '../../constants';
import { FileReader } from '../utils/fileReader';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;
    laserGroup!: Phaser.GameObjects.Group;

    constructor() {
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

        this.input.once('pointerdown', () => {

            this.scene.start('GameOver');

        });


        FileReader.readTileDataAsBooleanArray(this.cache.text.get('level1')).then((data: boolean[][]) => {
            for (let y = 0; y < data.length; y++) {
                for (let x = 0; x < data[y].length; x++) {
                    if (data[y][x]) {
                        const tileX = x * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                        const tileY = y * CONSTANTS.TERRAIN_TILE_SIZE + CONSTANTS.TERRAIN_TILE_SIZE / 2;
                        const platformTile = new Ground(this, tileX, tileY, CONSTANTS.PLATFORM);
                        this.add.existing(platformTile);
                        const laser = new Laser(this, 400, 300, 'right', 0xff2222);
        
                        this.laserGroup = this.add.group();
                        this.laserGroup.add(laser);


                        this.physics.add.overlap(this.player, laser, () => {
                            this.scene.start('GameOver');
                        });
                    }
                }
            }
        })
    }
}
