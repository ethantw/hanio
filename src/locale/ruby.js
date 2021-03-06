
import $ from 'cheerio'
import { prev, rm } from '../fn/dom'
import { TYPESET }  from '../regex'

/**
 * Transform a basic HTML5-syntax ruby into
 * a CSS-renderable custom `<h-ruby>`.
 */
export const renderSimpleRuby = $ruby => {
  $ruby = $( $ruby ).clone()

  const partition = new Set(Array.from($ruby.find( 'h-ru, rb, rt' )))
  const $$rt      = $ruby.find( 'rt' )
  let i = $$rt.length

  traverse: while ( i-- ) {
    const $rt = $$rt.eq( i )
    let $$rb = []
    let $rb

    // Consider the previous node(s) the implied
    // ruby base and collect them together with
    // the `<rt>` to form a ruby unit.
    collector: do {
      $rb = ( $rb || $rt )::prev()

      if ( !$rb || partition.has( $rb )) {
        break collector
      }

      $$rb.unshift( $rb )
    } while ( !partition.has( $rb ))

    let $ru = $ruby.hasClass( 'zhuyin' )
      ? createZhuyinRu( $$rb, $rt )
      : createNormalRu( $$rb, $rt )

    // Replace the `<rt>` with the new generated
    // `<h-ru>` and remove the implied ruby base.
    $rt.replaceWith( $ru )
    $$rb.map( $rb => $rb::rm())
  }
  return createCustomRuby( $ruby )
}

/**
 * Transform a complex HTML5-syntax ruby into
 * a CSS-renderable custom `<h-ruby>`.
 */
export const renderComplexRuby = $ruby => {
  $ruby = $( $ruby ).clone()

  const $$rtc = $ruby.find( 'rtc' )
  let $$rb    = $ruby.find( 'rb' )
  let $$ru    = Array.from( $$rb )
  let maxspan = $$rb.length
  let $zhuyin

  Array.from( $$rtc ).map( simplifyRubyClass )
  $zhuyin = $$rtc.filter( '.zhuyin' ).first()

  // Deal with Zhuyin `<rtc>` container individually.
  //
  // **Note that** only one Zhuyin container are
  // supported in each complex ruby.
  if ( $zhuyin.length ) {
    $$ru = Array.from($zhuyin.find( 'rt' ))
    .map(( $rt, i ) => {
      const $rb  = $$rb[ i ]
      if ( !$rb )  return

      const $ret = createZhuyinRu( $rb, $rt )
      $( $rb ).replaceWith( $ret )
      return $ret
    })

    $zhuyin.remove()
    $ruby.attr( 'rightangle', 'true' )
  }

  // Other `<rtc>`:
  $$rtc
  .each(( order, $rtc ) => {
    $rtc = $( $rtc )
    if ( $rtc.hasClass( 'zhuyin' ))  return

    $$ru = $rtc
      .find( 'rt' )
      .map(( i, $rt ) => {
        $rt = $( $rt )
        let rbspan = Number( $rt.attr( 'rbspan' ) || 1 )
        let span   = 0
        let $$rb   = []
        let $rb

        if ( rbspan > maxspan )  rbspan = maxspan

        collector: do {
          try {
            $rb = $$ru.shift()
            $$rb.push( $rb )
          } catch (e) {}

          if ( !$rb )  break collector
          span += Number( $( $rb ).attr( 'span' ) || 1 )
        } while ( rbspan > span )

        if ( rbspan < span ) {
          if ( $$rb.length > 1 ) {
            console.error( 'An impossible `rbspan` value detected.', $rt )
            return
          }
          $$rb = $( $$rb[0] ).find( 'rb' ).get()
          $$ru = $$rb.slice( rbspan ).concat( $$ru )
          $$rb = $$rb.slice( 0, rbspan )
          span = rbspan
        }

        let $ret = createNormalRu( $$rb, $rt, {
          'class': $ruby.attr( 'class' ),
          span,
          order,
        })

        $( $$rb.shift() ).replaceWith( $ret )
        $$rb.map( $rb => $rb::rm())
        return $ret
      })
      .toArray()

    if  ( order === 1 ) {
      $ruby.attr( 'doubleline', 'true' )
    }
    $rtc::rm()
  })
  return createCustomRuby( $ruby )
}

/**
 * Return a custom `<h-ruby>` element to
 * avoid default UA styles.
 */
export const createCustomRuby = $ruby => {
  let html = $.html( $ruby )
    .replace( /^<ruby[\s\f\n\r\t]*/i, '<h-ruby ' )
    .replace( /<\/ruby>$/i, '</h-ruby>' )
  return $( html )
}

/**
 * Merge and simplify class aliases.
 */
export const simplifyRubyClass = $target => {
  $target = $( $target )

  if ( $target.hasClass( 'pinyin' )) {
    $target.addClass( 'romanization annotation' )
  } else if ( $target.hasClass( 'romanization' )) {
    $target.addClass( 'annotation' )
  } else if ( $target.hasClass( 'mps' )) {
    $target.addClass( 'zhuyin' )
  } else if ( $target.hasClass( 'rightangle' )) {
    $target.addClass( 'complex' )
  }
  return $target
}

/**
 * Return a new `<h-ru>` element with the given
 * contents.
 */
export const createNormalRu = ( $$rb, $rt, attr={} ) => {
  let $ru = $( '<h-ru/>' )
  $$rb = Array.from( $$rb )
  $rt = $( $rt ).clone()
  attr.annotation = true

  if ( Array.isArray( $$rb )) {
    $ru.html(
      $$rb.map( $rb => {
        if ( !$rb )  return ''
        return $.html( $rb )
      }).join( '' ) + $.html( $rt )
    )
  } else {
    $ru
    .append( $$rb.clone())
    .append( $rt )
  }
  return $ru.attr( attr )
}

/**
 * Return a new `<h-ru>` element with the given
 * contents in Zhuyin form.
 */
export const createZhuyinRu = ( $$rb, $rt ) => {
  // - <h-ru zhuyin>
  // -   <rb><rb/>
  // -   <h-zhuyin>
  // -     <h-yin></h-yin>
  // -     <h-diao></h-diao>
  // -   </h-zhuyin>
  // - </h-ru>
  const html = (
    `<h-ru zhuyin="true">${
      $.html( $$rb ) +
      getZhuyinHTML( $rt )
    }</h-ru>`
  )
  return $( html )
}

export const getZhuyinHTML = $rt => {
  let zhuyin, yin, diao, len

  zhuyin = typeof $rt === 'string'
    ? $rt
    : $( $rt ).text()

  yin  = zhuyin.replace( TYPESET.zhuyin.diao, '' )
  len  = yin ? yin.length : 0
  diao = zhuyin
    .replace( yin, '' )
    .replace( /\u02C5/g, '\u02C7' )
    .replace( /\u030D/g, '\u0358' )

  return `<h-zhuyin length="${len}" diao="${diao}"><h-yin>${yin}</h-yin><h-diao>${diao}</h-diao></h-zhuyin>`
}

export const renderRuby = function( target='ruby' ) {
  const $$target = this.context.find( target )
  let i = $$target.length

  traverse: while ( i-- ) {
    const $this = simplifyRubyClass($$target.eq( i ))

    try {
      $this.replaceWith( $this.hasClass( 'complex' )
        ? renderComplexRuby( $this )
        :  renderSimpleRuby( $this )
      )
    } catch (e) {}
  }
  return this
}

