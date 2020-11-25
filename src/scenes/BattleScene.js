
export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.spritesheet('letters', 'assets/spriteSheets/letters.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    // this.load.spritesheet('player', 'assets/spriteSheets/basicIdle.png', {})
    //this.load.spritesheet('enemy', 'assets/spriteSheets/enemy.png, {})
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    // this.player = new Player(this, 0, 0, 'player')
    //this.enemy = new Enemy(this, 0, 0, 'enemy')
    const level = [
      [20, 9, 13, 5],
      [0, 20, 15, 0],
      [0, 2, 1, 20],
      [20, 12, 5, 0]
    ]
    const map = this.make.tilemap({ data: level, tileHeight: 64, tileWidth: 64 });
    const tiles = map.addTilesetImage("letters");
    const ground = map.createStaticLayer(0, tiles, 0, 0)
    // const letters = letterMap.addTilesetImage('letters')
    // const letterLayer = letterMap.createStaticLayer(1, letters, 0, 0)

    // // Create sounds

    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    //this.physics.add.collider(this.player, this.enemy)
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    // this.player.update(this.cursors)
  }

}
