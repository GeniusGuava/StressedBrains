import 'phaser';

export default class BgScene extends Phaser.Scene {
  constructor() {
    super('BgScene');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITE HERE >>
    this.load.image('sky', 'assets/backgrounds/sky.png')
  }

  create() {
    this.add.image(-160, 0, 'sky').setOrigin(0).setScale(.5)
    // Create Sprites
    // << CREATE SPRITE HERE >>
  }
}
