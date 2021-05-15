import Phaser from "phaser";
import config from "../config/config";

let mcrate,
  mcrate1,
  mcrate2,
  mcrate3,
  mcrate4,
  mgraphic;

const link = {
  name: "Click Here to See Our Github",
  event: () =>
    (window.location.href = "https://github.com/GeniusGuava/StressedBrains"),
};

export default class CreditScene extends Phaser.Scene {
  constructor() {
    super({
      key: "CreditScene",
      active: false,
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
    this.load.image("githubLogo", "assets/backgrounds/githubLogo.png")

    this.load.spritesheet("Ariadne", "assets/spriteSheets/battleSprite.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("George", "assets/spriteSheets/george2.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("Enemy1", "assets/spriteSheets/enemy/cyclops.png", {
      frameWidth: 48,
      frameHeight: 48,
    });
    this.load.spritesheet("Enemy2", "assets/spriteSheets/enemy/adventurer.png", {
      frameWidth: 32,
      frameHeight: 32,
    });
    this.load.spritesheet("Enemy3", "assets/spriteSheets/enemy/minotaur.png", {
      frameWidth: 60,
      frameHeight: 60,
    });
  }

  create() {
    this.add.image(900, 580, 'githubLogo').setScale(0.3).setInteractive().on(
        "pointerdown",
        function () {
          link.event();
        },
        this
      );

    this.cameras.main.backgroundColor.setTo("#000000");
    mcrate = this.physics.add.sprite(500, 200, "Ariadne");
    mcrate.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    mcrate1 = this.physics.add.sprite(300, 180, "George").setScale(1.2);
    mcrate1.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    mcrate2 = this.physics.add.sprite(200, 130, "Enemy1");
    mcrate2.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    mcrate3 = this.physics.add.sprite(100, 100, "Enemy2").setScale(1.7);
    mcrate3.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    mcrate4 = this.physics.add.sprite(50, 300, "Enemy3");
    mcrate4.body
      .setVelocity(100, 200)
      .setBounce(1, 1)
      .setCollideWorldBounds(true);

    const creditsText = this.add.text(0, 0, "StressedBrains", {
      fontFamily: "Brush Script MT, cursive",
      fontSize: "55px",
      fill: "#fff",
    });

    const thanksText = this.add.text(0, 0, "Thanks for playing!", {
      fontFamily: 'Rockwell',
      fontSize: "30px",
      fill: "#fff",
    });
    const thanksTextMetrics = thanksText.getTextMetrics()
    const madeByText = this.add.text(0, 0, ` Created By:\n Avery Schiff\n Ariel Wang\n Katelynn Burns\n Guoying Zhong`,
        {
          fontFamily: 'Rockwell',
          fontSize: "30px",
          fill: "#fff",
          metrics: thanksTextMetrics
        }
      );

      const githubText = this.add.text(0, 0, 'Find Us on GitHub!', {fontFamily: 'Rockwell', fontSize: "28px", fill: "#fff"})
      .setInteractive()
      .on(
        "pointerdown",
        function () {
          link.event();
        },
        this
      );

    const zone = this.add.zone(
      config.width / 2,
      config.height / 2,
      config.width,
      config.height
    );

    Phaser.Display.Align.In.Center(creditsText, zone);
    Phaser.Display.Align.In.Center(madeByText, zone);
    Phaser.Display.Align.In.Center(thanksText, zone);
    Phaser.Display.Align.In.Center(githubText, zone);

    thanksText.setY(1000);
    madeByText.setY(2000);
    githubText.setY(3000);
    creditsTween = this.tweens.add({
      targets: creditsText,
      y: -100,
      ease: "Power1",
      duration: 8000,
      delay: 3000,
      onComplete: function () {
        this.destroy;
      },
    });

    const thanksTween = this.tweens.add({
      targets: thanksText,
      y: -100,
      ease: "Power1",
      duration: 20000,
      delay: 5000,
      oncomplete: function () {
        this.destroy;
      },
    });

    const madeByTween = this.tweens.add({
      targets: madeByText,
      y: -200,
      ease: "Power1",
      duration: 26000,
      delay: 9500,
      onComplete: function () {
        this.destroy;
      }
    });

    const githubTween = this.tweens.add({
        targets: githubText,
        y: -150,
        ease: "Power1",
        duration: 40000,
        delay: 13000,
        onComplete: function () {
          this.scene.start("TitleScene");
        }.bind(this),
      });
  }

  update() {
    /* COLLIDE SPRITE WITH GRAPHIC */
    this.physics.world.collide(mcrate, [mgraphic]);
  }
}
