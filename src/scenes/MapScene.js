import 'phaser';
import Player from '../entity/Player';
import { GridPhysics } from '../physics/GridPhysics';
import Key from '../entity/Key';
import Padlock from '../entity/Padlock';
import { mapText } from '../text/mapText';
import { helpContent } from '../text/helpText';
import { tileMaps, padlockLocation, keyLocations, playerStartPosition,
  music} from '../MapInfo';
import Controls from '../physics/Controls'
import VolumeMenu from '../Menus/VolumeMenu'

export const TILE_SIZE = 32;

export default class MapScene extends Phaser.Scene {
  constructor() {
    super("MapScene");
    this.keyCount = 0;
    this.times =['', '', '', '', '']
    this.getKey = this.getKey.bind(this);
  }

  onMeetEnemy(player, zone) {
    this.music.pause()
    zone.x = Phaser.Math.RND.between(0, this.physics.world.bounds.width - 2);
    zone.y = Phaser.Math.RND.between(0, this.physics.world.bounds.height - 2);
    this.cameras.main.shake(300);

    this.input.keyboard.enabled = false;
    Object.keys(this.allKeys).map((key) => {
      this.allKeys[key]["key"].isDown = false;
    });
    this.time.addEvent({
      delay: 500,
      callback: () => this.scene.switch("BattleScene"),
      callbackScope: this,
    });
  }

  preload() {
   if(this.cache.tilemap.entries.map){
    this.cache.tilemap.remove("map");
   }

    this.load.tilemapTiledJSON("map", tileMaps[this.game.level]);

    this.load.audio("background", music[this.game.level]);

    this.load.scenePlugin({
      key: "rexuiplugin",
      url:
        "https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexuiplugin.min.js",
      sceneKey: "rexUI",
    });
  }
  create() {
    this.timer = 0
    this.collideSound = this.sound.add('collide');
    this.lockedSound = this.sound.add('locked');
    this.music = this.sound.add('background')

    this.volumeMenu = new VolumeMenu(this, this.game,
      [
        { sound: this.collideSound, weight: 0.05, },
        { sound: this.lockedSound, weight: 0.05 },
        { sound: this.music, weight: 0.025 },
      ]
    )
    this.volumeMenu.buildMenu()
    this.volumeMenu.updateVolume()

    this.music.play()

    const map = this.make.tilemap({
      key: "map",
    });
    const tileset = map.addTilesetImage("castle", "tiles");
    const grassLayer = map.createLayer("grass", tileset);
    const pathLayer = map.createLayer("path", tileset);
    const gateLayer = map.createLayer("gate", tileset);

    this.startTime = (this.time.now/1000)
    this.add.text(0, 0, `Times:`)
    this.timerText = this.add.text(3*TILE_SIZE, 0, 'Current Time', {fontSize:'14px'})
    this.add.text(0, 16, `level 1: ${this.times[0]}`, {fontSize:'14px'})
    this.add.text(4*TILE_SIZE, 16, `level 2: ${this.times[1]}`, {fontSize:'14px'})
    this.add.text(8*TILE_SIZE, 16, `level 3: ${this.times[2]}`, {fontSize:'14px'})
    this.add.text(12*TILE_SIZE, 16, `level 4: ${this.times[3]}`, {fontSize:'14px'})
    this.add.text(16*TILE_SIZE, 16, `level 5: ${this.times[4]}`, {fontSize:'14px'})

    this.mapKeys = this.physics.add.group({
      classType: Key,
    });

    keyLocations[this.game.level].map((coords) => {
      this.mapKeys.create(coords.x, coords.y, "key");
    });

    this.player = new Player(
      this,
      playerStartPosition[this.game.level].x,
      playerStartPosition[this.game.level].y,
      "Ariadne"
    ).setScale(1);

    this.gridPhysics = new GridPhysics(this.player, map);

    this.createAnimations();

    this.padlock = new Padlock(
      this,
      padlockLocation[this.game.level].x * TILE_SIZE,
      padlockLocation[this.game.level].y * TILE_SIZE,
      "padlock"
    ).setScale(0.08);

    this.keyboard = this.input.keyboard;

    this.controls = new Controls(this, this.collideSound)
    this.allKeys = this.controls.getKeys()
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
      padlockLocation[this.game.level].x * TILE_SIZE,
      padlockLocation[this.game.level].y * TILE_SIZE,
      32,
      32
    );

    this.physics.add.overlap(
      this.player,
      this.mapKeys,
      this.getKey,
      null,
      this
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
      "wake",
      () => {
        if (!this.game.playerAlive) {
          this.player.setPosition(
            playerStartPosition[this.game.level].x * TILE_SIZE + TILE_SIZE / 2,
            playerStartPosition[this.game.level].y * TILE_SIZE + TILE_SIZE / 2
          );
        }
        this.input.keyboard.enabled = true;
        this.volumeMenu.updateVolume()
        this.music.resume()
      },
    );

