
import correctBiaodian from './biaodian'

export default class Typography {
  constructor( $context ) {
    this.context = $context
  }
}

// Aliases:
Typography.fn = Typography.prototype

Object.assign( Typography.fn, {
  correctBiaodian,
  correctBD: correctBiaodian,
})

