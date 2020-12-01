import Player from "../entity/Player"
import Enemy from "../entity/Enemy"
import { GridPhysics } from "../physics/GridPhysics"
import { Direction } from './FgScene'

class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene')
  }
  create () {       
      this.graphics = this.add.graphics();
      this.graphics.lineStyle(1, 0xffffff);
      this.graphics.fillStyle(0x031f4c, 1);        
      this.graphics.strokeRect(2, 150, 90, 100);
      this.graphics.fillRect(2, 150, 90, 100);
      this.graphics.strokeRect(95, 150, 90, 100);
      this.graphics.fillRect(95, 150, 90, 100);
      this.graphics.strokeRect(188, 150, 130, 100);
      this.graphics.fillRect(188, 150, 130, 100);
  }
}

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
    this.onMeetEnemy = this.onMeetEnemy.bind(this)
    this.createGroups = this.createGroups.bind(this)
    this.createWeapon = this.createWeapon.bind(this)
    this.playerAttack = this.playerAttack.bind(this)
    this.createEnemy = this.createEnemy.bind(this)
  }

  exitBattle() {
    this.scene.sleep('UIScene');
    this.scene.switch('MainScene');
  }

  wake() {
    this.scene.run('UIScene');  
    this.time.addEvent({delay: 5000, callback: this.exitBattle, callbackScope: this});        
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.spritesheet('letters', 'assets/spriteSheets/letters.png', {
      frameWidth: 32,
      frameHeight: 32
    })
    this.load.spritesheet('battle', 'assets/backgrounds/tiles.png', {
    frameHeight: 32,
    frameWidth: 32
  })
  this.load.spritesheet('enemy', 'assets/backgrounds/enemy.png', {
    frameWidth: 32,
    frameHeight: 32
  })
  this.load.spritesheet('sword', 'assets/backgrounds/sword.png', {
  frameHeight: 32,
  frameWidth: 32
})

    // this.load.spritesheet('player', 'assets/spriteSheets/basicIdle.png', {
    // })
    // this.load.spritesheet('enemy', 'assets/spriteSheets/enemy.png', {})
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>

    const level = [
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0],
      [20, 9, 13, 5, 0, 20, 15, 0, 0, 2, 1, 20, 20, 12, 5, 0, 20, 9, 13, 5, 0, 20, 15, 0, 0]

    ]
    const map = this.make.tilemap({ data: level, tileHeight: 32, tileWidth: 32 });
    const tiles = map.addTilesetImage("letters");
    const ground = map.createStaticLayer(0, tiles, 0, 0)
    this.player = new Player(this, 16, 16, 'battle')
    this.player.setFrame(4)
    this.player.hp = 3

    this.player.startPosition = this.player.getPosition()
    // this.weapon = new Enemy(this, 336, 50, null)
    this.gridPhysics = new GridPhysics(this.player, map)
    this.keyboard = this.input.keyboard
    this.createGroups()
    this.enemies.hp = 3
    this.allKeys = {
      "h": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        "function": () => {
          this.gridPhysics.movePlayer(Direction.LEFT)
        }
      },
      "j": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        "function": () => {
          this.gridPhysics.movePlayer(Direction.DOWN)
        }
      },
      "k": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        "function": () => {
          this.gridPhysics.movePlayer(Direction.UP)
        }
      },
      "l": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        "function": () => {
          this.gridPhysics.movePlayer(Direction.RIGHT)
        }
      },
    }

    // // Create sounds

    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.overlap(this.player, this.enemies, this.onMeetEnemy, null, this)
    this.physics.add.overlap(this.player, this.weapons, this.playerAttack, null, this)

    // switch between battle scenes
    this.timeEvent = this.time.addEvent({delay: 5000, callback: this.exitBattle, callbackScope: this});
    this.sys.events.on('wake', this.wake, this);

  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(time, this.allKeys)
    this.gridPhysics.update(delta)

    // if(!this.player.alive){
    //   this.player.play('playerDeath', true)
    // }

  }
  // createAnimations(){
  //   this.anims.create({
  //     key: 'playerAttack',
  //     frame: this.anims.generateFrameNumbers(player, {
  //       start: #, end: # }),
  //       fameRate: 10,
  //       repeat: -1
  //     }),
  //     this.anims.create({
  //       key: 'enemyAttack',
  //       frame: this.anims.generateFrameNumbers(enemy, {
  //         start: #, end: # }),
  //         fameRate: 10,
  //         repeat: -1
  //       })
  //   }
  onMeetEnemy(player, enemy){
    this.gridPhysics.stopMoving()
    this.gridPhysics.tileSizePixelsWalked = 0
    this.player.resetPosition(this.player.startPosition)
    player.hp --
    if(player.hp <=0){
      player.disableBody(true, true)
    }
  }

  playerAttack(){
    this.gridPhysics.stopMoving()
    this.gridPhysics.tileSizePixelsWalked = 0
    this.player.resetPosition(this.player.startPosition)
    console.log(this.enemies.hp)
    this.enemies.hp --
    this.weapons.remove(this.weapons.getLast(true), true)
    if(this.enemies.hp <=0){
      this.enemies.clear(true, false)
    }
  }
  createWeapon(x, y) {
    this.weapons.create(x, y, 'sword');
    }

  createEnemy(x, y) {
    this.enemies.create(x, y, 'enemy')
  }

  createGroups () {
    this.weapons = this.physics.add.group({
      classType: Enemy
    })
    this.enemies = this.physics.add.group({
      classType: Enemy
    })
    this.createWeapon(32, 32)
    this.createWeapon(55, 500)
    this.createWeapon(600, 300)
    this.createEnemy(32, 32)
    this.createEnemy(80, 62)
    this.createEnemy(700, 32)
    this.createEnemy(600, 62)
    this.createEnemy(650, 300)
    this.createEnemy(550, 300)
    this.createEnemy(32, 500)
    this.createEnemy(400, 400)
    this.createEnemy(340, 32)
    this.createEnemy(320, 330)
    this.createEnemy(600, 550)
    this.createEnemy(400, 560)
    this.createEnemy(92, 85)
    this.createEnemy(92, 580)
  }

}
