
import Core       from './core'
import { create } from './fn/dom'
import { UNICODE, TYPESET } from './regex.js'

const Fibrio = Core.find = IMPORT( 'fibrio' )

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
        : 'is-inner isInner'
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

const JINZE_AVOID = 'h-jinze'
const GROUP_AVOID = 'h-hangable, h-char-group, h-word'
const CHAR_AVOID  = 'h-char'

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

    return this
  },

  groupify( option={} ) {
    const { all, eastasian, hanzi } = option

    option = Object.assign({
      biaodian: all,
    //punct:    all,
      hanzi:    all || eastasian, // Include Kana
      kana:     all || eastasian || hanzi,
      eonmum:   all || eastasian,
      western:  all, // Include Latin, Greek and Cyrillic alphabet
    }, option )

    this
    .addAvoid( GROUP_AVOID )

    if ( option.biaodian ) {
      this.replace(
        TYPESET.group.biaodian[0], createBdGroup
      ).replace(
        TYPESET.group.biaodian[1], createBdGroup
      )
    }

    if ( option.hanzi || option.cjk ) {
      this.wrap(
        TYPESET.group.hanzi,
        `<h-char-group class="hanzi cjk"></h-char-group>`
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
        `<h-char-group class="cjk kana"></h-char-group>`
      )
    }

    if ( option.eonmum || option.hangul ) {
      this.wrap(
        TYPESET.group.eonmum,
        `<h-word class="eonmum hangul"></h-word>`
      )
    }

    this.removeAvoid( GROUP_AVOID )
    return this
  },

  charify( option={} ) {
    const { all, eastasian, western, hanzi } = option

    option = Object.assign({
      biaodian:  all,
      punct:     all,
      hanzi:     all || eastasian, // Include Kana
      kana:      all || eastasian || hanzi,
      eonmum:    all || eastasian,
      western:   all || eastasian, // Include Latin, Greek and Cyrillic alphabet
      latin:     all || western,
      ellinika:  all || western,
      kirillica: all || western,
    }, option )

    this.addAvoid( CHAR_AVOID )

    if ( option.biaodian ) {
      this.replace(
        TYPESET.char.biaodian.all,
        portion => createBdChar( portion.text )
      ).replace(
        TYPESET.char.biaodian.liga,
        portion => createBdChar( portion.text )
      )
    }

    if ( option.hanzi || option.cjk ) {
      this.wrap(
        //// TODO: add kana class.
        TYPESET.char.hanzi,
        `<h-char class="hanzi cjk"></h-char>`
      )
    }

    if ( option.punct ) {
      this.wrap(
        TYPESET.char.punct.all,
        `<h-char class="punct"></h-char>`
      )
    }

    if ( option.latin ) {
      this.wrap(
        TYPESET.char.latin,
        `<h-char class="alphabet western latin"></h-char>`
      )
    }

    if ( option.ellinika || option.greek ) {
      this.wrap(
        TYPESET.char.ellinika,
        `<h-char class="alphabet western ellinika greek"></h-char>`
      )
    }

    if ( option.kirillica || option.cyrillic ) {
      this.wrap(
        TYPESET.char.kirillica,
        `<h-char class="alphabet western kirillica cyrillic"></h-char>`
      )
    }

    if ( option.kana ) {
      this.wrap(
        TYPESET.char.kana,
        `<h-char class="cjk kana"></h-char>`
      )
    }

    if ( option.eonmum || option.hangul ) {
      this.wrap(
        TYPESET.char.eonmum,
        `<h-char class="cjk eonmum hangul"></h-char>`
      )
    }

    this.removeAvoid( CHAR_AVOID )
    return this
  },
})

void [
  'mode', 'action', 'process',
  'find', 'wrap', 'replace', 'revert',
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

