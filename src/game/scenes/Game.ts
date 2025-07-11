import { Scene } from 'phaser';
import { Ground } from '../objects/ground';
import { CONSTANTS } from '../../constants';
import { FileReader } from '../utils/fileReader';

export class Game extends Scene
{
    camera: Phaser.Cameras.Scene2D.Camera;
    background: Phaser.GameObjects.Image;
    msg_text : Phaser.GameObjects.Text;

    constructor ()
    {
        super('Game');
    }

    create ()
    {
        this.camera = this.cameras.main;
        this.camera.setBackgroundColor(0x00ff00);


        FileReader.readTileDataAsBooleanArray(this.cache.text.get('level1')).then((data: boolean[][]) => {
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
        })
    }
}
