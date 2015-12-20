
import Core       from './core'
import { create } from './fn/dom'
import {
  UNICODE, TYPESET,
} from './regex.js'

Core.find = IMPORT( 'fibrio' )

const JINZE_AVOID = 'h-jinze'

const createBdGroup = ( portion, mat ) => {
  const $elmt = create(
    `<h-char-group class="biaodian cjk">${
      portion.text
    }</h-char-group>`
  )
  return portion.idx === 0 && portion.isEnd
    ? $elmt
    : $elmt.addClass(
      `portion ${
        portion.idx === 0
        ? 'is-first isFirst'
        : portion.isEnd
        ? 'is-end isEnd'
        : ''
      }`
    )
}

const createBdChar = char => {
  return create(
    `<h-char unicode="${
      char.charCodeAt( 0 ).toString( 16 )
    }" class="biaodian cjk ${
      char.match( TYPESET.char.biaodian.open )
      ? 'bd-open'
      : char.match( TYPESET.char.biaodian.close )
      ? 'bd-close bd-end'
      : char.match( TYPESET.char.biaodian.end )
      ? 'bd-end'
      : char.match( new RegExp( UNICODE.biaodian.liga ))
      ? 'bd-liga'
      : ''
    }">${ char }</h-char>`
  )
}

Object.assign( Core.find.fn, {
  end() {
    this.context = this.root
    this.root    = null
    return this
  },

  jinzify( selector ) {
    this
    .filter( selector )
    .addAvoid( JINZE_AVOID )
    .replace(
      TYPESET.jinze.touwei,
      ( portion, mat ) => (
        portion.idx === 0 && portion.isEnd || portion.idx === 1
      )
        ? create( `<h-jinze class="touwei">${ mat[0] }</h-jinze≥` )
        : ''
    )
    .replace(
      TYPESET.jinze.wei,
      ( portion, mat ) => portion.idx === 0
        ? create( `<h-jinze class="wei">${ mat[0] }</h-jinze≥` )
        : ''
    )
    .replace(
      TYPESET.jinze.tou,
      ( portion, mat ) => (
        portion.idx === 0 && portion.isEnd || portion.idx === 1
      )
        ? create( `<h-jinze class="tou">${ mat[0] }</h-jinze≥` )
        : ''
    )
    .replace(
      TYPESET.jinze.middle,
      ( portion, mat ) => (
        portion.idx === 0 && portion.isEnd || portion.idx === 1
      )
        ? create( `<h-jinze class="zhong middle">${ mat[0] }</h-jinze≥` )
        : ''
    )
    .removeAvoid( JINZE_AVOID )
    .end()

    return this
  },

  groupify() {
    return this
  },

  charify() {
    return this
  },
})

void [
  'mode', 'action', 'process',
  'wrap', 'replace', 'revert',
  'filter', 'end',
  'addAvoid', 'addBdry',
  'removeAvoid','removeBdry',
  'jinzify', 'groupify', 'charify',
].forEach( method => {
  Core.fn[ method ] = function( ...arg ) {
    this.finder[ method ]( ...arg )
    return this
  }
})

