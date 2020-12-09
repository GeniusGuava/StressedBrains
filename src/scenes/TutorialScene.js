import Player from '../entity/Player';
import Enemy from '../entity/Enemy';
import { GridPhysics } from '../physics/GridPhysics';
import {textToLevel}  from '../BattleInfo'
import tutorial from '../Battles/tutorial'
import { TILE_SIZE, Direction } from '../MapInfo';
import { helpContent } from '../text/helpText';

const PUNCTUATION = [",", "'", "!", "?", "."]

export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super();
    this.attacks = 0
  }

  preload() {

    this.load.spritesheet('letters', 'assets/backgrounds/spriteSheets/letters2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.spritesheet('sword', 'assets/sprites/sword.png', {
      frameHeight: 32,
      frameWidth: 32,
    });
    this.load.spritesheet('Ariadne', 'assets/spriteSheets/george2.png', {
      frameWidth: 32,
      frameHeight: 32,
    });

    this.load.audio('attack', 'assets/audio/battleSounds/attack.wav');
    this.load.audio('collide', 'assets/audio/worldSounds/jump.wav');
  }

  create() {
    this.text = tutorial.text
    this.physics.world.bounds.y = 64;
    const map = this.make.tilemap({
      data: textToLevel(this.text),
      tileHeight: 32,
      tileWidth: 32,
    });
    const tiles = map.addTilesetImage('letters');
    const ground = map.createStaticLayer(0, tiles, 0, 0);
    this.player = new Player(
      this,
      0,
      2,
      'Ariadne'
    );
    this.player.setFrame(4);
    this.attackSound = this.sound.add('attack', { volume: 0.25 });
    this.collideSound = this.sound.add('collide', { volume: 0.25 });

    this.gridPhysics = new GridPhysics(this.player, map);
    this.keyboard = this.input.keyboard;

    this.weapons = this.physics.add.group({
      classType: Enemy,
    });
    const weapons = tutorial.maps[0].weapons
    weapons.map((coords) => {
      this.createWeapon(coords.x, coords.y);
    });

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
          if (shift) this.jumpToNextWord(this.player, this.text, this.collideSound);
          else this.jumpToNextword(this.player, this.text, this.collideSound);
        },
      },
      b: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
        function: (time, shift) => {
          if (shift) this.jumpToPreviousWord(this.player, this.text, this.collideSound);
          else this.jumpToPreviousword(this.player,this.text, this.collideSound);
        },
      },
      e: {
        key: this.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        function: (time, shift) => {
          if (shift) this.jumpToEndOfWord(this.player, this.text, this.collideSound);
          else this.jumpToEndOfword(this.player, this.text, this.collideSound)
        },
      },
    };

    this.physics.add.overlap(
      this.player,
      this.weapons,
      this.playerAttack,
      null,
      this
    );
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
      .text(665, 50, helpContent[0], { wordWrap: { width: 250 } })
      .setVisible(false);

  }
  update(time, delta) {
    // << DO UPDATE LOGIC HERE >>
    this.player.update(time, this.allKeys);
    this.gridPhysics.update(delta);
  }
  createWeapon(x, y) {
    this.weapons.create(x, y, 'sword');
    this.weapons.setAlpha(0.75);
  }
  playerAttack(player, weapon, x, y) {
    this.attacks++
    weapon.setActive(false).setVisible(false);
    weapon.body.enable = false;

    if (this.attacks >= 3){
      this.input.keyboard.enabled = false;
      Object.keys(this.allKeys).map((key) => {
        this.allKeys[key]['key'].isDown = false;
      });
      this.scene.sleep()
      this.scene.launch('MapScene')
    }
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
