import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import Sprite from '../entity/Sprite';
import { GridPhysics } from '../physics/GridPhysics';
import { enemySprite, weaponSprite, getLevel, playerStartPosition, getWeapons,
  getEnemies, enemySize, getText, music } from '../BattleInfo';
import { battleText } from '../text/battleText';
import { helpContent } from '../text/helpText';
import Controls from '../physics/Controls';
import VolumeMenu from '../Menus/VolumeMenu';


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
    this.cache.tilemap.remove('map');
    this.graphics.strokeRect(95, 150, 90, 100);
    this.graphics.fillRect(95, 150, 90, 100);
    this.graphics.strokeRect(188, 150, 130, 100);
    this.graphics.fillRect(188, 150, 130, 100);
  }
}

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super('BattleScene');
    this.wins = 0;
    this.isAttacked = false;
    this.collideDelay = 500;
    this.awake = true;
    this.currentLevel = 0;
  }

  preload() {
    if (this.currentLevel!=this.game.level){
      this.wins = 0
      this.currentLevel = this.game.level
    }

    this.textures.remove('enemy')
    this.anims.remove('enemyAttack')

    this.load.spritesheet('letters', 'assets/backgrounds/spriteSheets/letters2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet('enemy', enemySprite[this.game.level], {
      frameWidth: enemySize[this.game.level].w,
      frameHeight: enemySize[this.game.level].h,
    });
    this.load.spritesheet('sword', weaponSprite[this.game.level], {
      frameHeight: 32,
      frameWidth: 32,
    });
    this.load.spritesheet('Ariadne', 'assets/spriteSheets/george2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet(
      'AriadneAttack',
      'assets/spriteSheets/battleSprite.png',
      {
        frameWidth: 32,
        frameHeight: 32,
      }
    );
    this.load.spritesheet('warning', 'assets/sprites/warning.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image(
      'nextPage',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png'
    );

    this.load.scenePlugin({
      key: 'rexuiplugin',
      url:
        'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI',
    });

    this.load.audio('enemy', 'assets/audio/battleSounds/enemy.wav');
    this.load.audio('attack', 'assets/audio/battleSounds/attack.wav');
    this.load.audio('lose', 'assets/audio/battleSounds/loseBattle.wav');
    this.load.audio('win', 'assets/audio/battleSounds/winBattle.wav');
    this.load.audio('collide', 'assets/audio/worldSounds/jump.wav');
    this.load.audio('battleBackground', music[this.game.level])
  }

  create() {
    this.sound.pauseAll()
    this.enemySound = this.sound.add('enemy');
    this.attackSound = this.sound.add('attack');
    this.loseSound = this.sound.add('lose');
    this.winSound = this.sound.add('win');
    this.collideSound = this.sound.add('collide');
    this.music = this.sound.add('battleBackground')

    this.volumeMenu = new VolumeMenu(this, this.game,
      [
        {sound: this.enemySound, weight: 0.05},
        {sound: this.attackSound, weight: 0.05},
        {sound: this.loseSound, weight: 0.05},
        {sound: this.winSound, weight: 0.025},
        {sound: this.collideSound, weight: 0.05},
        {sound: this.music, weight: 0.025},
      ],
      50)

    this.volumeMenu.buildMenu()
    this.volumeMenu.updateVolume()

    this.music.play()

    this.physics.world.bounds.y = 64;
    const map = this.make.tilemap({
      data: getLevel(this.game.level),
      tileHeight: 32,
      tileWidth: 32,
    });
    const tiles = map.addTilesetImage('letters');
    const ground = map.createStaticLayer(0, tiles, 0, 0);

    this.player = new Player(
      this,
      playerStartPosition[this.game.level].x,
      playerStartPosition[this.game.level].y,
      'Ariadne'
    );
    this.player.setFrame(4);
    this.player.hp = 3;
    this.player.startPosition = this.player.getPosition();
    this.playerBar = this.makeBar(8, 8, 0x2ecc71);
    this.setValue(this.playerBar, 100);
    this.add.text(8, 8, 'You', {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif,',
      color: 'black',
      fontSize: '3000px',
    });

    this.createAnimations();
    this.createGroups();
    this.enemies.hp = 3;
    this.enemyBar = this.makeBar(250, 8, 0xe74c3c);
    this.setValue(this.enemyBar, 100);
    this.add.text(250, 8, 'Enemy', {
      fontFamily: 'Georgia, "Goudy Bookletter 1911", Times, serif,',
      color: 'black',
      fontSize: '3000px',
    });

    this.enemySprite = new Sprite(this, 750, 500, 'enemy');
    this.playerSprite = new Sprite(this, 850, 500, 'AriadneAttack');

    this.gridPhysics = new GridPhysics(this.player, map);
    this.keyboard = this.input.keyboard;
    this.text = getText(this.game.level);

    this.controls = new Controls(this, this.game.level)
    this.allKeys = this.controls.getKeys()

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

    //help button
    let helpVisible = true;
    this.help = this.add
      .text(750, 20, ':help', { backgroundColor: '#000' })
      .setInteractive()
      .on('pointerdown', () => {
        if (!helpVisible) {
          this.helpText.setVisible(false);
          helpVisible = !helpVisible;
        } else {
          this.helpText.setVisible(true);
          helpVisible = !helpVisible;
        }
      });
    this.helpText = this.add
      .text(665, 50, helpContent[this.game.level], { wordWrap: { width: 250 }, fontSize: "12px" })
      .setVisible(false);

    /*
    createTextBox(this, 665, 325, {
      wrapWidth: 200,
    }).start(battleText[this.game.level], 50);
    */
  }

  update(time, delta) {
    this.player.update(time, this.allKeys);
    this.gridPhysics.update(delta);
  }

  onMeetEnemy(player, enemies, x, y) {
    if (!this.isAttacked) {
      this.isAttacked = true;
      this.enemySound.play();
      this.enemySprite.play('enemyAttack');
      this.gridPhysics.stopMoving();
      this.gridPhysics.tileSizePixelsWalked = 0;

      const third = (this.playerBar.scaleX - 0.3) * 100;
      this.setValue(this.playerBar, third);

      if (this.player.hp <= 1) {
        this.isAttacked = false;
        this.player.resetPosition(this.player.startPosition);
        this.loseSound.play();
        this.game.playerAlive = false;
        this.endBattle();
        this.sys.events.on('wake', this.wake, this);
      } else {
        this.player.resetPosition(this.player.startPosition);
        this.input.keyboard.enabled = false;
        Object.keys(this.allKeys).map((key) => {
          this.allKeys[key]['key'].isDown = false;
        });
        this.time.addEvent({
          delay: this.collideDelay,
          callback: () => {
            this.input.keyboard.enabled = true;
            this.player.hp--;
            this.isAttacked = false;
          },
        });
      }
    }
  }

  playerAttack(player, weapon, x, y) {
    this.attackSound.play();
    this.playerSprite.play('AriadneAttack');
    this.enemies.hp--;
    weapon.setActive(false).setVisible(false);
    weapon.body.enable = false;

    const third = (this.enemyBar.scaleX - 0.3) * 100;
    this.setValue(this.enemyBar, third);

    if (this.enemies.hp <= 0) {
      if (this.wins >= 3) this.wins = 0;
      else this.wins++;
      this.winSound.play();
      this.endBattle();
      this.player.resetPosition(this.player.startPosition);
      this.setValue(this.playerBar, 100);
      this.setValue(this.enemyBar, 100);
      this.createGroups();
      this.player.hp = 3;
      this.enemies.hp = 3;
      this.sys.events.on('wake', this.wake, this);
    }
  }

  endBattle() {
    this.awake = false

    this.input.keyboard.enabled = false;
    Object.keys(this.allKeys).map((key) => {
      this.allKeys[key]['key'].isDown = false;
    });

    this.music.pause()

    this.scene.sleep('UIScene')
    this.scene.switch('MapScene')
  }

  wake() {
    if (!this.awake){
      this.awake = true

      this.input.keyboard.enabled = true;
      this.game.playerAlive = true;
      this.cache.audio.remove('battleBackground')
      this.scene.run('UIScene');
      this.scene.restart();
    }
  }

  createWeapon(x, y) {
    this.weapons.create(x, y, 'sword');
    this.weapons.setAlpha(0.75);
  }

  createEnemy(x, y) {
    this.enemies.create(x, y, 'warning');
    this.enemies.setAlpha(0.5);
  }

  createGroups() {
    this.weapons = this.physics.add.group({
      classType: Enemy,
    });
    this.enemies = this.physics.add.group({
      classType: Enemy,
    });

    const weapons = getWeapons(this.game.level, this.wins);
    const enemies = getEnemies(this.game.level, this.wins);

    weapons.map((coords) => {
      this.createWeapon(coords.x, coords.y);
    });

    enemies.map((coords) => {
      this.createEnemy(coords.x, coords.y);
    });
  }

  makeBar(x, y, color) {
    let bar = this.add.graphics();
    bar.fillStyle(color, 1);
    bar.fillRect(0, 0, 200, 50);
    bar.x = x;
    bar.y = y;
    return bar;
  }

  setValue(bar, percentage) {
    bar.scaleX = percentage / 100;
  }

  createAnimations() {
    this.anims.create({
      key: 'enemyIdle',
      frames: this.anims.generateFrameNumbers('enemy', { start: 1, end: 5 }),
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'enemyAttack',
      frames: this.anims.generateFrameNumbers('enemy', { start: 5, end: 9 }),
      frameRate: 2,
    });
    this.anims.create({
      key: 'enemyDeath',
      frames: this.anims.generateFrameNumbers('enemy', { start: 11, end: 15 }),
      frameRate: 2,
    });
    this.anims.create({
      key: 'AriadneAttack',
      frames: this.anims.generateFrameNumbers('AriadneAttack', {
        start: 15,
        end: 17,
      }),
      frameRate: 2,
    });
  }
}

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;

