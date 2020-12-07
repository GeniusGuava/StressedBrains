import battle1 from './Battles/battle1'
import battle2 from './Battles/battle2'
import battle3 from './Battles/battle3'
import battle4 from './Battles/battle4'
import converter from './Battles/textNumberConverter'

const battles = [battle1, battle2, battle3, battle4]

let bufferRows = [[],[]]
for (let i=0;i<2;i++){
  for (let j=0;j<20;j++){
    bufferRows[i].push(0)
  }
}


function textToLevel(text){
  const splitByNewLine = text.split('\n')
  let trimmed
  return bufferRows.concat(splitByNewLine.map(line=>{
    trimmed = line.slice(2)
    return Array.from(trimmed).map(letter=>{
      return converter[letter.toLowerCase()]
    })
  }))
}

export const enemySprite = [
  'assets/spriteSheets/minotaur.png',
  'assets/spriteSheets/minotaur.png',
  'assets/spriteSheets/minotaur.png',
  'assets/spriteSheets/minotaur.png',
]

export const enemySize = [
  {w: 96, h: 96},
  {w: 96, h: 96},
  {w: 96, h: 96},
  {w: 96, h: 96},
]

export const weaponSprite = [
  'assets/backgrounds/sword.png',
  'assets/backgrounds/sword.png',
  'assets/backgrounds/sword.png',
  'assets/backgrounds/sword.png',
]

export const getLevel = (level) => {
  return textToLevel(battles[level].text)
}

export const playerStartPosition = [
  {x: 0, y:2},
  {x: 0, y:2},
  {x: 0, y:2},
  {x: 0, y:2},
]

export const getWeapons = (level, wins) => {
  return battles[level].maps[wins].weapons
}

export const getEnemies = (level, wins) => {
  return battles[level].maps[wins].enemies
}
