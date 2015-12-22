
import {
  prev, addClass,
  matches, isIgnorable,
} from '../fn/dom'

const Fibrio = IMPORT( 'fibrio' )

const EM_AVOID = 'rt, h-char, h-char-group'

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

  renderDecoLine( target='u, ins' ) {
    const $target = this.context.find( target )
    let i = $target.length

    traverse: while ( i-- ) {
      const $this = $target[ i ]
      let $prev

      // Ignore all `<wbr>` and comments in between,
      // and add class `.adjacent` once two targets
      // are next to each other.
      do {
        $prev = ( $prev || $this )::prev()

        if ( $prev && $prev === $target[ i-1 ] ) {
          $this::addClass( 'adjacent' )
        }
      } while ( $prev::isIgnorable())
    }
    return this
  }

  renderEm( target='em' ) {
    return this
    .filter( target )
    .addAvoid( EM_AVOID )
    .jinzify()
    .groupify({
      western:  true,
      biaodian: true,
    })
    .charify({ all: true })
    .removeAvoid( EM_AVOID )
    .end()
  }

  renderRuby() {
    return this
  }
}

Locale.fn = Locale.prototype
Locale.fn.renderElem = Locale.fn.renderElmt
export default Locale

