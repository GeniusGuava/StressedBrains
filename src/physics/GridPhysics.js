import {Direction} from '../scenes/FgScene'
import {Player} from '../entity/Player'
import {TILE_SIZE} from '../scenes/BgScene'
import 'phaser';

const Vector2 = Phaser.Math.Vector2

export class GridPhysics {
  constructor(player, map){

    this.movementDirection = Direction.NONE;
    this.speedPixelsPerSecond = TILE_SIZE * 8;
    this.tileSizePixelsWalked = 0;
    this.decimalPlacesLeft = 0
    this.player = player
    this.movementDirectVectors = {
      [Direction.UP]: new Vector2(0,-1),
      [Direction.DOWN]: new Vector2(0,1),
      [Direction.LEFT]: new Vector2(-1,0),
      [Direction.RIGHT]: new Vector2(1,0)
    }
    this.map = map
  }

  tilePosInDirection(direction){
    return this.player.getTilePos().add(this.movementDirectVectors[direction])
  }

  isBlockingDirection(direction){
    return this.hasBlockingTile(this.tilePosInDirection(direction))
  }

  hasNoTile(pos){
    return !this.map.layers.some((layer)=>{
      if(this.map.hasTileAt(pos.x, pos.y, layer.name)){
        return true
      } else return false
    })
  }

  hasBlockingTile(pos){
    if (this.hasNoTile(pos)) return true
    return this.map.layers.some((layer)=> {
      const tile = this.map.getTileAt(pos.x, pos.y, false, layer.name)
      return tile && tile.properties.collides
    })
  }

  startMoving(direction){
    this.movementDirection = direction;
  }

  movePlayer(direction){
    if (this.isMoving()) return
    if (this.isBlockingDirection(direction)){
      //this.player.setStandingFrame(direction);
    } else {
      this.startMoving(direction);
    }
  }

  movementDistance(speed){
    return this.movementDirectVectors[this.movementDirection].clone().multiply(new Vector2(speed))
  }

  movePlayerSprite(speed){
    const newPlayerPos = this.player.getPosition().add(this.movementDistance(speed))
    this.player.resetPosition(newPlayerPos)
    this.tileSizePixelsWalked += speed;
    this.tileSizePixelsWalked %= TILE_SIZE
  }

  update(delta){
    if (this.isMoving()){
      this.updatePlayerPosition(delta)
    }
  }

  getSpeedPerDelta(delta){
    const deltaInSeconds = delta/1000;
    return this.speedPixelsPerSecond * deltaInSeconds
  }

  getIntegerPart(float){
    return Math.floor(float);
  }

  getDecimalPlaces(float){
    return float % 1;
  }

  willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate){
    return (
      this.tileSizePixelsWalked + pixelsToWalkThisUpdate >= TILE_SIZE
    )
  }

  movePlayerSpriteRestOfTile(){
    this.movePlayerSprite(TILE_SIZE - this.tileSizePixelsWalked);
    this.stopMoving()
  }

  stopMoving(){
    this.movementDirection = Direction.NONE;
  }

  updatePlayerPosition(delta){
    this.decimalPlacesLeft = this.getDecimalPlaces(
      this.getSpeedPerDelta(delta) + this.decimalPlacesLeft
    );
    const pixelsToWalkThisUpdate = this.getIntegerPart(
      this.getSpeedPerDelta(delta) + this.decimalPlacesLeft
    )
    if (this.willCrossTileBorderThisUpdate(pixelsToWalkThisUpdate)){
      this.movePlayerSpriteRestOfTile();
    }else{
      this.movePlayerSprite(pixelsToWalkThisUpdate)
    }
  }


  isMoving() {
    return this.movementDirection != Direction.NONE;
  }
}
