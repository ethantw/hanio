
import { TYPESET } from '../regex'
import { create }  from '../fn/dom'

const HANGING_AVOID = 'textarea, code, kbd, samp, pre, h-hangable'

const $hangable = ( preceding, hangable ) =>
  create( `<h-hangable>${preceding}<h-cs><h-inner hidden> </h-inner><h-char class="biaodian bd-close bd-end cjk">${hangable}</h-char></h-cs></h-hangable>` )

export default function() {
  this
  .addAvoid( HANGING_AVOID )
  .replace(
    TYPESET.jinze.hanging,
    ( portion, mat ) => portion.idx === 0
      ? $hangable( mat[1], mat[2] )
      : ''
  )
  .removeAvoid( HANGING_AVOID )

  return this
}

