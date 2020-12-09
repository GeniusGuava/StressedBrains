import 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene');
  }

  create() {
    this.game.playerAlive = true
    this.scene.launch('MapScene')
    this.game.level = parseInt(localStorage.getItem('level')) || 0
    localStorage.setItem('level', this.game.level)
  }
}
