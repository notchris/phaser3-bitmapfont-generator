import '../css/style.css';
import Phaser from 'phaser';
import Main from './Scene';

const gameConfig = {
    width: 512,
    height: 512,
    type: Phaser.CANVAS,
    parent: 'phaser',
    backgroundColor: {
        r: 0,
        g: 0,
        b: 0,
        a: 0
    },
    transparent: true,
    scale: {
        mode: Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NO_CENTER,
    },
    disableContextMenu: false,
    render: {
        antialias: false,
        pixelArt: true,
        roundPixels: true,
    },
    scene: [Main],
};

export class Game extends Phaser.Game {
    // eslint-disable-next-line no-useless-constructor
    constructor(config) {
        super(config);
    }
}

const game = new Game(gameConfig);