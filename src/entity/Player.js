import 'phaser';
import {TILE_SIZE} from '../scenes/BgScene'

const Vector2 = Phaser.Math.Vector2

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
    this.scene.physics.world.enable(this)
    this.scene.add.existing(this);
    this.setCollideWorldBounds(true)

    this.setPosition(
      x * TILE_SIZE + this.playerOffsetX(),
      y * TILE_SIZE + this.playerOffsetY()
    )

    this.moveDelay = 100
    this.lastMoved = 0
  }

  getPosition(){
    return this.getCenter();
  }

  resetPosition(position){
    this.setPosition(position.x, position.y)
  }

  getTilePos(){
    const x = (this.getCenter().x - this.playerOffsetX())/TILE_SIZE
    const y = (this.getCenter().y - this.playerOffsetY())/TILE_SIZE
    return new Vector2(Math.floor(x), Math.floor(y))
  }

  // Check which controller button is being pushed and execute movement & animation
  update(time, allKeys) {
    if (time > this.lastMoved){
      let keyButton
      Object.keys(allKeys).map(key=>{
        keyButton = allKeys[key]["key"]
        if (keyButton.isDown && !keyButton.shiftKey){
          allKeys[key]["function"](time)
          this.lastMoved = time + this.moveDelay;
        }
      })
    }
  }
}
