import 'phaser';
import {Direction} from '../MapInfo'
export default class Controls  {
  constructor(scene, level=0){
    this.level = level
    this.scene = scene
  }

  getKeys(){
    return {
      h: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.LEFT,
              time,
              this.scene.collideSound
            );
        },
      },
      j: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.DOWN,
              time,
              this.scene.collideSound
            );
        },
      },
      k: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.UP, 
              time, 
              this.scene.collideSound
            );
        },
      },
      l: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.RIGHT,
              time,
              this.collideSound
            );
        },
      },
      w: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        function: (time, shift) => {
          if (this.level >= 4 && shift){
            this.jumpToNextWord(
              this.scene.player, 
              this.scene.text, 
              this.scene.collideSound
            )
          }
          else if (!shift){
            this.jumpToNextword(
              this.player, 
              this.text, 
              this.collideSound
            );
          }
        },
      },
    }
  }
}
