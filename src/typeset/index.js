
import renderHWS     from './hws'
import renderHanging from './hanging'
import renderJiya    from './jiya'

export default class Typeset {
  constructor( $context ) {
    this.context = $context
  }

  correctBiaodian() {
    return this.charify({ biaodian: true })
  }
}

// Aliases:
Typeset.fn = Typeset.prototype
Typeset.fn.correctBasicBD = Typeset.fn.correctBiaodian

Object.assign( Typeset.fn, {
  renderHWS,
})

