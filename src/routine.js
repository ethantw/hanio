
import Core from './core'

const ROUTINE = [
  // Classify the root element as `.han-rendered`:
  'initCond',
   // Address element normalisation:
  'renderElmt',

  // Handle Biaodian:
  'renderHanging',
  'renderJiya',

  // Address Hanzi and Western script mixed spacing:
  'renderHWS',

  // Address Basic Biaodian correction in Firefox:
  'correctBasicBD',

  // Address presentational correction to combining ligatures:
  // 'substCombLigaWithPUA',
]

Object.assign( Core,    { ROUTINE })
Object.assign( Core.fn, { routine: ROUTINE })

export default ROUTINE

