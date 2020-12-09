import 'phaser';

let buttonEnter;

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'})
    }

    preload() {
        this.load.image('background_image', 'assets/backgrounds/spriteSheets/startScene_background.png')
        buttonEnter = this.input.keyboard.addKey('enter')
    }

    create() {
        let background = this.add.sprite(0, 0, 'background_image')
        background.setOrigin(0, 0)

        let prevLevel = parseInt(localStorage.getItem('level')) || 0

        let title_text = this.add.text(100, 110, 'Learning VIM in the Adventure of Ariadne...', { fontFamily: 'Georgia, serif', fontSize: '40px', color: '#000000', stroke: '#fff', strokeThickness: 2 })

        let previousProgress = prevLevel!=0

        let newGame = this.add.text(180, 350, 'New game', {
            fontFamily: 'Georgia, serif',
            fontSize: '40px',
            color: '#000',
            stroke: '#fff',
            strokeThickness: 2
        }).setInteractive({useHandCursor: true}).on('pointerdown', () =>{
            this.game.level = 0
            this.scene.stop('TitleScene');
            this.scene.start('MainScene');
        })

        let continueGame = this.add.text(520, 350, 'Continue', {
            fontFamily: 'Georgia, serif',
            fontSize: '40px',
            color: previousProgress?'#000':'rgba(64, 64, 64, 0.8)',
            stroke: '#fff',
            strokeThickness: previousProgress?2:0
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

    update() {
        /*
        if (Phaser.Input.Keyboard.JustDown(buttonEnter)) {
            this.scene.pause('TitleScene');
            this.scene.run('MainScene');
        }
        */
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
