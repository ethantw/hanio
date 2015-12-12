
'use strict'

const gulp    = require( 'gulp' )
const util    = require( 'gulp-util' )
const concat  = require( 'gulp-concat-util' )
const server  = require( 'gulp-connect' ).server
const webpack = require( 'webpack' )

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
gulp.task( 'build',   [ 'index.js' ])
gulp.task( 'dev',     [ 'default', 'server', 'watch' ])

gulp.task( 'server', function() {
  server({ port: 3333 })
})

gulp.task( 'watch', function() {
  gulp.watch( './src/**/*.js', [ 'index.js' ])
})

gulp.task( 'index.js', [ 'pack' ], function() {
  gulp.src( './dist/hanio.js' )
  .pipe(concat( 'hanio.js', {
    process: function( src ) {
      return (
        banner + src
        .replace( /IMPORT/g, 'require' )
        .replace( /@VERSION/g, pkg.version )
      )
    }
  }))
  .pipe(gulp.dest( './dist' ))
})

gulp.task( 'pack', function( callback ) {
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
  }, function( error, stat ) {
    if ( error )  throw new util.PluginError( 'webpack', error )
    util.log( '[webpack]', stat.toString())
    callback()
  })
})

