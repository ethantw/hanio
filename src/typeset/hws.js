
import { TYPESET } from '../regex'
import {
  create, next, parent, isElmt, matches
}  from '../fn/dom'

const $ = create

const hws  = `\{\{hws: ${Date.now()}\}\}`
const $hws = create( '<h-hws hidden> </h-hws>' )

const sharingSameParent = ( $a, $b ) =>
  $a && $b && $a::parent() === $b::parent()

const properlyPlaceHWSBehind = ( $node, text ) => {
  let $elmt = $node
  text = text || ''

  if (
    $node::next()::isElmt() ||
    sharingSameParent( $node, $node::next() )
  ) {
    return text + hws
  } else {
    // One of the parental elements of the current text
    // node would definitely have a next sibling, since
    // it is of the first portion and not `isEnd`.
    while (!$elmt::next()) {
      $elmt = $elmt::parent()
    }
    if ( $node !== $elmt ) {
      $( $elmt ).after( hws )
    }
  }
  return text
}

const firstStepLabel = ( portion, mat ) =>
  portion.isEnd && portion.idx === 0
    ? mat[1] + hws + mat[2]
    : portion.idx === 0
    ? properlyPlaceHWSBehind( portion.node, portion.text )
    : portion.text

const real$hwsElmt = portion =>
  portion.idx === 0
    ? $hws.clone()
    : ''

let last$hwsIdx

const apostrophe = portion => {
  let $elmt = $(portion.node::parent())

  if ( portion.idx === 0 ) {
    last$hwsIdx = portion.endIdxInNode-2
  }

  if (
    $elmt::matches( 'h-hws' ) && (
    portion.idx === 1 || portion.idxInMat === last$hwsIdx
  )) {
    $elmt.addClass( 'quote-inner' )
  }
  return portion.text
}

const curveQuote = portion => {
  let $elmt = $(portion.node::parent())

  if ($elmt::matches( 'h-hws' )) {
    $elmt.addClass( 'quote-outer' )
  }
  return portion.text
}

export default function( strict=false ) {
  const mode = strict ? 'strict' : 'base'

  // Elements to be filtered according to the
  // HWS rendering mode.
  const avoid = strict
    ? 'textarea, code, kbd, samp, pre'
    : 'textarea'

  this
  .addAvoid( avoid )

  // Basic situations:
  // - 字a => 字{{hws}}a => 字<hws/>a
  // - A字 => A{{hws}}字 => A<hws/>字
  .replace( TYPESET.hws[ mode ][0], firstStepLabel )
  .replace( TYPESET.hws[ mode ][1], firstStepLabel )

  // Convert all `{{hws}}` labels into real elements:
  .replace(
    new RegExp( `(?:${hws})+`, 'g' ), real$hwsElmt
  )

  // Re-Initialise the DOM in order to properly perform
  // lazy search w/o messy fake nodes:
  .initDOMWithHTML( this.html )

  // Deal with:
  // - '{{hws}}字{{hws}}' => '字'
  // - "{{hws}}字{{hws}}" => "字"
  .replace( /(['"])\s(.*?)\s\1/g, apostrophe )

  // Omit `{{hws}}` preceding/following [‘字’] and [“字”],
  // See: https://github.com/ethantw/Han/issues/59
  .replace( /\s[‘“]/g, curveQuote )
  .replace( /[’”]\s/g, curveQuote )

  .removeAvoid( avoid )

  return this
}

