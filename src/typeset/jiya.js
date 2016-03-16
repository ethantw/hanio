
import { UNICODE, TYPESET } from '../regex'
import { create, parent, prev, next, matches } from '../fn/dom'
import { createBDChar } from '../find'

const $ = create

const CONSECUTIVE_BD_AR = TYPESET.consecutive.biaodian
const JIYA_CLASS = 'bd-jiya'
const JIYA_AVOID = 'textarea, code, kbd, samp, pre, h-cs, h-char.bd-jiya'
const CONSECUTIVE_CLASS = 'bd-consecutive'
const CS_HTML = '<h-cs hidden class="jinze-outer jiya-outer"> </h-cs>'

const trimBDClass = clazz => clazz.replace(
  /(biaodian|cjk|bd-jiya|bd-consecutive|bd-hangable)/gi, ''
).trim()

const charifyBiaodian = portion => {
  const $elmt = $(portion.node::parent())
  const biaodian = portion.text

  const $new = createBDChar( biaodian )
    .html( '<h-inner>' + biaodian + '</h-inner>' )
    .addClass( JIYA_CLASS )

  const $jinze = $elmt::parent( 'h-jinze' )

  if ( $jinze.length ) {
    insertJiyaCS( $jinze )
  }

  const $bd = $elmt::parent( 'h-char.biaodian' )

  return $bd.length
    ? (() => {
      $bd.addClass( JIYA_CLASS )

      return $elmt::matches( 'h-inner, h-inner *' )
        ? biaodian
        : $new.children().first()
    })()
    : $new
}

let prevBDType

const locateConsecutiveBD = portion => {
  const $elmt = $(portion.node::parent())
  const $bd = $elmt::parent( 'h-char.biaodian' )
  const prev = prevBDType

  if ( prev ) {
    $bd.attr( 'prev', prev )
  }

  if ( portion.isEnd ) {
    prevBDType = undefined
    $bd.addClass( CONSECUTIVE_CLASS + ' end-portion' )
  } else {
    prevBDType = trimBDClass($bd.attr( 'class' ))
    $bd.addClass( CONSECUTIVE_CLASS )
  }

  const $jinze = $bd::parent( 'h-jinze' )

  if ( $jinze.length ) {
    locateCS( $jinze, {
      prev: prev,
      'class': trimBDClass($bd.attr( 'class' )),
    })
  }
  return portion.text
}

const insertJiyaCS = $jinze => {
  $jinze = $( $jinze )
  if (
    $jinze::matches( '.tou, .touwei' ) &&
    !$jinze::prev()::matches( 'h-cs.jiya-outer' )
  ) {
    $jinze.before( CS_HTML )
  }
  if (
    $jinze::matches( '.wei, .touwei' ) &&
    !$jinze::next()::matches( 'h-cs.jiya-outer' )
  ) {
    $jinze.after( CS_HTML )
  }
}

const locateCS = ( $jinze, attr ) => {
  let $cs

  if ($jinze::matches( '.tou, .touwei' )) {
    $cs = $jinze.prev()

    if ($cs::matches( 'h-cs' )) {
      $cs.attr({
        'class': 'jinze-outer jiya-outer',
        prev: attr.prev,
      })
    }
  }
  if ($jinze::matches( '.wei, .touwei' )) {
    $cs = $jinze.next()

    if ($cs::matches( 'h-cs' )) {
      $cs
      .attr({
        'class': 'jinze-outer jiya-outer ' + attr[ 'class' ],
      })
      .removeAttr( 'prev' )
    }
  }
}

export default function() {
  return (
    this
    .addAvoid( JIYA_AVOID )
    .charify({
      avoid:    false,
      biaodian: charifyBiaodian,
    })
    .removeAvoid( 'h-char.bd-jiya' )
    .replace( CONSECUTIVE_BD_AR[0], locateConsecutiveBD )
    .replace( CONSECUTIVE_BD_AR[1], locateConsecutiveBD )
    .replace( CONSECUTIVE_BD_AR[2], locateConsecutiveBD )
  )
}

