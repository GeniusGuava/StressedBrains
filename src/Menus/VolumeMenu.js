const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;

export default class VolumeMenu {
  constructor(scene, game, audioFiles, offset=0){
    this.scene = scene
    this.game = game
    this.audioFiles = audioFiles
    this.offset = offset
  }
  buildMenu() {
    this.volumeRect = this.scene.add.rectangle(815, 530+this.offset, 110, 75, COLOR_PRIMARY)
    this.volumeRect.setStrokeStyle(2, COLOR_LIGHT)

    this.upButton = this.scene.add
      .text(850, 500+this.offset, "^", 
      {
        fontSize: "16px",
        color: 'white',
    }).setInteractive({useHandCursor: true})
      .on('pointerdown', () => {
        if (this.game.volume<10){
          this.game.volume++
          this.updateVolume()
        }
      })
    this.scene.add
      .text(774, 525+this.offset, `Volume:`,
      {
        fontSize: "16px",
        color: 'white',
      })
    this.volume = this.scene.add
      .text(850, 525+this.offset, `${this.game.volume}`,
      {
        fontSize: "16px",
        color: 'white',
      })
    this.downButton = this.scene.add
      .text(850, 550+this.offset, "v",
      {
        fontSize: "16px",
        color: 'white',
      }).setInteractive({useHandCursor: true})
      .on('pointerdown', () => {
        if (this.game.volume>0){
          this.game.volume--
          this.updateVolume()
        }
      })
  }
  updateVolume(){
    this.volume.setText(`${this.game.volume}`)
    this.audioFiles.map(file => {
      file.sound.volume = this.game.volume * file.weight
    })
  }
}
