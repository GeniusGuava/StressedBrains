import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene');
  }

  create() {
    this.game.playerAlive = true
    this.game.level = 0
    this.scene.launch('MapScene')
    // this.scene.launch('BattleScene')


  }
}
