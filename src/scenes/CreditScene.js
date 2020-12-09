import "phaser";
import Phaser from "phaser";
import config from "../config/config";

let mcrate, mcrate1, mcrate2, mgraphic;

export default class CreditScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CreditScene",
      active: true,
      physics: {
        default: "arcade",
        arcade: {
          debug: false,
          gravity: {
            y: 100,
          },
        },
      },
    });
  }
  preload() {
    this.load.image("background", "assets/backgrounds/blackCanvas.png");
    this.load.spritesheet("Ariadne", "assets/spriteSheets/battleSprite.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("Enemy1", "assets/spriteSheets/george.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("Enemy2", "assets/spriteSheets/enemy/cyclops.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
  }

  create() {
    this.cameras.main.backgroundColor.setTo('#000000');
    mcrate = this.physics.add.sprite(200, 200, "Ariadne");
    mcrate.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    mcrate1 = this.physics.add.sprite(0, 180, "Enemy1");
    mcrate1.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    mcrate2 = this.physics.add.sprite(160, 0, "Enemy2");
    mcrate2.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    this.creditsText = this.add.text(0, 0, "StressedBrains", {
      fontFamily: "Brush Script MT, cursive",
      fontSize: "50px",
      fill: "#fff",
    })

    this.madeByText = this.add.text(
      0,
      0,
      ` Created By:\n Avery Schiff\n Ariel Wang\n Katelynn Burns\n Guoying Zhong`,
      {
        fontSize: "28px",
        fill: "#fff",
      }
    );
    this.zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height
    );

    Phaser.Display.Align.In.Center(this.creditsText, this.zone);
    Phaser.Display.Align.In.Center(this.madeByText, this.zone);

    this.madeByText.setY(1000);
    this.creditsTween = this.tweens.add({
      targets: this.creditsText,
      y: -100,
      ease: "Power1",
      duration: 8000,
      delay: 2000,
      onComplete: function () {
        this.destroy;
      },
    });

    this.madeByTween = this.tweens.add({
      targets: this.madeByText,
      y: -300,
      ease: "Power1",
      duration: 28000,
      delay: 1000,
      onComplete: function () {
        this.madeByTween.destroy;
        this.scene.start("Title");
      }.bind(this),
    });
  }

  update() {
    /* COLLIDE SPRITE WITH GRAPHIC */
    this.physics.world.collide(mcrate, [mgraphic]);
  }
}
