
export default function( target='ruby' ) {
  const $target = this.context.find( target )
  let i = $target.length

  traverse: while ( i-- ) {
    const $this = $target[ i ]

    let $new = $this::hasClass( 'complex' )
      ? renderComplexRuby( $this )
      : $this::hasClass( 'zhuyin' )
      ? renderInterCharRuby( $this )
      : null

    if ( $new ) {
      $this.replaceWith( $new )
    }
  }
  return this
}
