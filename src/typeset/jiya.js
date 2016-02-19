
import { UNICODE, TYPESET } from '../regex'
import { create, parent } from '../fn/dom'

const $ = create

const JIYA_AVOID = 'textarea, code, kbd, samp, pre, h-cs, h-char.biaodian'
const csHTML = '<h-cs hidden> </h-cs>'

const get$csoHTML = ( prev, clazz ) =>
  `<h-cs hidden prev="${prev}" class="jinze-outer ${clazz}"> </h-cs>`

const get$bdType = $char =>
  $char.hasClass( 'bd-open' )
    ? 'bd-open'
    : $char.hasClass( 'bd-close' )
    ? 'bd-close'
    : $char.hasClass( 'bd-middle' )
    ? 'bd-middle'
    : $char.hasClass( 'bd-liga' )
    ? 'bd-liga'
    : $char.hasClass( 'bd-end' )
    ? (
      /(?:3001|3002|ff0c)/i.test($char.attr( 'unicode' ))
      // `cop` stands for ‘comma or period’.
      ? 'bd-end bd-cop'
      : 'bd-end'
    )
    : ''

let prevBiaodianType

const locateConsecutiveBd = portion => {
  var $elmt = $(portion.node::parent())

  while (!$elmt.is( 'h-char.biaodian' )) {
    $elmt = $elmt.parent()
  }

  if ( prevBiaodianType ) {
    $elmt.attr( 'prev', prevBiaodianType )
  }

  if ( portion.isEnd ) {
    prevBiaodianType = undefined
    $elmt.addClass( 'consecutive-bd end-portion' )
  } else {
    prevBiaodianType = get$bdType( $elmt )
    $elmt.addClass( 'consecutive-bd' )
  }

  return portion.text
}


export default function() {
  this
  .addAvoid( JIYA_AVOID )
  .charify({ biaodian: true })
  .removeAvoid( 'h-char.biaodian' )

  .replace( TYPESET.group.biaodian[0], locateConsecutiveBd )
  .replace( TYPESET.group.biaodian[1], locateConsecutiveBd )

  // The reason we’re doing this instead of using
  // pseudo elements in CSS is because WebKit has
  // problem rendering pseudo elements containing
  // only spaces.
  $( this.context )
  .find( 'h-char.bd-open, h-char.bd-end' )
  .each(( _, $elmt ) => {
    $elmt = $( $elmt )
    const html = `<h-inner>${$elmt.html()}</h-inner>`

    $elmt.html(
      $elmt.hasClass( 'bd-open' )
      ? csHTML + html
      : html + csHTML
    )
  })
  .end()
  .find( 'h-jinze' )
  .each(( _, $jinze ) => {
    $jinze = $( $jinze )
    let clazz = 'jiya-outer '
    let $char, prev

    if ($jinze.is( '.tou, .touwei' )) {
      $char = $jinze.find( '.biaodian:first-child' )
      prev  = $char.attr( 'prev' ) || ''

      $jinze.before(get$csoHTML( prev, clazz ))
    }

    if ($jinze.is( '.wei, .touwei' )) {
      $char = $jinze.find( '.biaodian:last-child' )
      clazz += $char.attr( 'class' )

      $jinze.after(get$csoHTML( '', clazz ))
    }
  })
  return this
}

