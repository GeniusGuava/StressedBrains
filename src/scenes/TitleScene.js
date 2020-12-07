export default class TitleScene extends Phaser.Scene {
    constructor() {
        super({key: 'TitleScene'})
    }

    preload() {
        this.load.image('background_image', 'public/assets/backgrounds/startScene_background.png')
    }

    create() {
        let background = this.add.sprite(0, 0, 'background_image')
        background.setOrigin(0, 0)
    }
}