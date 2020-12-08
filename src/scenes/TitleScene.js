import 'phaser';
import Phaser from 'phaser';

let buttonEnter;

export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'})
    }

    preload() {
        this.load.image('background_image', 'assets/backgrounds/startScene_background.png')
        buttonEnter = this.input.keyboard.addKey('enter')
    }

    create() {
        let background = this.add.sprite(0, 0, 'background_image')
        background.setOrigin(0, 0)

        let title_text = this.add.text(100, 110, 'Learning VIM in the Adventure of Ariadne...', { fontFamily: 'Georgia, serif', fontSize: '40px', color: '#000000', stroke: '#fff', strokeThickness: 2 })
        let screenText = this.add.text(480, 350, 'Press Enter to Start Game', { fontFamily: 'Verdana, sans-serif', fontSize: '40px', color: '#000000', stroke: '#fff', strokeThickness: 2 }).setOrigin(0.5);
        let copyright = this.add.text(560, 610, '© StressedBrains, 2020. All rights reserved.', { fontFamily: 'Arial', fontSize: '20px', color: '#fff', stroke: '#000000', strokeThickness: 2 })
        TweenHelper.flashElement(this, screenText);

        this.input.keyboard.on('keydown', () => {
            this.scene.stop('TitleScene');
            this.scene.start('MainScene');
        });
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(buttonEnter)) {
            this.scene.pause('TitleScene');
            this.scene.run('MapScene');
        }
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
                        alpha: 0,
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
                        alpha: 0,
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