
'use strict'

import Core from './core'
import './init'

const Hanio = ( ...arg ) => new Core( ...arg )

Object.assign( Hanio, {
  fn: Core.prototype,
})

export default Hanio

