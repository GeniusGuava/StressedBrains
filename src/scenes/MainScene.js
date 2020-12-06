import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene');
  }

  create() {
    this.game.playerAlive = true
    this.scene.launch('MapScene')
    // this.scene.launch('BattleScene')


  }
}
