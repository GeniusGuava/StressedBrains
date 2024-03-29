import Phaser from 'phaser'

export default class MainScene extends Phaser.Scene {
  constructor(){
    super('MainScene');
  }

  preload() {
    this.load.spritesheet('Ariadne', 'assets/spriteSheets/george2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      'AriadneAttack',
      'assets/spriteSheets/battleSprite.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    )
    this.load.audio('collide', 'assets/audio/worldSounds/jump.wav');
    this.load.image(
      'nextPage',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png'
    )
  }
  create() {
    this.game.playerAlive = true
    this.game.volume = 3
    this.createAnimations()
    if (this.game.level==0) this.scene.launch('TutorialScene')
    else this.scene.launch('MapScene')
    localStorage.setItem('level', this.game.level)
  }
  createAnimations() {
    this.anims.create({
      key: 'left',
      frames: [
        { key: 'Ariadne', frame: 1 },
        { key: 'Ariadne', frame: 5 },
        { key: 'Ariadne', frame: 9 },
        { key: 'Ariadne', frame: 13 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'right',
      frames: [
        { key: 'Ariadne', frame: 3 },
        { key: 'Ariadne', frame: 7 },
        { key: 'Ariadne', frame: 11 },
        { key: 'Ariadne', frame: 15 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: [
        { key: 'Ariadne', frame: 0 },
        { key: 'Ariadne', frame: 4 },
        { key: 'Ariadne', frame: 8 },
        { key: 'Ariadne', frame: 12 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: [
        { key: 'Ariadne', frame: 2 },
        { key: 'Ariadne', frame: 6 },
        { key: 'Ariadne', frame: 10 },
        { key: 'Ariadne', frame: 14 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'Ariadne', frame: 0 }],
      frameRate: 2,
    });
    this.anims.create({
      key: 'AriadneAttack',
      frames: this.anims.generateFrameNumbers('AriadneAttack', {
        start: 15,
        end: 17,
      }),
      frameRate: 2,
    });
  }

}
