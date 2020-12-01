import 'phaser';
import {TILE_SIZE} from '../scenes/MapScene'

export default class Key extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey){
    super(scene, x, y, spriteKey, 2);

    this.scene = scene;

    this.scene.physics.world.enable(this)
    this.scene.add.existing(this)
  }
}
