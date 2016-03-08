
import Core from './core'

const ROUTINE = [
  // Classify the root element as `.han-rendered`:
  'initCond',

  // Normalising text-level semantic elements:
  'renderElmt',

  // Handle Biaodian:
  'renderJiya',
  'renderHanging',

  // Address Hanzi and Western script mixed spacing:
  'renderHWS',

  // Address Biaodian correction:
  'correctBasicBD',

  // Address presentational correction to
  // combining ligatures, etc:
  // 'substCombLigaWithPUA',
]

Object.assign( Core,    { ROUTINE })
Object.assign( Core.fn, { routine: ROUTINE })

export default ROUTINE

