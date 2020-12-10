export default {
  type: Phaser.AUTO,
  width: 960,
  height: 640,
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      // debug: true,
    },
  },
  render: {
    pixelArt: true,
  },
  backgroundColor: '#5f2a55',
};
