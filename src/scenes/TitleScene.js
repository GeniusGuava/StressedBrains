import Phaser from 'phaser';

let buttonEnter;

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'})
    }

    preload() {
        //game spritesheets
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
          this.load.spritesheet(
            'AriadneAttack',
            'assets/spriteSheets/battleSprite.png',
            {
              frameWidth: 32,
              frameHeight: 32,
            }
          )
          this.load.spritesheet('warning', 'assets/sprites/warning.png', {
            frameWidth: 32,
            frameHeight: 32,
          });

          this.load.spritesheet("key", "assets/spriteSheets/key.png", {
            frameWidth: 32,
            frameHeight: 32,
          });
        //game images
        this.load.image('background_image', 'assets/backgrounds/spriteSheets/startScene_background.png')
        buttonEnter = this.input.keyboard.addKey('enter')

        this.load.image("tiles", "assets/backgrounds/spriteSheets/Castle2.png");
        this.load.image("padlock", "assets/sprites/padlock.png");
        //game audio
        this.load.audio('enemy', 'assets/audio/battleSounds/enemy.wav');
        this.load.audio('attack', 'assets/audio/battleSounds/attack.wav');
        this.load.audio('lose', 'assets/audio/battleSounds/loseBattle.wav');
        this.load.audio('win', 'assets/audio/battleSounds/winBattle.wav');
        this.load.audio("locked", "assets/audio/worldSounds/locked.wav");
        this.load.audio('attack', 'assets/audio/battleSounds/attack.wav');
    }

    create() {
        //game sounds
        this.game.enemySound = this.sound.add('enemy')
        this.game.loseSound = this.sound.add('lose');
        this.game.winSound = this.sound.add('win');
        this.game.lockedSound = this.sound.add('locked');
        this.game.attackSound = this.sound.add('attack', { volume: 0.25 });

        let background = this.add.sprite(0, 0, 'background_image')
        background.setOrigin(0, 0)

        let prevLevel = parseInt(localStorage.getItem('level')) || 0

        let title_text = this.add.text(90, 110, 'Learning VIM in the Adventure of Ariadne...', { fontFamily: 'Georgia, serif', fontSize: '40px', color: '#000000', stroke: '#fff', strokeThickness: 2 })
        const titleTextMetrics = title_text.getTextMetrics()

        let previousProgress = prevLevel!=0

        let newGame = this.add.text(200, 350, 'New game', {
            fontFamily: 'Georgia, serif',
            fontSize: '40px',
            color: '#000',
            stroke: '#fff',
            strokeThickness: 2,
            metrics: titleTextMetrics
        }).setInteractive({useHandCursor: true}).on
        ('pointerdown', () =>{
            this.game.level = 0
            this.scene.stop('TitleScene');
            this.scene.start('MainScene');
        })

        let continueGame = this.add.text(600, 350, 'Continue', {
            fontFamily: 'Georgia, serif',
            fontSize: '40px',
            color: previousProgress?'#000':'rgba(64, 64, 64, 0.8)',
            stroke: '#fff',
            strokeThickness: previousProgress?2:0,
            metrics: this.titleTextMetrics
        }).setInteractive({useHandCursor: previousProgress?true:false}).on('pointerdown', () =>{
            if (previousProgress){
                this.game.level = prevLevel
                this.scene.stop('TitleScene');
                this.scene.start('MainScene');
            }
        })
        TweenHelper.flashElement(this, newGame);
        if (previousProgress) TweenHelper.flashElement(this, continueGame)
        let copyright = this.add.text(560, 610, '© StressedBrains, 2020. All rights reserved.', { fontFamily: 'Arial', fontSize: '20px', color: '#fff', stroke: '#000000', strokeThickness: 2 })

    }
}

export class TweenHelper {
    static flashElement(scene, element, repeat = true, easing = 'Linear', overallDuration = 1500, visiblePauseDuration = 500) {
        if (scene && element) {
            let flashDuration = overallDuration - visiblePauseDuration / 2;

            scene.tweens.timeline({
                tweens: [
                    {
                        targets: element,
                        duration: 0,
                        alpha: 0.2,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: visiblePauseDuration,
                        alpha: 1,
                        ease: easing
                    },
                    {
                        targets: element,
                        duration: flashDuration,
                        alpha: 0.2,
                        ease: easing,
                        onComplete: () => {
                            if (repeat === true) {
                                this.flashElement(scene, element);
                            }
                        }
                    }
                ]
            });
        }
    }
}
