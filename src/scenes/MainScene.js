import 'phaser';
import Phaser from 'phaser';
import Player from "../entity/Player";
import { GridPhysics } from "../physics/GridPhysics"

export const TILE_SIZE = 32

export const Direction = {
  NONE: "none",
  LEFT: "left",
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
}

export default class MainScene extends Phaser.Scene {
  constructor() {
    super('MainScene');
  }

  preload() {
    this.load.image('tiles', 'assets/backgrounds/tiles.png');
    this.load.tilemapTiledJSON('map', 'assets/backgrounds/testing-map2.json');
  }
  create() {

    /* Background map */
    const map = this.make.tilemap({
      key: 'map',
    });
    const tileset = map.addTilesetImage('field-tileset', 'tiles');
    const groundLayer = map.createStaticLayer('Ground', tileset);
    const wallLayer = map.createStaticLayer('Walls', tileset);
    wallLayer.setCollisionByProperty({ collides: true });
    const debugGraphics = this.add.graphics().setAlpha(0.75);
    wallLayer.renderDebug(debugGraphics, {
      tileColor: null,
      collidingTileColor: new Phaser.Display.Color(243, 134, 48, 255),
      faceColor: new Phaser.Display.Color(40, 39, 37, 255),
    });

    /*Character*/
    this.player = new Player(this, 10, 5, null)
    this.gridPhysics = new GridPhysics(this.player, map)

    this.keyboard = this.input.keyboard
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
  }
  update(time, delta) {
    this.player.update(time, this.allKeys)
    this.gridPhysics.update(delta)
  }
}
