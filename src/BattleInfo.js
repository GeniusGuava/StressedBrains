import battle1 from './Battles/battle1'
import converter from './Battles/textNumberConverter'

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

console.log(textToLevel(battle1.text))

export const enemySprite = [
  'assets/spriteSheets/minotaur.png'
]

export const enemySize = [
  {w: 96, h: 96}
]

export const weaponSprite = [
  'assets/backgrounds/sword.png'
]

export const level = [
  textToLevel(battle1.text)
]

export const playerStartPosition = [
  {x: 0, y:2}
]

export const weapons = [
  battle1.maps[0].weapons
]

export const enemies = [battle1.maps[0].enemies]

/*
export const enemies = [
  [
    {x:48, y:48},
    {x:80, y:48},
    {x:592, y:16},
    {x:400, y:208},
    {x:624, y:304},
    {x:560, y:304},
    {x:16, y:496},
    {x:400, y:400},
    {x:336, y:16},
    {x:336, y:336},
    {x:592, y:528},
    {x:400, y:560},
    {x:112, y:80},
    {x:80, y:560}
  ]
]
*/
