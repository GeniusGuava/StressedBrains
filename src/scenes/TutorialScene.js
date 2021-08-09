import {Player, Enemy} from '../entity';
import { GridPhysics, Controls } from '../physics';
import {textToLevel}  from '../BattleInfo'
import { tutorial } from '../Battles'
import { helpContent } from '../text';


export default class TutorialScene extends Phaser.Scene {
  constructor() {
    super();
    this.attacks = 0
  }

  preload() {
    this.load.image(
      'nextPage',
      'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/assets/images/arrow-down-left.png'
    )
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
    const ground = map.createLayer(0, tiles, 0, 0);
    this.player = new Player(
      this,
      0,
      2,
      'Ariadne'
    );
    this.player.setFrame(4);
    this.collideSound = this.sound.add('collide');

    this.gridPhysics = new GridPhysics(this.player, map);
    this.keyboard = this.input.keyboard;

    this.weapons = this.physics.add.group({
      classType: Enemy,
    });
    const weapons = tutorial.maps[0].weapons
    weapons.map((coords) => {
      this.createWeapon(coords.x, coords.y);
    });

    this.controls = new Controls(this, 99)
    this.allKeys = this.controls.getKeys()

    this.physics.add.overlap(
      this.player,
      this.weapons,
      this.playerAttack,
      null,
      this
    );
    let helpVisible = true;
    const help = this.add
      .text(750, 20, ':help', { backgroundColor: '#000' })
      .setInteractive()
      .on('pointerdown', () => {
        if (!helpVisible) {
          helpText.setVisible(false);
          helpVisible = !helpVisible;
        } else {
          helpText.setVisible(true);
          helpVisible = !helpVisible;
        }
      });
    const helpText = this.add
      .text(665, 50, helpContent[0], { wordWrap: { width: 250 } })
      .setVisible(false);

  }
  update(time, delta) {
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
}
