
import { create, parent } from '../fn/dom'
import { TYPESET } from '../regex'
import { createBdChar } from '../find'

const $ = create
const HANGING_AVOID = 'textarea, code, kbd, samp, pre, h-cs, h-char.hangable'
const get$hangableInnerHTML = biaodian => `<h-cs hidden> </h-cs><h-inner>${biaodian}</h-inner>`

const rhangable = TYPESET.jinze.hanging

export default function() {
  this
  .addAvoid( HANGING_AVOID )
  .replace(
    rhangable,
    portion => {
      const $node = portion.node
      let $elmt   = $($node::parent())

      const beenWrapped = $elmt.is( 'h-char[unicode], h-char[unicode] *' )
      const biaodian    = portion.text

      if (!rhangable.test( biaodian )) {
        this
        .initDOMWithHTML( this.html )
        .renderHanging()
        return null
      }

      if ($elmt.is( 'h-jinze, h-jinze *' )) {
        let $jinze = $elmt
        let $cs

        while (!$jinze.is( 'h-jinze' )) {
          $jinze = $jinze.parent()
        }

        $cs = $jinze.next()

        if ( $cs && $cs.is( 'h-cs.jinze-outer' )) {
          $cs.addClass( 'hangable-outer' )
        } else {
          $jinze.after( '<h-cs hidden class="jinze-outer hangable-outer"> </h-cs>' )
        }
      }

      if ( beenWrapped ) {
        while (!$elmt.is( 'h-char[unicode]' )) {
          $elmt = $elmt.parent()
        }
      } else {
        $elmt = createBdChar( biaodian )
      }

      $elmt
      .addClass( 'hangable' )
      .html(get$hangableInnerHTML( portion.text ))

      return beenWrapped
        ? null
        : $elmt
    }
  )
  .removeAvoid( HANGING_AVOID )

  return this
}

