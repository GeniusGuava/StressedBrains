import Player from '../entity/Player';

export default {
  type: Phaser.AUTO, // Specify the underlying browser rendering engine (AUTO, CANVAS, WEBGL)
  // AUTO will attempt to use WEBGL, but if not available it'll default to CANVAS
  width: 800, // Game width in pixels
  height: 600, // Game height in pixels
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
    },
  },
  render: {
    pixelArt: true,
  },
  backgroundColor: '#5f2a55',
};
