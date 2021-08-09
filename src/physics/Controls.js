import 'phaser';
import {Direction, TILE_SIZE} from '../MapInfo'

const PUNCTUATION = [',', "'", '!', '?', '.'];

export default class Controls  {
  constructor(scene, level=0){
    this.level = level
    this.scene = scene
    this.textControlVars = [
      scene.player,
      scene.text,
      scene.collideSound
    ]
  }

  getKeys(){
    return {
      h: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.LEFT,
              time,
              this.scene.collideSound
            );
        },
      },
      j: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.DOWN,
              time,
              this.scene.collideSound
            );
        },
      },
      k: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.UP,
              time,
              this.scene.collideSound
            );
        },
      },
      l: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.L),
        function: (time, shift) => {
          if (!shift)
            this.scene.gridPhysics.movePlayer(
              Direction.RIGHT,
              time,
              this.scene.collideSound
            );
        },
      },
      w: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W),
        function: (time, shift) => {
          if (this.level >= 4 && shift){
            this.jumpToNextWord(
              ...this.textControlVars
            )
          }
          else if (this.level >= 1 && !shift){
            this.jumpToNextword(
              ...this.textControlVars
            );
          }
        },
      },
      b: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.B),
        function: (time, shift) => {
          if (this.level >= 4 && shift){
            this.jumpToPreviousWord(
              ...this.textControlVars
            )
          }
          else if (this.level >= 2 && !shift){
            this.jumpToPreviousword(
              ...this.textControlVars
            );
          }
        },
      },
      e: {
        key: this.scene.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E),
        function: (time, shift) => {
          if (this.level >= 4 && shift){
            this.jumpToEndOfWord(
              ...this.textControlVars
            )
          }
          else if (this.level >= 3 && !shift){
            this.jumpToEndOfword(
              ...this.textControlVars
            );
          }
        },
      },
    }
  }
  getRowAndInd(playerPos, text) {
    const xGrid = (playerPos.x - TILE_SIZE / 2) / TILE_SIZE;
    const yGrid = (playerPos.y - TILE_SIZE / 2) / TILE_SIZE - 2;
    const textRows = text.split('\n');
    const currentRow = Array.from(textRows[yGrid]).slice(2);
    return { currentInd: xGrid, currentRow };
  }

  jumpToNextWord(player, text, collideSound) {
    const playerPos = player.getPosition();
    let { currentInd, currentRow } = this.getRowAndInd(playerPos, text);
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

  jumpToNextword(player, text, collideSound) {
    const playerPos = player.getPosition();
    let { currentInd, currentRow } = this.getRowAndInd(playerPos, text);
    let currentChar = currentRow[currentInd];
    while (
      currentChar != ' ' &&
      currentInd < currentRow.length - 1 &&
      !PUNCTUATION.includes(currentRow[currentInd + 1])
    ) {
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
    let { currentInd, currentRow } = this.getRowAndInd(playerPos, text);

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

  jumpToPreviousword(player, text, collideSound) {
    const playerPos = player.getPosition();
    let { currentInd, currentRow } = this.getRowAndInd(playerPos, text);

    if (currentInd == 0) collideSound.play();
    else {
      currentInd -= 2;
      while (
        (currentInd >= 0 &&
          currentRow[currentInd] != ' ' &&
          !PUNCTUATION.includes(currentRow[currentInd + 1])) ||
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
    let { currentInd, currentRow } = this.getRowAndInd(playerPos, text);

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
    let { currentInd, currentRow } = this.getRowAndInd(playerPos, text);

    currentInd += 2;
    while (
      currentInd < currentRow.length &&
      currentRow[currentInd] != ' ' &&
      !PUNCTUATION.includes(currentRow[currentInd]) &&
      !PUNCTUATION.includes(currentRow[currentInd - 1])
    )
      currentInd++;
    if (currentInd > currentRow.length) collideSound.play();
    else {
      const indToJump = currentInd - 1;
      if (currentRow[indToJump] != ' ') {
        player.setPosition(indToJump * TILE_SIZE + TILE_SIZE / 2, playerPos.y);
      } else collideSound.play();
    }
  }
}
