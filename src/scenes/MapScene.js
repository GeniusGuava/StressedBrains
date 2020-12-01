import 'phaser';
import Phaser from 'phaser';
import Player from "../entity/Player";
import { GridPhysics } from "../physics/GridPhysics"
import Key from '../entity/Key'
import Padlock from '../entity/Padlock'

export const TILE_SIZE = 32

export const Direction = {
  NONE: "none",
  LEFT: "left",
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
}

export default class MapScene extends Phaser.Scene {
  constructor() {
    super('MapScene');
    this.keyCount = 0
    this.getKey = this.getKey.bind(this)
  }

  preload() {
    //this.load.image('tiles', 'assets/backgrounds/tiles.png');
    //this.load.tilemapTiledJSON('map', 'assets/backgrounds/testing-map2.json');
    this.load.image('tiles', 'assets/backgrounds/Castle2.png')
    this.load.tilemapTiledJSON('map', 'assets/backgrounds/levelOne.json')
    this.load.audio('collide', 'assets/audio/jump.wav')
    this.load.spritesheet('key', 'assets/spriteSheets/key.png', {
      frameWidth: 32,
      frameHeight: 32,
    })
    this.load.image('padlock', 'assets/sprites/padlock.png')
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

    const debugGraphics = this.add.graphics().setAlpha(0.75);
    grassLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    /*Character*/
    this.player = new Player(this, 11, 6, null)
    this.gridPhysics = new GridPhysics(this.player, map)

    this.padlock = new Padlock(this, 4.5*TILE_SIZE, 7.7*TILE_SIZE, 'padlock').setScale(0.08)
    this.keyboard = this.input.keyboard

    this.collideSound = this.sound.add('collide')

    const keyLocations = [
      {x: 9.5*TILE_SIZE, y: 4.5*TILE_SIZE },
      {x: 18.5*TILE_SIZE, y: 18.5*TILE_SIZE },
      {x: 4.5*TILE_SIZE, y: 15.5*TILE_SIZE },
    ]

    this.mapKeys = this.physics.add.group({
      classType: Key,
    })

    keyLocations.map(coords=>{
      this.mapKeys.create(coords.x, coords.y, 'key')
    })

    this.physics.add.collider(this.player, this.mapKeys)

    //this.physics.add.overlap(this.player, this.mapKeys, this.getKey, null, this)

    this.allKeys = {
      "h": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        "function": (time) => {
          this.gridPhysics.movePlayer(Direction.LEFT, time, this.collideSound)
        }
      },
      "j": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        "function": (time) => {
          this.gridPhysics.movePlayer(Direction.DOWN, time, this.collideSound)
        }
      },
      "k": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        "function": (time) => {
          this.gridPhysics.movePlayer(Direction.UP, time, this.collideSound)
        }
      },
      "l": {
        "key": this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        "function": (time) => {
          this.gridPhysics.movePlayer(Direction.RIGHT, time, this.collideSound)
        }
      },
    }
  }
  update(time, delta) {
    this.player.update(time, this.allKeys)
    this.gridPhysics.update(delta)
  }

  getKey(player, mapKey){
    this.keyCount++
    console.log(this.keyCount)
    mapKey.disableBody(true, true)
  }
}
