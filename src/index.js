/** @type {import("../typings/phaser")} */
/* The above loads the phaser.d.ts file so that VSCode has autocomplete for the Phaser API.
If you experience problems with autocomplete, try opening the phaser.d.ts file and scrolling up and down in it.
That may fix the problem -- some weird quirk with VSCode. A new typing file is released with
every new release of Phaser. Make sure it's up-to-date!

At some point, the typings will
be officially added to the official release so that all you'll have to do is do:

npm install @types/phaser

But this hasn't happened yet!
*/

import MainScene from './scenes/MainScene';
import BgScene from './scenes/BgScene';
import FgScene from './scenes/FgScene';
import config from './config/config';
import BattleScene from './scenes/BattleScene'

// Bring in all the scenes
import 'phaser';

class Game extends Phaser.Game {
  constructor() {
    // Add the config file to the game
    super(config);

    // Add all the scenes
    // << ADD ALL SCENES HERE >>

    // this.scene.add('BgScene', BgScene);
    // this.scene.add('FgScene', FgScene);
    this.scene.add('BattleScene', BattleScene)
    this.scene.add('MainScene', MainScene);

    // Start the game with the mainscene
    // << START GAME WITH MAIN SCENE HERE >>
    this.scene.start('MainScene');
  }
}
// Create new instance of game
// if (typeof window !== 'undefined') {
//   window.onload = function () {
//     window.game = new Game();
//   };
// }

const game = new Game();
