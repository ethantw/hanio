
'use strict'

import * as REGEX from './regex'
import $    from 'cheerio'
import Core from './core'
import './init'

const Hanio = ( ...arg ) => new Core( ...arg )

const assignee = {
  core: Core,
  fn:   Core.fn,
  html: node => $.html( node ).replace( /<\/?fibrio\-(root|text)>/gi, '' ),
}

Object.assign( Hanio, REGEX, assignee )
export default Hanio

