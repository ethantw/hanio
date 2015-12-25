
import renderDecoLine from './decoline'
import renderEm       from './em'
import * as rubyFn    from './ruby'

class Locale {
  constructor( $context ) {
    this.context = $context
  }

  renderElmt() {
    this.renderRuby()
    this.renderDecoLine()
    this.renderDecoLine( 's, del' )
    this.renderEm()
    return this
  }
}

Locale.fn = Locale.prototype

Object.assign(
  Locale.fn,
  rubyFn,
  {
    renderElem: Locale.fn.renderElmt,
    renderDecoLine,
    renderEm,
  }
)

export default Locale

