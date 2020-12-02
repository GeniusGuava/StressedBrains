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
    this.input.keyboard.enabled=false
    Object.keys(this.allKeys).map(key=>{
      this.allKeys[key]["key"].isDown = false
    })
    this.scene.sleep('UIScene');
    this.scene.switch('MapScene');
  }

  wake() {
    this.input.keyboard.enabled = true
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

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('enemy', 'assets/audio/enemy.wav')
    this.load.audio('attack', 'assets/audio/attack.wav')
    this.load.audio('lose', 'assets/audio/loseBattle.wav')
    this.load.audio('win', 'assets/audio/winBattle.wav')
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
    this.enemySound = this.sound.add('enemy')
    this.attackSound = this.sound.add('attack')
    this.loseSound = this.sound.add('lose')
    this.winSound = this.sound.add('win')

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

    this.playerBar=this.makeBar(8,8,0x2ecc71);
        this.setValue(this.playerBar,100);

    this.enemyBar=this.makeBar(250, 8,0xe74c3c);
        this.setValue(this.enemyBar,100);

        this.add.text(8, 8, 'You', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif,', color: 'black', fontSize: '3000px' })

        this.add.text(250, 8, 'Enemy', { fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif,', color: 'black', fontSize: '3000px' })

    // // Create sounds

    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.overlap(this.player, this.enemies, this.onMeetEnemy, null, this)
    this.physics.add.overlap(this.player, this.weapons, this.playerAttack, null, this)

    // switch between battle scenes
    this.timeEvent = this.time.addEvent({delay: 8000, callback: this.exitBattle, callbackScope: this});
    this.sys.events.on('wake', this.wake, this);

  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(time, this.allKeys)
    this.gridPhysics.update(delta)
  }

  onMeetEnemy(player, enemy){
    this.enemySound.play()
    this.gridPhysics.stopMoving()
    this.gridPhysics.tileSizePixelsWalked = 0
    this.player.resetPosition(this.player.startPosition)
    player.hp --
    const third = (this.playerBar.scaleX - .33)*100
    this.setValue(this.playerBar, third)
    if(player.hp <=0){
      player.disableBody(true, true)
      this.loseSound.play()
      this.setValue(this.playerBar, 0)
    }
  }

  playerAttack(player, weapon){
    this.attackSound.play()
    this.gridPhysics.stopMoving()
    this.gridPhysics.tileSizePixelsWalked = 0
    this.player.resetPosition(this.player.startPosition)
    this.enemies.hp --
    this.weapons.killAndHide(weapon)
    weapon.body.enable = false
    const third = (this.enemyBar.scaleX - .33)*100
    this.setValue(this.enemyBar, third)
    if(this.enemies.hp <=0){
      this.enemies.clear(true, false)
      this.winSound.play()
      this.setValue(this.enemyBar, 0)
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
    this.createWeapon(16, 16)
    this.createWeapon(48, 496)
    this.createWeapon(592, 304)
    this.createEnemy(48, 48)
    this.createEnemy(80, 48)
    this.createEnemy(592, 16)
    this.createEnemy(400, 208)
    this.createEnemy(624, 304)
    this.createEnemy(560, 304)
    this.createEnemy(16, 496)
    this.createEnemy(400, 400)
    this.createEnemy(336, 16)
    this.createEnemy(336, 336)
    this.createEnemy(592, 528)
    this.createEnemy(400, 560)
    this.createEnemy(112, 80)
    this.createEnemy(80, 560)
  }
  makeBar(x, y,color) {
    //draw the bar
    let bar = this.add.graphics();

    //color the bar
    bar.fillStyle(color, 1);

    //fill the bar with a rectangle
    bar.fillRect(0, 0, 200, 50);

    //position the bar
    bar.x = x;
    bar.y = y;

    //return the bar
    return bar;
}
setValue(bar,percentage) {
    //scale the bar
    bar.scaleX = percentage/100;
}

}
