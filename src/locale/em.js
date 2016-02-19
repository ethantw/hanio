
import Fibrio from 'fibrio'

const EM_AVOID = 'rt, h-char'

/**
 * Traverse all target elements to render
 * emphasis marks.
 */
export default function( target='em' ) {
  this
  .filter( target )
  .addAvoid( EM_AVOID )
  .jinzify()
  .groupify({ western: true })
  .charify({ all: true })
  .removeAvoid( EM_AVOID )
  .end()
  return this
}

