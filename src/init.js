
import Core       from './core'
import Locale     from './locale'
import Typeset    from './typeset'
import Typography from './typography'

import './find'
import './routine'

Object.assign( Core.fn, Locale.fn, Typeset.fn, Typography.fn )

