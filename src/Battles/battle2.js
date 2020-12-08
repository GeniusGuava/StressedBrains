import {TILE_SIZE} from '../MapInfo'

const gridToPixel = (coordsArray) =>  {
  return coordsArray.map(coords=>({
      x: coords.x*TILE_SIZE+TILE_SIZE/2,
      y: coords.y*TILE_SIZE+TILE_SIZE/2
  }))
}

export default {
  text: "\
  ariadne ariadne will\n\
  you ever escape here\n\
  monsters hound your \n\
  every step the maze \n\
  shall lead you awry \n\
  ariadne ariadne you \n\
  will need to watch  \n\
  your every step if  \n\
  you try to charge   \n\
  your foes you will  \n\
  surely meet your end\n\
  if you wish to one  \n\
  day escape you must \n\
  see past the bounds \n\
  of this labyrinth so\n\
  stride from word to \n\
  word and ascend past\n\
  your own limits     ",
  maps: [
    {
      weapons: gridToPixel([
        {x: 16, y: 3},
        {x: 11, y: 11},
        {x: 18, y: 18},
      ]),
      enemies: gridToPixel([
        {x: 1, y: 12},
        {x: 4, y: 15},
        {x: 5, y: 6},
        {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5}, {x: 8, y: 6}, {x: 8, y: 7}, {x: 8, y: 8}, {x: 8, y: 9}, {x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12}, {x: 8, y: 13}, {x: 8, y: 14}, {x: 8, y: 15}, {x: 8, y: 16}, {x: 8, y: 17}, {x: 8, y: 18}, {x: 8, y: 19},
        {x: 11, y: 9},
        {x: 12, y: 17},
        {x: 16, y: 4},
      ])
    },
    {
      weapons: gridToPixel([
        {x: 15,y: 17},
        {x: 16,y: 18},
        {x: 17,y: 17},
      ]),
      enemies: gridToPixel([
        {x: 1, y: 17},
        {x: 3, y: 6}, {x: 3, y:9},
        {x: 4, y:14},
        {x: 9, y:5}, {x: 9, y:15}, {x: 9, y:16}, {x: 9, y:17}, {x: 9, y:18}, {x: 9, y:19},
        {x: 10, y:15},
        {x: 11, y:15},
        {x: 12, y:15},
        {x: 13, y: 3}, {x: 13, y:15},
        {x: 14, y:15},
        {x: 15, y:12}, {x: 15, y:15},
        {x: 16, y:15}, {x: 16, y:17},
        {x: 17, y:15},
        {x: 18, y:6}, {x: 18, y:15},
        {x: 19, y:15},
      ])
    },
    {
      weapons: gridToPixel([
        {x: 13, y: 15},
        {x: 15, y: 5},
        {x: 16, y: 7},
      ]),
      enemies: gridToPixel([
        {x: 1, y: 14},
        {x: 2, y: 9},
        {x: 4, y: 6}, {x: 4, y: 13}, {x: 4, y: 16},
        {x: 6, y: 9},
        {x: 8, y: 2},
        {x: 9, y: 2}, {x: 9, y: 3}, {x: 9, y: 4}, {x: 9, y: 5},
        {x: 10, y: 5}, {x: 10, y: 6}, {x: 10, y: 8}, {x: 10, y: 9}, {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12},
        {x: 11, y: 6}, {x: 11, y: 7}, {x: 11, y: 8}, {x: 11, y: 12},
        {x: 11, y: 14}, {x: 11, y: 15}, {x: 11, y: 16}, {x: 11, y: 17},
        {x: 12, y: 12}, {x: 12, y: 13}, {x: 12, y: 14}, {x: 12, y: 17}, {x: 12, y: 18}, {x: 12, y: 19},
        {x: 16, y: 9}, {x: 16, y: 18},
        {x: 17, y: 5},
        {x: 19, y: 16},
      ])
    },
    {
      weapons: gridToPixel([
        {x: 12, y: 13},
        {x: 13, y: 15},
        {x: 14, y: 11},
      ]),
      enemies: gridToPixel([
        {x: 0, y: 16},
        {x: 1, y: 11},
        {x: 2, y: 7},
        {x: 3, y: 2}, {x: 3, y: 3}, {x: 3, y: 4}, {x: 3, y: 5}, {x: 3, y: 6}, {x: 3, y: 7}, {x: 3, y: 8}, {x: 3, y: 9}, {x: 3, y: 10}, {x: 3, y: 11}, {x: 3, y: 12}, {x: 3, y: 13}, {x: 3, y: 14}, {x: 3, y: 15}, {x: 3, y: 16}, {x: 3, y: 17}, {x: 3, y: 18}, {x: 3, y: 19},
        {x: 4, y: 2}, {x: 4, y: 3}, {x: 4, y: 4}, {x: 4, y: 5}, {x: 4, y: 6}, {x: 4, y: 7}, {x: 4, y: 8}, {x: 4, y: 9}, {x: 4, y: 10}, {x: 4, y: 11}, {x: 4, y: 12}, {x: 4, y: 13}, {x: 4, y: 14}, {x: 4, y: 15}, {x: 4, y: 16}, {x: 4, y: 17}, {x: 4, y: 18}, {x: 4, y: 19},
        {x: 5, y: 2}, {x: 5, y: 3}, {x: 5, y: 4}, {x: 5, y: 5}, {x: 5, y: 6}, {x: 5, y: 7}, {x: 5, y: 8}, {x: 5, y: 9}, {x: 5, y: 10}, {x: 5, y: 11}, {x: 5, y: 12}, {x: 5, y: 13}, {x: 5, y: 14}, {x: 5, y: 15}, {x: 5, y: 16}, {x: 5, y: 17}, {x: 5, y: 18}, {x: 5, y: 19},
        {x: 6, y: 2}, {x: 6, y: 3}, {x: 6, y: 4}, {x: 6, y: 5}, {x: 6, y: 6}, {x: 6, y: 7}, {x: 6, y: 8}, {x: 6, y: 9}, {x: 6, y: 10}, {x: 6, y: 11}, {x: 6, y: 12}, {x: 6, y: 13}, {x: 6, y: 14}, {x: 6, y: 15}, {x: 6, y: 16}, {x: 6, y: 17}, {x: 6, y: 18}, {x: 6, y: 19},
        {x: 9, y: 17},
        {x: 11, y: 9}, {x: 11, y: 10}, {x: 11, y: 11}, {x: 11, y: 12}, {x: 11, y: 13}, {x: 11, y: 14}, {x: 11, y: 15}, {x: 11, y: 16}, {x: 11, y: 17}, {x: 11, y: 18}, {x: 11, y: 19},
        {x: 12, y: 9},
        {x: 13, y: 3}, {x: 13, y: 9},
        {x: 14, y: 9},
        {x: 15, y: 9},
        {x: 16, y: 9}, {x: 16, y: 13},
        {x: 17, y: 3}, {x: 17, y: 9}, {x: 17, y: 17},
        {x: 18, y: 9},
        {x: 19, y: 9},
      ])
    },
  ]
}
