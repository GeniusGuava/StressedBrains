import Player from '../entity/Player';

export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
  // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 640, // Game width in pixels
  height: 640, // Game height in pixels
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: true
    },
  },
  render: {
    pixelArt: true,
  },
  backgroundColor: '#5f2a55',
};
