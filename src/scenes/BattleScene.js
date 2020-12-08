import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import Sprite from '../entity/Sprite';
import { GridPhysics } from '../physics/GridPhysics';
import { Direction } from './FgScene';
import {
  enemySprite,
  weaponSprite,
  getLevel,
  playerStartPosition,
  getWeapons,
  getEnemies,
  enemySize,
  getText,
} from '../BattleInfo';
import { TILE_SIZE } from '../MapInfo';
import { battleText } from '../text/battleText';
import { helpContent } from '../text/helpText';

const PUNCTUATION = [",", "'", "!", "?"]

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
    this.onMeetEnemy = this.onMeetEnemy.bind(this);
    this.createGroups = this.createGroups.bind(this);
    this.createWeapon = this.createWeapon.bind(this);
    this.playerAttack = this.playerAttack.bind(this);
    this.createEnemy = this.createEnemy.bind(this);
    this.wins = 0;
    this.isAttacked = false;
    this.collideDelay = 500;
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
    this.load.spritesheet('warning', 'assets/spriteSheets/warning.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.scenePlugin({
      key: 'rexuiplugin',
      url:
        'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js',
      sceneKey: 'rexUI',
    });
    this.load.image(
      'nextPage',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png'
    );
    // Preload Sounds
    // << LOAD SOUNDS HERE >>
    this.load.audio('enemy', 'assets/audio/enemy.wav');
    this.load.audio('attack', 'assets/audio/attack.wav');
    this.load.audio('lose', 'assets/audio/loseBattle.wav');
    this.load.audio('win', 'assets/audio/winBattle.wav');
    this.load.audio('collide', 'assets/audio/jump.wav');
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
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
    this.enemySprite = new Sprite(this, 750, 500, 'enemy');
    this.playerSprite = new Sprite(this, 850, 500, 'AriadneAttack');
    this.player.setFrame(4);
    this.player.hp = 3;
    this.enemySound = this.sound.add('enemy', { volume: 0.25 });
    this.attackSound = this.sound.add('attack', { volume: 0.25 });
    this.loseSound = this.sound.add('lose', { volume: 0.25 });
    this.winSound = this.sound.add('win', { volume: 0.25 });
    this.collideSound = this.sound.add('collide', { volume: 0.25 });
    this.createAnimations();

    this.player.startPosition = this.player.getPosition();
    this.gridPhysics = new GridPhysics(this.player, map);
    this.keyboard = this.input.keyboard;
    this.createGroups();
    this.enemies.hp = 3;

    this.text = getText(this.game.level);
    this.allKeys = {
      h: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        function: (time, shift) => {
          if (!shift)
            this.gridPhysics.movePlayer(
              Direction.LEFT,
              time,
              this.collideSound
            );
        },
      },
      j: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        function: (time, shift) => {
          if (!shift)
            this.gridPhysics.movePlayer(
              Direction.DOWN,
              time,
              this.collideSound
            );
        },
      },
      k: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        function: (time, shift) => {
          if (!shift)
            this.gridPhysics.movePlayer(Direction.UP, time, this.collideSound);
        },
      },
      l: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        function: (time, shift) => {
          if (!shift)
            this.gridPhysics.movePlayer(
              Direction.RIGHT,
              time,
              this.collideSound
            );
        },
      },
      w: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        function: (time, shift) => {
          if ((!shift && this.game.level >= 1 && this.game.level < 4) || (this.game.level>=4 && shift))
            this.jumpToNextWord(this.player, this.text, this.collideSound);
          else if (this.game.level >=4 && !shift)
            this.jumpToNextword(this.player, this.text, this.collideSound);
        },
      },
      b: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
        function: (time, shift) => {
          if ((!shift && this.game.level >= 2 && this.game.level < 4) || (this.game.level>=4 && shift))
            this.jumpToPreviousWord(this.player, this.text, this.collideSound);
          else if (this.game.level>=4 && !shift) 
            this.jumpToPreviousword(this.player,this.text, this.collideSound);
        },
      },
      e: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        function: (time, shift) => {
          if ((!shift && this.game.level >= 3 && this.game.level < 4) || (this.game.level>=4 && shift))
            this.jumpToEndOfWord(this.player, this.text, this.collideSound);
          else if (this.game.level>=4 && !shift)
            this.jumpToEndOfword(this.player, this.text, this.collideSound)
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
      .text(665, 50, helpContent[this.game.level], {
        wordWrap: { width: 250 },
        fontSize: '12px',
      })
      .setVisible(false);

    createTextBox(this, 665, 300, {
      wrapWidth: 200,
    }).start(battleText[this.game.level], 50);
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
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
      // console.log('enemy is attacking');

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
    // this.weapons.length = 0;
    // this.enemies.length = 0;
    this.input.keyboard.enabled = false;
    Object.keys(this.allKeys).map((key) => {
      this.allKeys[key]['key'].isDown = false;
    });
    this.scene.sleep('UIScene');
    this.scene.switch('MapScene');
  }

  wake() {
    this.input.keyboard.enabled = true;
    this.scene.restart();
    this.game.playerAlive = true;
    this.scene.run('UIScene');
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

  getRowAndInd(playerPos, text){
    const xGrid = (playerPos.x - TILE_SIZE / 2) / TILE_SIZE;
    const yGrid = (playerPos.y - TILE_SIZE / 2) / TILE_SIZE - 2;
    const textRows = text.split('\n');
    const currentRow = Array.from(textRows[yGrid]).slice(2);
    return {currentInd: xGrid, currentRow}
  }

  jumpToNextWord(player, text, collideSound) {
    const playerPos = player.getPosition();
    let {currentInd, currentRow} = this.getRowAndInd(playerPos, text)
    let currentChar = currentRow[currentInd];
    while (currentChar != ' ' && currentInd < currentRow.length - 1) {
      currentInd++;
      currentChar = currentRow[currentInd];
    }
    const indToJump = currentInd + 1;
    if (indToJump != currentRow.length && currentRow[indToJump] != ' ') {
      player.setPosition(indToJump * TILE_SIZE + TILE_SIZE / 2, playerPos.y);
    } else collideSound.play();
  }

  jumpToNextword(player, text, collideSound){
    const playerPos = player.getPosition();
    let {currentInd, currentRow} = this.getRowAndInd(playerPos, text)
    let currentChar = currentRow[currentInd];
    while (currentChar != ' ' && currentInd < currentRow.length - 1 && !PUNCTUATION.includes(currentRow[currentInd+1])) {
      currentInd++;
      currentChar = currentRow[currentInd];
    }
    const indToJump = currentInd + 1;
    if (indToJump != currentRow.length && currentRow[indToJump] != ' ') {
      player.setPosition(indToJump * TILE_SIZE + TILE_SIZE / 2, playerPos.y);
    } else collideSound.play();
  }

  jumpToPreviousWord(player, text, collideSound) {
    const playerPos = player.getPosition();
    let {currentInd, currentRow} = this.getRowAndInd(playerPos, text)

    if (currentInd == 0) collideSound.play();
    else {
      currentInd -= 2;
      while (
        (currentInd >= 0 && currentRow[currentInd] != ' ') ||
        currentRow[currentInd + 1] == ' '
      ) {
        currentInd--;
      }
      const indToJump = currentInd + 1;
      player.setPosition(indToJump * TILE_SIZE + TILE_SIZE / 2, playerPos.y);
    }
  }

  jumpToPreviousword(player, text, collideSound){
    const playerPos = player.getPosition();
    let {currentInd, currentRow} = this.getRowAndInd(playerPos, text)

    if (currentInd == 0) collideSound.play();
    else {
      currentInd -= 2;
      while (
        (currentInd >= 0 && currentRow[currentInd] != ' ' && !PUNCTUATION.includes(currentRow[currentInd+1])) ||
        currentRow[currentInd + 1] == ' '
      ) {
        currentInd--;
      }
      const indToJump = currentInd + 1;
      player.setPosition(indToJump * TILE_SIZE + TILE_SIZE / 2, playerPos.y);
    }
  }

  jumpToEndOfWord(player, text, collideSound) {
    const playerPos = player.getPosition();
    let {currentInd, currentRow} = this.getRowAndInd(playerPos, text)

    currentInd += 2;
    while (currentInd < currentRow.length && currentRow[currentInd] != ' ')
      currentInd++;
    if (currentInd > currentRow.length) collideSound.play();
    else {
      const indToJump = currentInd - 1;
      if (currentRow[indToJump] != ' ') {
        player.setPosition(indToJump * TILE_SIZE + TILE_SIZE / 2, playerPos.y);
      } else collideSound.play();
    }
  }

  jumpToEndOfword(player, text, collideSound) {
    const playerPos = player.getPosition();
    let {currentInd, currentRow} = this.getRowAndInd(playerPos, text)

    currentInd += 2;
    while (currentInd < currentRow.length && currentRow[currentInd] != ' ' && !PUNCTUATION.includes(currentRow[currentInd]) && !PUNCTUATION.includes(currentRow[currentInd-1]))
      currentInd++;
    if (currentInd > currentRow.length) collideSound.play();
    else {
      const indToJump = currentInd - 1
      if (currentRow[indToJump] != ' ') {
        player.setPosition(indToJump * TILE_SIZE + TILE_SIZE / 2, playerPos.y);
      } else collideSound.play();
    }

  }
}

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;
const COLOR_DARK = 0x260e04;

