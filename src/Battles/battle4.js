import {TILE_SIZE} from '../MapInfo'

const gridToPixel = (coordsArray) =>  {
  return coordsArray.map(coords=>({
      x: coords.x*TILE_SIZE+TILE_SIZE/2,
      y: coords.y*TILE_SIZE+TILE_SIZE/2
  }))
}

export default {
  text: "\
  ariadne ariadne you \n\
  have journeyed far  \n\
  and conquered many  \n\
  terrible enemies but\n\
  sometimes it is     \n\
  crucial to hesitate \n\
  before the finale if\n\
  you insist on flying\n\
  your wings may burn \n\
  and your escape will\n\
  forever elude you   \n\
  there is wisdom in  \n\
  pausing at the end  \n\
  of things because   \n\
  nothing truly ends  \n\
  the end of one word \n\
  merely marks the    \n\
  beginning of another",
  maps: [
    {
      weapons: gridToPixel([
        {x: 15, y: 2},
        {x: 19, y: 5},
        {x: 19, y: 19},
      ]),
      enemies: gridToPixel([
        {x: 0, y: 4},
        {x: 1, y: 2}, {x: 1, y: 3}, {x: 1, y: 4}, {x: 1, y: 5}, {x: 1, y: 6}, {x: 1, y: 7}, {x: 1, y: 8}, {x: 1, y: 9}, {x: 1, y: 10}, {x: 1, y: 11}, {x: 1, y: 12}, {x: 1, y: 13}, {x: 1, y: 14}, {x: 1, y: 15}, {x: 1, y: 16}, {x: 1, y: 17}, {x: 1, y: 18}, {x: 1, y: 19},
        {x: 4, y: 4},
        {x: 5, y: 4}, {x: 5, y: 5},
        {x: 6, y: 4},
        {x: 7, y: 4},
        {x: 8, y: 2}, {x: 8, y: 4},
        {x: 6, y: 9}, {x: 6, y: 16},
        {x: 9, y: 4}, {x: 9, y: 7}, {x: 9, y: 8}, {x: 9, y: 9}, {x: 9, y: 10}, {x: 9, y: 11}, {x: 9, y: 12}, {x: 9, y: 13}, {x: 9, y: 14}, {x: 9, y: 15}, {x: 9, y: 16}, {x: 9, y: 17}, {x: 9, y: 18}, {x: 9, y: 19},
        {x: 10, y: 4}, {x: 10, y: 7}, {x: 10, y: 8}, {x: 10, y: 9}, {x: 10, y: 10}, {x: 10, y: 11}, {x: 10, y: 12}, {x: 10, y: 13}, {x: 10, y: 14}, {x: 10, y: 15}, {x: 10, y: 16}, {x: 10, y: 17}, {x: 10, y: 18}, {x: 10, y: 19},
        {x: 11, y: 4}, {x: 11, y: 7}, {x: 11, y: 8}, {x: 11, y: 9}, {x: 11, y: 10}, {x: 11, y: 11}, {x: 11, y: 12}, {x: 11, y: 13}, {x: 11, y: 14}, {x: 11, y: 15}, {x: 11, y: 16}, {x: 11, y: 17}, {x: 11, y: 18}, {x: 11, y: 19},
        {x: 12, y: 4}, {x: 12, y: 7}, {x: 12, y: 8}, {x: 12, y: 9}, {x: 12, y: 10}, {x: 12, y: 11}, {x: 12, y: 12}, {x: 12, y: 13}, {x: 12, y: 14}, {x: 12, y: 15}, {x: 12, y: 16}, {x: 12, y: 17}, {x: 12, y: 18}, {x: 12, y: 19},
        {x: 13, y: 2}, {x: 13, y: 3}, {x: 13, y: 4}, {x: 13, y: 5}, {x: 13, y: 6}, {x: 13, y: 7}, {x: 13, y: 8}, {x: 13, y: 9}, {x: 13, y: 10}, {x: 13, y: 11}, {x: 13, y: 12}, {x: 13, y: 13}, {x: 13, y: 14}, {x: 13, y: 15}, {x: 13, y: 16}, {x: 13, y: 17}, {x: 13, y: 18}, {x: 13, y: 19},
        {x: 14, y: 6}, {x: 14, y: 7}, {x: 14, y: 8}, {x: 14, y: 9}, {x: 14, y: 10}, {x: 14, y: 11}, {x: 14, y: 12}, {x: 14, y: 13}, {x: 14, y: 14}, {x: 14, y: 15}, {x: 14, y: 16}, {x: 14, y: 17}, {x: 14, y: 18}, {x: 14, y: 19},
        {x: 15, y: 3}, {x: 15, y: 6},
        {x: 16, y: 2}, {x: 16, y: 4}, {x: 16, y: 6},
        {x: 17, y: 5}, {x: 17, y: 6},
        {x: 18, y: 6}, {x: 18, y: 10}, {x: 18, y: 11}, {x: 18, y: 12}, {x: 18, y: 13}, {x: 18, y: 14}, {x: 18, y: 15}, {x: 18, y: 16}, {x: 18, y: 17}, {x: 18, y: 18}, {x: 18, y: 19},
        {x: 19, y: 10},
      ])
    },
    {
      weapons: gridToPixel([
        {x: 6,y: 7},
        {x: 7,y: 19},
        {x: 15,y: 19},
      ]),
      enemies: gridToPixel([
      ])
    },
    {
      weapons: gridToPixel([
        {x: 15, y: 5},
        {x: 6, y: 12},
        {x: 19, y: 19},
      ]),
      enemies: gridToPixel([
      ])
    },
    {
      weapons: gridToPixel([
        {x: 8, y: 5},
        {x: 9, y: 10},
        {x: 10, y: 15},
      ]),
      enemies: gridToPixel([
      ])
    },
  ]
}
