
import {
  prev, addClass,
  matches, isIgnorable,
} from '../fn/dom'

export default function( target='u, ins' ) {
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

