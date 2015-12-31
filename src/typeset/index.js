
export default class Typeset {
  constructor( $context ) {
    this.context = $context
  }

  correctBiaodian() {
    return this.charify({ biaodian: true })
  }
}

Typeset.fn = Typeset.prototype

