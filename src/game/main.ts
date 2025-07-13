import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { levelone } from './scenes/level1';
import { leveltwo } from './scenes/level2';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { CONSTANTS } from '../constants';
import { Settings } from './scenes/Settings';
import { Controls } from './scenes/Controls';
import { Credits } from './scenes/Credits';

//  Find out more information about the Game Config at:
//  https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: CONSTANTS.WINDOW_WIDTH,
    height: CONSTANTS.WINDOW_HEIGHT,
    parent: 'game-container',
    backgroundColor: '#028af8',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 },
            debug: true
        }
    },
    scene: [
        Boot,
        Preloader,
        MainMenu,
        Settings,
        Controls,
        Credits,
        levelone,
        leveltwo,
        GameOver
    ]
};

const StartGame = (parent: string) => {

    return new Game({ ...config, parent });

}

export default StartGame;
