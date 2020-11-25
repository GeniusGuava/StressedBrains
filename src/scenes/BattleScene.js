
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
    this.load.spritesheet('player', 'assets/spriteSheets/basicIdle.png', {})
    this.load.spritesheet('enemy', 'assets/spriteSheets/enemy.png', {})
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    this.player = new Player(this, 0, 0, 'player')
    this.enemy = new Enemy(this, 0, 0, 'enemy')
    const level = [
      [20, 9, 13, 5],
      [0, 20, 15, 0],
      [0, 2, 1, 20],
      [20, 12, 5, 0]
    ]
    const map = this.make.tilemap({ data: level, tileHeight: 64, tileWidth: 64 });
    const tiles = map.addTilesetImage("letters");
    const ground = map.createStaticLayer(0, tiles, 0, 0)

    // // Create sounds

    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.overlap(this.player, this.enemy, this.onMeetEnemy)
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(this.cursors)
  }
  createAnimations(){
    this.anims.create({
      key: 'playerAttack',
      frame: this.anims.generateFrameNumbers(player, {
        start: #, end: # }),
        fameRate: 10,
        repeat: -1
      }),
      this.anims.create({
        key: 'enemyAttack',
        frame: this.anims.generateFrameNumbers(enemy, {
          start: #, end: # }),
          fameRate: 10,
          repeat: -1
        })
    }
  onMeetEnemy(){
    this.player.hp --
    if(this.player.hp <=0){
      this.player.alive = false
    }
  }

  playerAttack(){
    this.enemy.hp --
    if(this.enemy.hp <=0){
      this.enemy.disableBody(true, true)
    }
  }

}
