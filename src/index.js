/** @type {import("../typings/phaser")} */

import TitleScene from './scenes/TitleScene';
import MainScene from './scenes/MainScene';
import MapScene from './scenes/MapScene';
import config from './config/config';
import BattleScene from './scenes/BattleScene';
import 'phaser';
import Phaser from 'phaser';


let titleScene = new TitleScene()

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add('TitleScene', titleScene)
    this.scene.add('BattleScene', BattleScene)
    this.scene.add('MapScene', MapScene)
    this.scene.add('MainScene', MainScene);

    this.scene.start('TitleScene');
  }
}

const game = new Game();
