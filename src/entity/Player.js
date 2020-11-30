import 'phaser';
import {TILE_SIZE} from '../scenes/BgScene'

export default class Player extends Phaser.Physics.Arcade.Sprite {

  playerOffsetX() {
    return TILE_SIZE / 2
  }

  playerOffsetY() {
    return TILE_SIZE / 2
  }

  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene;
    this.scene.add.existing(this);

    this.setPosition(
      x * TILE_SIZE + this.playerOffsetX(),
      y * TILE_SIZE + this.playerOffsetY()
    )

    this.moveDelay = 0
    this.lastMoved = 0
  }

  getPosition(){
    return this.getCenter();
  }

  resetPosition(position){
    this.setPosition(position.x, position.y)
  }

  // Check which controller button is being pushed and execute movement & animation
  update(time, allKeys) {
    if (time > this.lastMoved){
      let keyButton
      Object.keys(allKeys).map(key=>{
        keyButton = allKeys[key]["key"]
        if (keyButton.isDown && !keyButton.shiftKey){
          allKeys[key]["function"]()
          this.lastMoved = time + this.moveDelay;
        }
      })
    }
  }
}
