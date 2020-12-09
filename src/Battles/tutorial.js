import {TILE_SIZE} from '../MapInfo'

const gridToPixel = (coordsArray) =>  {
  return coordsArray.map(coords=>({
      x: coords.x*TILE_SIZE+TILE_SIZE/2,
      y: coords.y*TILE_SIZE+TILE_SIZE/2
  }))
}
export default {
  text: "\
  Vim is a text editor\n\
  that is especially  \n\
  useful for coding.  \n\
  One of the biggest  \n\
  complaints about Vim\n\
  is its very steep   \n\
  learning curve, even\n\
  with basic commands \n\
  like moving around. \n\
  This game aims to   \n\
  teach the basic move\n\
  commands. If at any \n\
  point you can't move\n\
  just click on help! \n\
  Try moving around a \n\
  little, and, when   \n\
  you're ready, grab  \n\
  the swords to start!",
  maps: [
    {
      weapons: gridToPixel([
        {x: 0, y: 19},
        {x: 19, y: 2},
        {x: 19, y: 19},
      ]),
    }
  ]
}
