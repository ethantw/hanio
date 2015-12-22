
'use strict'

import Core from './core'
import './init'
import { UNICODE, TYPESET } from './regex'

const $     = IMPORT( 'cheerio' )
const Hanio = ( ...arg ) => new Core( ...arg )
const html  = node => $.html( node ).replace( /<\/?fibrio\-text>/gi, '' )

Object.assign( Hanio, {
  fn: Core.prototype,
  html,
  UNICODE,
  TYPESET,
})

export default Hanio

