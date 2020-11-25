import Player from "../entity/Player";
import { GridPhysics } from "../physics/GridPhysics"

export const Direction = {
  NONE: "none",
  LEFT: "left",
  UP: "up",
  RIGHT: "right",
  DOWN: "down",
}

export default class FgScene extends Phaser.Scene {
  constructor() {
    super('FgScene');
  }

  preload() {
    // Preload Sprites
    // << LOAD SPRITES HERE >>

    // Preload Sounds
    // << LOAD SOUNDS HERE >>
  }

  create() {
    // Create game entities
    // << CREATE GAME ENTITIES HERE >>
    this.player = new Player(this, 10, 5, null)

    this.gridPhysics = new GridPhysics()

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

    // Create sounds
    // << CREATE SOUNDS HERE >>

    // Create collisions for all entities
    // << CREATE COLLISIONS HERE >>
  }

  // time: total time elapsed (ms)
  // delta: time elapsed (ms) since last update() call. 16.666 ms @ 60fps
  update(time, delta) {
    this.player.update(time, this.allKeys)
  }

}
