
import { next, isIgnorable } from '../fn/dom'

const $      = IMPORT( 'cheerio' )
const Fibrio = IMPORT( 'fibrio' )

class Locale {
  constructor( $elmt ) {
    this.context = $elmt
  }

  renderElmt() {
    this.renderRuby()
    this.renderDecoLine()
    this.renderDecoLine( 's, del' )
    this.renderEm()
    return this
  }

  renderDecoLine( target='u, ins' ) {
    const $target = this.context.find( target )
    let i = $target.length

    traverse: while ( i-- ) {
      let elmt = $target[ i ]
      let adjacent

      // Ignore all `<wbr>` and comments in between.
      do {
        adjacent = ( adjacent || elmt )::next()
        if ( !adjacent )  continue traverse
      } while ( adjacent::isIgnorable())

      if ( Fibrio.matches( adjacent, target )) {
        $( adjacent ).addClass( 'adjacent' )
      }
    }
    return this
  }

  renderEm() {
    return this
  }

  renderRuby() {
    return this
  }
}

Locale.fn = Locale.prototype
Locale.fn.renderElem = Locale.fn.renderElmt
export default Locale

