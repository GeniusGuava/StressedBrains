import { TitleScene, MainScene, MapScene, CreditScene, BattleScene, TutorialScene } from './scenes';
import config from './config/config';
import Phaser from 'phaser';

let titleScene = new TitleScene()

class Game extends Phaser.Game {
  constructor() {
    super(config);

    this.scene.add('TitleScene', titleScene)
    this.scene.add('BattleScene', BattleScene)
    this.scene.add('MapScene', MapScene)
    this.scene.add('MainScene', MainScene);
    this.scene.add('CreditScene', CreditScene)
    this.scene.add('TutorialScene', TutorialScene)

    this.scene.start('TitleScene');
  }
}

const game = new Game();
