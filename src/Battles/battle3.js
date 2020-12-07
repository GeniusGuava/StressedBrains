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
  will face foes you  \n\
  cannot match and    \n\
  trials you simply   \n\
  cannot overcome     \n\
  there is no shame to\n\
  be had in retreat   \n\
  you must only ask   \n\
  yourself when it is \n\
  safe to turn back   \n\
  because this maze   \n\
  winds and this maze \n\
  beguiles and if you \n\
  are not willing to  \n\
  trace your steps    \n\
  then surely you will\n\
  wander these halls  \n\
  until you persih    ",
  maps: [
    {
      weapons: gridToPixel([
        {x: 15, y: 4},
        {x: 17, y: 13},
        {x: 2, y: 17},
      ]),
      enemies: gridToPixel([
        {x: 0, y: 9},
        {x: 1, y: 9}, {x: 1, y: 11}, {x: 1, y: 13},
        {x: 2, y: 9},
        {x: 3, y: 9},
        {x: 4, y: 9},
        {x: 5, y: 9},
        {x: 6, y: 9}, {x: 6, y: 16},
        {x: 7, y: 9},
        {x: 8, y: 2}, {x: 8, y: 3}, {x: 8, y: 4}, {x: 8, y: 5}, {x: 8, y: 6}, {x: 8, y: 7}, {x: 8, y: 8}, {x: 8, y: 9}, {x: 8, y: 10}, {x: 8, y: 11}, {x: 8, y: 12}, {x: 8, y: 13}, {x: 8, y: 14}, {x: 8, y: 15}, {x: 8, y: 16}, {x: 8, y: 17}, {x: 8, y: 18}, {x: 8, y: 19},
        {x: 11, y: 5}, {x: 11, y: 16},
        {x: 12, y: 6},
        {x: 14, y: 11},
        {x: 17, y: 17},
      ])
    },
    {
      weapons: gridToPixel([
        {x: 17,y: 9},
        {x: 4,y: 14},
        {x: 0,y: 19},
      ]),
      enemies: gridToPixel([
      ])
    },
    {
      weapons: gridToPixel([
        {x: 3, y: 8},
        {x: 19, y: 11},
        {x: 0, y: 19},
      ]),
      enemies: gridToPixel([
      ])
    },
    {
      weapons: gridToPixel([
        {x: 19, y: 8},
        {x: 9, y: 14},
        {x: 9, y: 10},
      ]),
      enemies: gridToPixel([
      ])
    },
  ]
}
