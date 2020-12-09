export const TILE_SIZE = 32;

export const tileMaps = [
  'assets/backgrounds/levelOne.json',
  'assets/backgrounds/levelTwo.json',
  'assets/backgrounds/levelThree.json',
  'assets/backgrounds/levelFour.json',
  'assets/backgrounds/finalLevel.json'
];

export const padlockLocation = [
  { x: 4.5, y: 7.6 },
  { x: 4.5, y: 8.6 },
  { x: 4.5, y: 6.6 },
  { x: 10, y: 11.6 },
  { x: 12, y: 14.6 }
];

export const keyLocations = [
  [
    { x: 9.5 * TILE_SIZE, y: 4.5 * TILE_SIZE },
    { x: 18.5 * TILE_SIZE, y: 18.5 * TILE_SIZE },
    { x: 4.5 * TILE_SIZE, y: 15.5 * TILE_SIZE },
  ],
  [
    { x: 9.5 * TILE_SIZE, y: 3.5 * TILE_SIZE },
    { x: 18.5 * TILE_SIZE, y: 18.5 * TILE_SIZE },
    { x: 3.5 * TILE_SIZE, y: 15.5 * TILE_SIZE },
  ],
  [
    { x: 9.5 * TILE_SIZE, y: 4.5 * TILE_SIZE },
    { x: 17.5 * TILE_SIZE, y: 17.5 * TILE_SIZE },
    { x: 4.5 * TILE_SIZE, y: 14.5 * TILE_SIZE },
  ],
  [
    { x: 9.5 * TILE_SIZE, y: 4.5 * TILE_SIZE },
    { x: 15.5 * TILE_SIZE, y: 16.5 * TILE_SIZE },
    { x: 3.5 * TILE_SIZE, y: 14.5 * TILE_SIZE },
  ],
  [
    { x: 10.5 * TILE_SIZE, y: 1.5 * TILE_SIZE },
    { x: 2.5 * TILE_SIZE, y: 14 * TILE_SIZE },
    { x: 6.5 * TILE_SIZE, y: 15.5 * TILE_SIZE },
  ]
];

export const playerStartPosition = [
  { x: 11, y: 6 },
  { x: 15, y: 5 },
  { x: 14, y: 5 },
  { x: 15, y: 6 },
  { x: 2, y: 17 }
];