const GetValue = Phaser.Utils.Objects.GetValue;
var createTextBox = function (scene, x, y, config) {
  var wrapWidth = GetValue(config, 'wrapWidth', 0);
  var fixedWidth = GetValue(config, 'fixedWidth', 0);
  var fixedHeight = GetValue(config, 'fixedHeight', 0);
  var textBox = scene.rexUI.add
    .textBox({
      x: x,
      y: y,

      background: scene.rexUI.add
        .roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
        .setStrokeStyle(2, COLOR_LIGHT),

      // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
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
        var icon = this.getElement('action').setVisible(false);
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

        var icon = this.getElement('action').setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;
        var tween = scene.tweens.add({
          targets: icon,
          y: '+=30', // '+=100'
          ease: 'Bounce', // 'Cubic', 'Elastic', 'Bounce', 'Back'
          duration: 500,
          repeat: 0, // -1: infinity
          yoyo: false,
        });
      },
      textBox
    );
  //.on('type', function () {
  //})

  return textBox;
};

var getBuiltInText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
  return scene.add
    .text(0, 0, '', {
      fontSize: '12px',
      wordWrap: {
        width: wrapWidth,
      },
      maxLines: 3,
    })
    .setFixedSize(fixedWidth, fixedHeight);
};

var getBBcodeText = function (scene, wrapWidth, fixedWidth, fixedHeight) {
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
