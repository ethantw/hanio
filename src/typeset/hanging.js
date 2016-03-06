
import { create, parent, matches } from '../fn/dom'
import { TYPESET } from '../regex'
import { createBDChar } from '../find'

const $ = create

const rhangable = TYPESET.jinze.hanging
const HANGABLE_CLASS = 'bd-hangable'
const HANGABLE_AVOID = 'textarea, code, kbd, samp, pre, h-char.bd-hangable'
const CS_HTML = '<h-cs hidden class="jinze-outer hangable-outer"> </h-cs>'

const insertHangableCS = $jinze => {
  $jinze = $( $jinze )
  const $cs = $jinze.next()

  if ( $cs && $cs::matches( 'h-cs.jinze-outer' )) {
    $cs.addClass( 'hangable-outer' )
  } else {
    $jinze.after( CS_HTML )
  }
}

function replaceHangableBD( portion ) {
  if ( /^[\x20\t\r\n\f]+$/.test( portion.text )) {
    return ''
  }

  const $elmt = $(portion.node::parent())
  const $jinze = $elmt::parent( 'h-jinze' )

  if ( $jinze.length ) {
    insertHangableCS( $jinze )
  }

  const biaodian = portion.text.trim()

  if (!rhangable.test( biaodian )) {
    this
    .initDOMWithHTML( this.html )
    .renderHanging()
    return null
  }

  const $new = createBDChar( biaodian )
    .html( `<h-inner>${ biaodian }</h-inner>` )
    .addClass( HANGABLE_CLASS )

  const $bd = $elmt::parent( 'h-char.biaodian' )

  return $bd.length
    ? (() => {
      $bd.addClass( HANGABLE_CLASS )

      return $elmt::matches( 'h-inner, h-inner *' )
        ? biaodian
        : $new.children().first()
    })()
    : $new
}

export default function() {
  return (
    this
    .initDOMWithHTML( this.html )
    .addAvoid( HANGABLE_AVOID )
    .replace( rhangable, this::replaceHangableBD )
    .removeAvoid( HANGABLE_AVOID )
  )
}

