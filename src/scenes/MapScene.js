import 'phaser';
import Phaser from 'phaser';
import Player from '../entity/Player';
import { GridPhysics } from '../physics/GridPhysics';
import Key from '../entity/Key';
import Padlock from '../entity/Padlock';
import {
  tileMaps,
  padlockLocation,
  keyLocations,
  playerStartPosition,
} from '../MapInfo';
import MainScene from './MainScene';
import TitleScene from './TitleScene';

export const TILE_SIZE = 32;

export const Direction = {
  NONE: 'none',
  LEFT: 'left',
  UP: 'up',
  RIGHT: 'right',
  DOWN: 'down',
};

let content = `Ariadne: \n I'm bored. Where are the knights that are going to get me out of here? \n Maybe I can escape this labyrinth by myself. God of VIM, please give me power! \n Looks like I can use 'h', 'j', 'k', & 'l' to walk around. I need to find keys to unlock the door.`;

// this.scene.sleep('TitleScene');
// this.scene.start('MainScene');

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
    this.keyCount = 0;
    this.getKey = this.getKey.bind(this);
    this.level = 0;
  }

  onMeetEnemy(player, zone) {
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width - 2);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height - 2);
    this.cameras.main.shake(300);

    // switch to BattleScene

    this.input.keyboard.enabled = false;
    Object.keys(this.allKeys).map((key) => {
      this.allKeys[key]['key'].isDown = false;
    });
    this.time.addEvent({
      delay: 500,
      callback: () => this.scene.switch('BattleScene'),
      callbackScope: this
    })
  }

  preload() {
    //this.load.image('tiles', 'assets/backgrounds/tiles.png');
    //this.load.tilemapTiledJSON('map', 'assets/backgrounds/testing-map2.json');
    console.log(this.level)
    this.load.image('tiles', 'assets/backgrounds/Castle2.png');
    this.cache.tilemap.remove('map')
    this.load.tilemapTiledJSON('map', tileMaps[this.level]);
    this.load.audio('collide', 'assets/audio/jump.wav');
    this.load.audio('locked', 'assets/audio/locked.wav');
    this.load.spritesheet('key', 'assets/spriteSheets/key.png', {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.image('padlock', 'assets/sprites/padlock.png');
    this.load.spritesheet('Ariadne', 'assets/spriteSheets/george2.png', {
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
  }
  create() {
    /* Background map */
    const map = this.make.tilemap({
      key: 'map',
    });
    const tileset = map.addTilesetImage('castle', 'tiles');
    const grassLayer = map.createStaticLayer('grass', tileset);
    const pathLayer = map.createStaticLayer('path', tileset);
    const gateLayer = map.createStaticLayer('gate', tileset);

    // << LOAD BACKGROUND AND FOREGROUND SCENES IN PARALLEL HERE >>
    // this.scene.launch('BattleScene');
    // this.scene.launch('FgScene');

    /*
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    grassLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });
    */

    /*Character*/
    this.mapKeys = this.physics.add.group({
      classType: Key,
    });

    keyLocations[this.level].map((coords) => {
      this.mapKeys.create(coords.x, coords.y, 'key');
    });
    this.player = new Player(
      this,
      playerStartPosition[this.level].x,
      playerStartPosition[this.level].y,
      'Ariadne'
    ).setScale(1);    this.cache.tilemap.remove('map')


    this.gridPhysics = new GridPhysics(this.player, map);
    this.createAnimations();

    this.padlock = new Padlock(
      this,
      padlockLocation[this.level].x * TILE_SIZE,
      padlockLocation[this.level].y * TILE_SIZE,
      'padlock'
    ).setScale(0.08);
    this.keyboard = this.input.keyboard;

    this.collideSound = this.sound.add('collide', { volume: 0.25 });
    this.lockedSound = this.sound.add('locked', { volume: 0.25 });

    this.physics.add.overlap(
      this.player,
      this.mapKeys,
      this.getKey,
      null,
      this
    );

    this.allKeys = {
      h: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        function: (time, shift) => {
          if (!shift) this.gridPhysics.movePlayer(Direction.LEFT, time, this.collideSound);
        },
      },
      j: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        function: (time, shift) => {
          if (!shift) this.gridPhysics.movePlayer(Direction.DOWN, time, this.collideSound);
        },
      },
      k: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        function: (time, shift) => {
          if (!shift) this.gridPhysics.movePlayer(Direction.UP, time, this.collideSound);
        },
      },
      l: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        function: (time, shift) => {
          if (!shift) this.gridPhysics.movePlayer(Direction.RIGHT, time, this.collideSound);
        },
      },
    };

    // invisible triggers
    this.spawns = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });

    for (let i = 0; i < 15; i++) {
      let x = Phaser.Math.RND.between(0, 640);
      let y = Phaser.Math.RND.between(0, this.physics.world.bounds.height);

      this.player.beforeBattle = this.player.getPosition();


      if (
        x === this.player.beforeBattle.x ||
        y === this.player.beforeBattle.y
      ) {
        x = Phaser.Math.RND.between(0, this.player.beforeBattle.x - 5);
        y = Phaser.Math.RND.between(0, this.player.beforeBattle.y - 5);

      }
      this.spawns.create(x, y, 32, 32);
    }

    this.exit = this.physics.add.group({
      classType: Phaser.GameObjects.Zone,
    });

    this.exit.create(
      padlockLocation[this.level].x * TILE_SIZE,
      padlockLocation[this.level].y * TILE_SIZE,
      32,
      32
    );

    this.physics.add.overlap(
      this.player,
      this.spawns,
      this.onMeetEnemy,
      false,
      this
    );

    this.physics.add.overlap(
      this.player,
      this.exit,
      this.exitLevel,
      null,
      this
    );

    this.sys.events.on(
      'wake',
      (test) => {
        if (!this.game.playerAlive){
          this.player.setPosition(
            playerStartPosition[this.level].x*TILE_SIZE + TILE_SIZE/2,
            playerStartPosition[this.level].y*TILE_SIZE + TILE_SIZE/2
          )
        }
        this.input.keyboard.enabled = true
      },
      this
    );

    //help button
    let helpVisible = true;
    this.help = this.add
      .text(750, 20, ':help', { backgroundColor: '#000' })
      .setInteractive()
      .on('pointerdown', () => {
        if (!helpVisible) {
          // this.helpText.alpha = 0;
          this.helpText.setVisible(false);
          helpVisible = !helpVisible;
        } else {
          // this.helpText.alpha = 1;
          this.helpText.setVisible(true);
          helpVisible = !helpVisible;
        }
      });
    this.helpText = this.add
      .text(
        665,
        50,
        `power given by the God of VIM: \n h: left \n l: right \n j: down \n k: up`
      )
      .setVisible(false);

    // this.label = this.add.text(675, 450, '').setWordWrapWidth(260);
    // this.typewriteText(
    //   `Ariadne: Where are the knights that are going rescue me from this labyrinth? I'm so bored. I guess I should use the power given by the God of VIM to escape here myself.`
    // );

    createTextBox(this, 665, 300, {
      wrapWidth: 200,
    }).start(content, 50);
  }

  update(time, delta) {
    this.player.update(time, this.allKeys);
    this.gridPhysics.update(delta);
  }

  getKey(player, mapKey) {
    this.keyCount++;
    mapKey.disableBody(true, true);
    if (this.keyCount >= 3) {
      this.padlock.disableBody(true, true);
    }
  }

  exitLevel(player, exit) {
    if(this.keyCount >=3){
      this.level ++
      this.scene.restart()
      this.keyCount = 0
    }else{
      if(!this.lockPlayed){
        this.lockedSound.play()
        this.lockPlayed = true
        this.lockedSound.on('complete', () => setTimeout(() =>
          this.lockPlayed = false, 1000))

      }

    }
  }

  createAnimations() {
    this.anims.create({
      key: 'left',
      frames: [
        { key: 'Ariadne', frame: 1 },
        { key: 'Ariadne', frame: 5 },
        { key: 'Ariadne', frame: 9 },
        { key: 'Ariadne', frame: 13 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'right',
      frames: [
        { key: 'Ariadne', frame: 3 },
        { key: 'Ariadne', frame: 7 },
        { key: 'Ariadne', frame: 11 },
        { key: 'Ariadne', frame: 15 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'down',
      frames: [
        { key: 'Ariadne', frame: 0 },
        { key: 'Ariadne', frame: 4 },
        { key: 'Ariadne', frame: 8 },
        { key: 'Ariadne', frame: 12 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'up',
      frames: [
        { key: 'Ariadne', frame: 2 },
        { key: 'Ariadne', frame: 6 },
        { key: 'Ariadne', frame: 10 },
        { key: 'Ariadne', frame: 14 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'Ariadne', frame: 0 }],
      frameRate: 2,
    });
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
