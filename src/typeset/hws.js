
import { TYPESET } from '../regex'
import {
  create, next, parent, isElmt
}  from '../fn/dom'

const $    = create
const hws  = `\{\{hws: ${Date.now()}\}\}`
const $hws = create( '<h-hws hidden> </h-hws>' )

const sharingSameParent = ( $a, $b ) =>
  $a && $b && $a::parent() === $b::parent()

const properlyPlaceHWSBehind = ( $node, text ) => {
  let $elmt = $node
  text = text || ''

  if (
    $node::next()::isElmt() ||
    sharingSameParent( $node, $node::next())
  ) {
    return text + hws
  } else {
    // One of the parental elements of the current text
    // node would definitely have a next sibling, since
    // it is of the first portion and not `isEnd`.
    while ( !$elmt::next()) {
      $elmt = $elmt::parent()
    }
    if ( $node !== $elmt ) {
      $( $elmt ).after( hws )
    }
  }
  return text
}

const replacementFn = ( portion, mat ) =>
  portion.isEnd && portion.idx === 0
    ? mat[1] + hws + mat[2]
    : portion.idx === 0
    ? properlyPlaceHWSBehind( portion.node, portion.text )
    : portion.text

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
  // - 字a => 字<hws/>a
  // - A字 => A<hws/>字
  .replace( TYPESET.hws[ mode ][0], replacementFn )
  .replace( TYPESET.hws[ mode ][1], replacementFn )

  // Re-Initialise the DOM in order to perform lazy search:
  .initDOMWithHTML( this.html )

  // Deal with:
  // - '<hws/>字<hws/>' => '字'
  // - "<hws/>字<hws/>" => "字"
  .replace(
    new RegExp( `(['"])(?:${hws})+(.*?)(?:${hws})+\\1`, 'g' ),
    '$1$2$1'
  )

  // Omit `<hws/>` preceding/following [‘字’] and [“字”],
  // See: https://github.com/ethantw/Han/issues/59
  .replace( new RegExp( `(?:${hws})+([‘“]+)`, 'g' ), '$1' )
  .replace( new RegExp( `([’”]+)(?:${hws})+`, 'g' ), '$1' )

  // Convert text nodes `<hws/>` into real elements:
  .replace(
    new RegExp( `(?:${hws})+`, 'g' ),
    () => $hws.clone()
  )
  .removeAvoid( avoid )

  return this
}

