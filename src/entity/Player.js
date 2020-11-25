import 'phaser';

export default class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, spriteKey) {
    super(scene, x, y, spriteKey);
    // << INITIALIZE PLAYER ATTRIBUTES HERE >>
    this.scene = scene;
    this.scene.add.existing(this);

    this.moveDelay = 200
    this.lastMoved = 0
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
