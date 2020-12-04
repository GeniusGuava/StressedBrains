import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import { GridPhysics } from '../physics/GridPhysics';
import { Direction } from './FgScene';
import {
  enemySprite,
  weaponSprite,
  level,
  playerStartPosition,
  weapons,
  enemies,
  enemySize,
} from '../BattleInfo';

class UIScene extends Phaser.Scene {
  constructor() {
    super('UIScene');
  }
  create() {
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
    this.level = 0;
    this.onMeetEnemy = this.onMeetEnemy.bind(this);
    this.createGroups = this.createGroups.bind(this);
    this.createWeapon = this.createWeapon.bind(this);
    this.playerAttack = this.playerAttack.bind(this);
    this.createEnemy = this.createEnemy.bind(this);
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>
    this.load.spritesheet('letters', 'assets/spriteSheets/letters2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('battle', 'assets/backgrounds/tiles.png', {
      frameHeight: 32,
      frameWidth: 32,
    });
    this.load.spritesheet('enemy', enemySprite[this.level], {
      frameWidth: enemySize[this.level].w,
      frameHeight: enemySize[this.level].h,
    });
    this.load.spritesheet('sword', weaponSprite[this.level], {
      frameHeight: 32,
      frameWidth: 32,
    });
    this.load.spritesheet('Ariadne', 'assets/spriteSheets/george2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('warning', 'assets/spriteSheets/warning.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('enemy', 'assets/audio/enemy.wav');
    this.load.audio('attack', 'assets/audio/attack.wav');
    this.load.audio('lose', 'assets/audio/loseBattle.wav');
    this.load.audio('win', 'assets/audio/winBattle.wav');
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    const map = this.make.tilemap({
      data: level[this.level],
      tileHeight: 32,
      tileWidth: 32,
    });
    const tiles = map.addTilesetImage('letters');
    const ground = map.createStaticLayer(0, tiles, 0, 0);
    this.player = new Player(
      this,
      playerStartPosition[this.level].x,
      playerStartPosition[this.level].y,
      'Ariadne'
    );
    this.enemySprite = new Enemy(
      this,
      900, 200, 'enemy'
    )
    this.player.setFrame(4);
    this.player.hp = 3;
    this.enemySound = this.sound.add('enemy', { volume: 0.25 });
    this.attackSound = this.sound.add('attack', { volume: 0.25 });
    this.loseSound = this.sound.add('lose', { volume: 0.25 });
    this.winSound = this.sound.add('win', { volume: 0.25 });
    this.createAnimations()

    this.player.startPosition = this.player.getPosition();
    this.gridPhysics = new GridPhysics(this.player, map);
    this.keyboard = this.input.keyboard;
    this.createGroups();
    this.enemies.hp = 3;
    this.allKeys = {
      h: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        function: () => {
          this.gridPhysics.movePlayer(Direction.LEFT);
        },
      },
      j: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        function: () => {
          this.gridPhysics.movePlayer(Direction.DOWN);
        },
      },
      k: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        function: () => {
          this.gridPhysics.movePlayer(Direction.UP);
        },
      },
      l: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        function: () => {
          this.gridPhysics.movePlayer(Direction.RIGHT);
        },
      },
    };

    this.playerBar = this.makeBar(8, 8, 0x2ecc71);
    this.setValue(this.playerBar, 100);

    this.enemyBar = this.makeBar(250, 8, 0xe74c3c);
    this.setValue(this.enemyBar, 100);

    this.add.text(8, 8, 'You', {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif,',
      color: 'black',
      fontSize: '3000px',
    });

    this.add.text(250, 8, 'Enemy', {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif,',
      color: 'black',
      fontSize: '3000px',
    });

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.onMeetEnemy,
      null,
      this
    );
    this.physics.add.overlap(
      this.player,
      this.weapons,
      this.playerAttack,
      null,
      this
    );
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(time, this.allKeys);
    this.gridPhysics.update(delta);
  }

  onMeetEnemy(player, enemies, x, y) {
    this.enemySound.play();
    this.enemySprite.play('enemyAttack')
    this.gridPhysics.stopMoving();
    this.gridPhysics.tileSizePixelsWalked = 0;
    this.player.resetPosition(this.player.startPosition);
    this.player.hp--;
    const third = (this.playerBar.scaleX - 0.30) * 100;
    this.setValue(this.playerBar, third);
    if (this.player.hp <= 0) {
      this.loseSound.play();
      this.endBattle();
      this.sys.events.on('wake', this.wake, this);
    }
  }

  playerAttack(player, weapon, x, y) {
    this.attackSound.play();
    this.enemies.hp--;
    weapon.setActive(false).setVisible(false)
    weapon.body.enable = false;
    const third = (this.enemyBar.scaleX - 0.30) * 100;
    this.setValue(this.enemyBar, third);

    if (this.enemies.hp <= 0) {
      this.winSound.play();
      this.endBattle();
      this.sys.events.on('wake', this.wake, this);
    }
  }

  endBattle() {       
    // this.weapons.length = 0;
    // this.enemies.length = 0;
    Object.keys(this.allKeys).map((key) => {
      this.allKeys[key]['key'].isDown = false;
    });
    this.scene.restart()
    this.scene.sleep('UIScene')
    this.scene.switch('MapScene')
  }

  wake() {
    this.scene.restart()
    this.scene.run('UIScene');
  }

  createWeapon(x, y) {
    this.weapons.create(x, y, 'sword');
  }

  createEnemy(x, y) {
    this.enemies.create(x, y, 'warning');
  }

  createGroups() {
    this.weapons = this.physics.add.group({
      classType: Enemy,
    });
    this.enemies = this.physics.add.group({
      classType: Enemy,
    });

    weapons[this.level].map((coords) => {
      this.createWeapon(coords.x, coords.y);
    });

    enemies[this.level].map((coords) => {
      this.createEnemy(coords.x, coords.y);
    });
  }

  makeBar(x, y, color) {
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

  setValue(bar, percentage) {
    //scale the bar
    bar.scaleX = percentage / 100;
  }
  createAnimations() {
    this.anims.create({
      key: 'enemyIdle',
      frames: this.anims.generateFrameNumbers('enemy', { start: 1, end: 5 }),
      frameRate: 2,
      repeat: -1
    });
    this.anims.create({
      key: 'enemyAttack',
      frames: this.anims.generateFrameNumbers('enemy', { start: 6, end: 10 }),
      frameRate: 2,
    });
    this.anims.create({
      key: 'enemyDeath',
      frames: this.anims.generateFrameNumbers('enemy', { start: 11, end: 15 }),
      frameRate: 2,
    })
  }
}
