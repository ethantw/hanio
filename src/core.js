
import $    from 'cheerio'
import root from './fn/root'

class Core {
  /**
   * @constructor
   * Create a new Hanio instance with an HTML
   * string and optional CSS selector(s) to
   * get context and condition elements.
   *
   * @param {String} [contextSelector='body']
   *   CSS selector(s) to get elements for Hanio
   *   to apply and render effects.
   * @param {String} [condSelector='html']
   *   CSS selector(s) to get elements to add
   *   conditional classes with.
   * @param {String}
   *   An HTML string to be initialised.
   * @return {Hanio}
   *   The instance itself.
   */
  constructor( ...arg ) {
    const ohtml    = arg.pop()
    const contextSelector = arg[0] || 'body'
    const condSelector    = arg[1] || 'html'

    Object.assign( this, {
      contextSelector,
      condSelector,
      ohtml,
    })

    this.initDOMWithHTML( ohtml )
  }

  initDOMWithHTML( html ) {
    const $root    = root( html )
    const $context = $root.find( this.contextSelector )
    const $cond    = $root.find( this.condSelector ) || $root

    $cond.addClass( 'han-js-rendered' )

    Object.assign( this, {
      // Initialise the text finder/processor (Fibrio):
      finder:  Core.find( '' ),

      root:    $root,
      context: $context.length
        ? $context
        : $root,
    })

    this.finder.context = this.context
    return this
  }

  /**
   * Return the current HTML string of the
   * root element.
   */
  get html() {
    return this.root
      .html()
      .replace( /<\/?(?:hanio|fibrio)\-(fake|text)>/gi, '' )
  }

  /**
   * Set rendering routine to the instance.
   *
   * @param [Array]
   *   Names of each method with optional
   *   arguments sorted by the invoking
   *   order.
   */
  setRoutine( routine ) {
    if ( Array.isArray( routine )) {
      this.routine = routine
    }
    return this
  }

  /**
   * Process the preset routine.
   *
   * @param {Array} [routine=this.routine]
   *   Process with a routine.
   * @param {Boolean} [returnHTML=false]
   *   Indicate whether to return the processed
   *   HTML string or the instance itself.
   * @return {Hanio|HTMLString}
   */
  render( ...arg ) {
    const returnHTML = typeof arg[ arg.length - 1 ] === 'boolean'
      ? arg.pop()
      : false
    const routine = ( arg[0] && Array.isArray( arg[0] ))
      ? arg[0]
      : this.routine

    routine
    .forEach( method => {
      try {
        if ( typeof method === 'string' ) {
          this[ method ]()
        } else if (
          Array.isArray( method ) &&
          typeof method[0] === 'string'
        ) {
          this[ method.shift() ]( ...method )
        }
      } catch ( e ) {}
    })
    return returnHTML === true
      ? this.html
      : this
  }
}

// Prototype alias:
Core.fn = Core.prototype

export default Core

