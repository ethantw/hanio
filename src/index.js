
'use strict'

import $    from 'cheerio'
import Core from './core'
import './init'
import { UNICODE, TYPESET } from './regex'

const Hanio = ( ...arg ) => new Core( ...arg )
const html  = node => $.html( node ).replace( /<\/?fibrio\-text>/gi, '' )

Object.assign( Hanio, {
  fn: Core.prototype,
  html,
  UNICODE,
  TYPESET,
})

export default Hanio

