
import Fibrio from 'fibrio'

const EM_AVOID = 'rt, h-char, h-char-group'

export default function( target='em' ) {
  this
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
  return this
}