const GetValue = Phaser.Utils.Objects.GetValue;
let createTextBox = function (scene, x, y, config) {
  let wrapWidth = GetValue(config, 'wrapWidth', 0);
  let fixedWidth = GetValue(config, 'fixedWidth', 0);
  let fixedHeight = GetValue(config, 'fixedHeight', 0);
  let textBox = scene.rexUI.add
    .textBox({
      x: x,
      y: y,

      background: scene.rexUI.add
        .roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
        .setStrokeStyle(2, COLOR_LIGHT),

      text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

      action: scene.add
        .image(0, 0, 'nextPage')
        .setTint(COLOR_LIGHT)
        .setVisible(false),

      space: {
        left: 20,
        right: 20,
        top: 20,
        bottom: 20,
        icon: 10,
        text: 10,
      },
    })
    .setOrigin(0)
    .layout();

  textBox
    .setInteractive()
    .on(
      'pointerdown',
      function () {
        let icon = this.getElement('action').setVisible(false);
        this.resetChildVisibleState(icon);
        if (this.isTyping) {
          this.stop(true);
        } else {
          this.typeNextPage();
        }
      },
      textBox
    )
    .on(
      'pageend',
      function () {
        if (this.isLastPage) {
          return;
        }

        let icon = this.getElement('action').setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;
        let tween = scene.tweens.add({
          targets: icon,
          y: '+=30',
          ease: 'Bounce',
          duration: 500,
          repeat: 0,
          yoyo: false,
        });
      },
      textBox
    );

  return textBox;
};

let getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.rexUI.add.BBCodeText(0, 0, '', {
    fixedWidth: fixedWidth,
    fixedHeight: fixedHeight,

    fontSize: '12px',
    wrap: {
      mode: 'word',
      width: wrapWidth,
    },
    maxLines: 4,
  });
};
