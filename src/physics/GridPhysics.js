import {Direction} from '../scenes/FgScene'
import {Player} from '../entity/Player'
import {TILE_SIZE} from '../scenes/BgScene'

const Vector2 = Phaser.Math.Vector2

export class GridPhysics {
  constructor(){

    this.movementDirection = Direction.NONE;
    this.speedPixelsPerSecond = TILE_SIZE * 3;
    this.tileSizePixelsWalked = 0;
    this.decimalPlacesLeft = 0
  }

  movePlayer(direction){
    if (!this.isMoving()){
      console.log(direction)
      this.startMoving(direction);
    }
  }

  update(delta){
    if (this.isMoving()){
      this.updatePlayerPosition(delta)
    }
  }

  updatePlayerPosition(delta){
  }

  startMoving(direction){
    this.movementDirection = direction;
  }

  isMoving() {
    return this.movementDirection != Direction.NONE;
  }
}
