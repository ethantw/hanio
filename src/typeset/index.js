
import renderHWS     from './hws'
import renderHanging from './hanging'
import renderJiya    from './jiya'

export default class Typeset {
  constructor( $context ) {
    this.context = $context
  }
}

// Aliases:
Typeset.fn = Typeset.prototype

Object.assign( Typeset.fn, {
  renderHWS,
  renderHanging,
  renderJiya,
})