    //help button
    let helpVisible = true;
    this.help = this.add
      .text(750, 20, ":help", { backgroundColor: "#000" })
      .setInteractive()
      .on("pointerdown", () => {
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
        fontSize: "12px",
      })
      .setVisible(false);

    createTextBox(this, 660, 325, {
      wrapWidth: 205,
    }).start(mapText[this.game.level], 50);

  }

  update(time, delta) {
    this.player.update(time, this.allKeys);
    this.gridPhysics.update(delta);
    this.currentTime = (this.time.now/1000)
    this.timer += delta;
    while (this.timer > 100) {
        this.timerText.setText(`Current Time: ${(this.currentTime- this.startTime).toFixed(1)}`)
        this.timer -= 100;
    }
  }

  getKey(player, mapKey) {
    this.keyCount++;
    mapKey.disableBody(true, true);
    if (this.keyCount >= 3) {
      this.padlock.disableBody(true, true);
    }
  }

  exitLevel(player, exit) {
    if (this.keyCount >= 3) {
      if (this.game.level === 4) {
        this.scene.switch('CreditScene');
      } else {
        this.levelScore = (this.currentTime - this.startTime).toFixed(1)
        this.times[this.game.level] = this.levelScore
        this.game.level++;
        localStorage.setItem("level", this.game.level);
        this.music.destroy();
        this.cache.audio.remove("background");
        this.scene.restart();
        this.keyCount = 0;
      }
    } else {
      if (!this.lockPlayed) {
        this.lockedSound.play();
        this.lockPlayed = true;
        this.lockedSound.on("complete", () =>
          setTimeout(() => (this.lockPlayed = false), 1000)
        );
      }
    }
  }

  createAnimations() {
    this.anims.create({
      key: "left",
      frames: [
        { key: "Ariadne", frame: 1 },
        { key: "Ariadne", frame: 5 },
        { key: "Ariadne", frame: 9 },
        { key: "Ariadne", frame: 13 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "right",
      frames: [
        { key: "Ariadne", frame: 3 },
        { key: "Ariadne", frame: 7 },
        { key: "Ariadne", frame: 11 },
        { key: "Ariadne", frame: 15 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "down",
      frames: [
        { key: "Ariadne", frame: 0 },
        { key: "Ariadne", frame: 4 },
        { key: "Ariadne", frame: 8 },
        { key: "Ariadne", frame: 12 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "up",
      frames: [
        { key: "Ariadne", frame: 2 },
        { key: "Ariadne", frame: 6 },
        { key: "Ariadne", frame: 10 },
        { key: "Ariadne", frame: 14 },
      ],
      frameRate: 2,
      repeat: -1,
    });
    this.anims.create({
      key: "idle",
      frames: [{ key: "Ariadne", frame: 0 }],
      frameRate: 2,
    });
  }
}

const COLOR_PRIMARY = 0x4e342e;
const COLOR_LIGHT = 0x7b5e57;

const GetValue = Phaser.Utils.Objects.GetValue;
let createTextBox = function (scene, x, y, config) {
  let wrapWidth = GetValue(config, "wrapWidth", 0);
  let fixedWidth = GetValue(config, "fixedWidth", 0);
  let fixedHeight = GetValue(config, "fixedHeight", 0);
  let textBox = scene.rexUI.add
    .textBox({
      x: x,
      y: y,

      background: scene.rexUI.add
        .roundRectangle(0, 0, 2, 2, 20, COLOR_PRIMARY)
        .setStrokeStyle(2, COLOR_LIGHT),

      // text: getBuiltInText(scene, wrapWidth, fixedWidth, fixedHeight),
      text: getBBcodeText(scene, wrapWidth, fixedWidth, fixedHeight),

      action: scene.add
        .image(0, 0, "nextPage")
        .setTint(COLOR_LIGHT)
        .setVisible(false),

      space: {
        left: 15,
        right: 15,
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
      "pointerdown",
      function () {
        let icon = this.getElement("action").setVisible(false);
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
      "pageend",
      function () {
        if (this.isLastPage) {
          return;
        }

        let icon = this.getElement("action").setVisible(true);
        this.resetChildVisibleState(icon);
        icon.y -= 30;
        let tween = scene.tweens.add({
          targets: icon,
          y: "+=30",
          ease: "Bounce",
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
  return scene.rexUI.add.BBCodeText(0, 0, "", {
    fixedWidth: fixedWidth,
    fixedHeight: fixedHeight,

    fontSize: "12px",
    wrap: {
      mode: "word",
      width: wrapWidth,
    },
    maxLines: 4,
  });
};
