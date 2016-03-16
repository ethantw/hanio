
import Fibrio from 'fibrio'
import Core   from './core'
import { create, isElmt } from './fn/dom'
import { UNICODE, TYPESET } from './regex.js'

const [ JINZE_AVOID, GROUP_AVOID, CHAR_AVOID ] = [
  'h-jinze',
  'h-char-group, h-word',
  'h-char',
]

const charWrapper = ( a, b ) => (
    a::isElmt() || typeof a === 'function'
  ) ? a : b

export const createBDGroup = portion => {
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
        ? 'is-first'
        : portion.isEnd
        ? 'is-end'
        : 'is-inner'
      }`
    )
}

export const createBDChar = char => create(
  `<h-char unicode="${
    char.charCodeAt( 0 ).toString( 16 )
  }" class="biaodian cjk ${
    getBDType( char )
  }">${ char }</h-char>`
)

export const getBDType = char => (
  char.match( TYPESET.char.biaodian.open )
    ? 'bd-open'
    : char.match( TYPESET.char.biaodian.close )
    ? 'bd-close bd-end'
    : char.match( TYPESET.char.biaodian.end )
      ? (
        /(?:\u3001|\u3002|\uff0c)/i.test( char )
        ? 'bd-end bd-cop'
        : 'bd-end'
      )
    : char.match( TYPESET.char.biaodian.liga )
    ? 'bd-liga'
    : char.match( TYPESET.char.biaodian.middle )
    ? 'bd-middle'
    : ''
)

Object.assign( Fibrio.fn, {
  end() {
    if ( !this.root )  return this
    this.context = this.root
    this.root    = undefined
    return this
  },

  jinzify() {
    this
    .addAvoid( JINZE_AVOID )
    .replace(
      TYPESET.jinze.touwei,
      portion => (
        portion.idx === 0 && portion.isEnd || portion.idx === 1
      )
        ? create( `<h-jinze class="touwei">${ portion.text }</h-jinze≥` )
        : ''
    )
    .replace(
      TYPESET.jinze.wei,
      portion => portion.idx === 0
        ? create( `<h-jinze class="wei">${ portion.text }</h-jinze≥` )
        : ''
    )
    .replace(
      TYPESET.jinze.tou,
      portion => (
        portion.idx === 0 && portion.isEnd || portion.idx === 1
      )
        ? create( `<h-jinze class="tou">${ portion.text }</h-jinze≥` )
        : ''
    )
    .replace(
      TYPESET.jinze.middle,
      portion => (
        portion.idx === 0 && portion.isEnd || portion.idx === 1
      )
        ? create( `<h-jinze class="zhong">${ portion.text }</h-jinze≥` )
        : ''
    )
    .removeAvoid( JINZE_AVOID )

    return this
  },

  groupify( option={} ) {
    const { all, eastasian, hanzi } = option

    option = Object.assign({
      biaodian: all,
    //punct:    all,
      hanzi:    all || eastasian, // Include Kana
      kana:     all || eastasian || hanzi,
      eonmun:   all || eastasian,
      western:  all, // Include Latin, Greek and Cyrillic alphabet
    }, option )

    this.addAvoid( GROUP_AVOID )

    if ( option.biaodian ) {
      this
      .replace( TYPESET.group.biaodian[0], createBDGroup )
      .replace( TYPESET.group.biaodian[1], createBDGroup )
      .replace( TYPESET.group.biaodian[2], createBDGroup )
    }

    if ( option.hanzi || option.cjk ) {
      this
      .wrap(
        TYPESET.group.kana,
        `<h-char-group class="eastasian cjk kana"></h-char-group>`
      )
      .wrap(
        TYPESET.group.hanzi,
        `<h-char-group class="eastasian hanzi cjk"></h-char-group>`
      )
    }

    if ( option.western ) {
      this.wrap(
        TYPESET.group.western,
        `<h-word class="western"></h-word>`
      )
    }

    if ( option.kana ) {
      this.wrap(
        TYPESET.group.kana,
        `<h-char-group class="eastasian cjk kana"></h-char-group>`
      )
    }

    if ( option.eonmun || option.hangul ) {
      this.wrap(
        TYPESET.group.eonmun,
        `<h-word class="eastasian eonmun hangul"></h-word>`
      )
    }

    this.removeAvoid( GROUP_AVOID )
    return this
  },

  charify( option={} ) {
    const { all, eastasian, western, hanzi } = option

    option = Object.assign({
      avoid:     true,
      biaodian:  all,
      punct:     all,
      hanzi:     all || eastasian, // Include Kana
      kana:      all || eastasian || hanzi,
      eonmun:    all || eastasian,
      western:   all || eastasian, // Include Latin, Greek and Cyrillic alphabet
      latin:     all || western,
      ellinika:  all || western,
      kirillica: all || western,
    }, option )

    if ( option.avoid ) {
      this.addAvoid( CHAR_AVOID )
    }

    if ( option.biaodian ) {
      this.replace(
        TYPESET.char.biaodian.all,
        charWrapper(
          option.biaodian,
          portion => createBDChar( portion.text )
        )
      ).replace(
        TYPESET.char.biaodian.liga,
        charWrapper(
          option.biaodian,
          portion => createBDChar( portion.text )
        )
      )
    }

    if ( option.hanzi || option.cjk ) {
      this.wrap(
        TYPESET.char.kana,
        charWrapper(
          option.hanzi || option.cjk,
          `<h-char class="eastasian cjk kana"></h-char>`
        )
      ).wrap(
        TYPESET.char.hanzi,
        charWrapper(
          option.hanzi || option.cjk,
        `<h-char class="eastasian cjk hanzi"></h-char>`
        )
      )
    }

    if ( option.punct ) {
      this.wrap(
        TYPESET.char.punct.all,
        charWrapper(
          option.punct,
          `<h-char class="punct"></h-char>`
        )
      )
    }

    if ( option.latin ) {
      this.wrap(
        TYPESET.char.latin,
        charWrapper(
          option.latin,
          `<h-char class="alphabet western latin"></h-char>`
        )
      )
    }

    if ( option.ellinika || option.greek ) {
      this.wrap(
        TYPESET.char.ellinika,
        charWrapper(
          option.ellinika || option.greek,
          `<h-char class="alphabet western ellinika greek"></h-char>`
        )
      )
    }

    if ( option.kirillica || option.cyrillic ) {
      this.wrap(
        TYPESET.char.kirillica,
        charWrapper(
          option.kirillica || option.cyrillic,
          `<h-char class="alphabet western kirillica cyrillic"></h-char>`
        )
      )
    }

    if ( option.kana ) {
      this.wrap(
        TYPESET.char.kana,
        charWrapper(
          option.kana,
          `<h-char class="eastasian cjk kana"></h-char>`
        )
      )
    }

    if ( option.eonmun || option.hangul ) {
      this.wrap(
        TYPESET.char.eonmun,
        charWrapper(
          option.eonmun || option.hangul,
          `<h-char class="eastasian eonmun hangul"></h-char>`
        )
      )
    }

    this.removeAvoid( CHAR_AVOID )
    return this
  },
})

Object.assign( Core, { find: Fibrio })

void [
  'mode', 'action', 'process',
  'find', 'wrap', 'replace', 'revert',
  'filter', 'end',
  'addAvoid', 'addBdry',
  'removeAvoid','removeBdry',
  'jinzify', 'groupify', 'charify',
].forEach( method => Core.fn[ method ] = function( ...arg ) {
  this.finder[ method ]( ...arg )
  return this
})

