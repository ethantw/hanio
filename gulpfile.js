
'use strict'

const gulp    = require( 'gulp' )
const util    = require( 'gulp-util' )
const concat  = require( 'gulp-concat-util' )
const server  = require( 'gulp-connect' ).server
const webpack = require( 'webpack' )
const mocha   = require( 'gulp-mocha' )

const pkg     = require( './package.json' )
const banner  = (
`/*!
 * Hanio v${pkg.version}
 * Chen Yijun (@ethantw) | MIT License
 * https://css.hanzi.co/hanio
 * https://github.com/ethantw/hanio
 */\n
` )

// Unified tasks
gulp.task( 'default', [ 'build' ])
gulp.task( 'build',   [ 'index.js', 'test' ])
gulp.task( 'dev',     [ 'default', 'server', 'watch' ])

gulp.task( 'server', () => server({ port: 3333 }))

gulp.task( 'watch', () => {
  gulp.watch( './src/**/*.js', [ 'build' ])
  gulp.watch( './test/**/*.js', [ 'test' ])
})

gulp.task( 'test', [ 'index.js' ], () => {
  return gulp.src( './test/index.js', { read: false })
  .pipe(mocha())
})

gulp.task( 'index.js', [ 'pack' ], () => {
  return gulp.src( './dist/hanio.js' )
  .pipe(concat( 'hanio.js', {
    process: src => ( banner + src )
      .replace( /IMPORT/g, 'require' )
      .replace( /@VERSION/g, pkg.version )
  }))
  .pipe(gulp.dest( './dist' ))
})

gulp.task( 'pack', callback => {
  webpack({
    entry: './src/index.js',
    output: {
      path: './dist',
      filename: 'hanio.js',
      libraryTarget: 'umd',
    },
    module: {
      loaders: [{
        test: /\.jsx?$/,
        exclude: /(node_modules)/,
        loader: 'babel'
      }]
    },
    babel: {
      loose: 'all',
    },
    devtool: '#source-map',
  }, ( error, stat ) => {
    if ( error )  throw new util.PluginError( 'webpack', error )
    util.log( '[webpack]', stat.toString())
    callback()
  })
})

