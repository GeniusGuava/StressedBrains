import { battle1, battle2, battle3, battle4, battle5, converter } from './Battles'

const battles = [battle1, battle2, battle3, battle4, battle5]

export let bufferRows = [[],[]]
for (let i=0;i<2;i++){
  for (let j=0;j<20;j++){
    bufferRows[i].push(0)
  }
}


export function textToLevel(text){
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
  'assets/spriteSheets/enemy/minotaur.png',
  'assets/spriteSheets/enemy/spider.png',
  'assets/spriteSheets/enemy/centipede.png',
  'assets/spriteSheets/enemy/cyclops.png',
  'assets/spriteSheets/enemy/adventurer.png'
]

export const enemySize = [
  {w: 96, h: 96},
  {w: 32, h: 22},
  {w: 70, h: 54},
  {w: 64, h: 64},
  {w: 32, h: 36}
]

export const getLevel = (level) => {
  return textToLevel(battles[level].text)
}

export const getText = (level) => {
  return battles[level].text
}

export const playerStartPosition = [
  {x: 0, y:2},
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

export const music = [
  'assets/audio/music/battle1.mp3',
  'assets/audio/music/battle2.mp3',
  'assets/audio/music/battle3.mp3',
  'assets/audio/music/battle4.mp3',
  'assets/audio/music/battle5.mp3',
]
