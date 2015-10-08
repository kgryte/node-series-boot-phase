'use strict';

// MODULES //

var debug = require( 'debug' )( 'series-boot-phase:main' ),
	isArray = require( 'validate.io-array' ),
	isFunction = require( 'validate.io-function' ),
	fname = require( 'utils-function-name' );


// SERIES //

/**
* FUNCTION: series( ...fcns )
*	Returns a series boot phase to be used when booting an application.
*
* @param { Function[]|...Function} fcns - functions to be executed in series
* @returns {Function} phase
*/
function series() {
	var names,
		fcns,
		tmp,
		len,
		i;

	tmp = arguments;
	if ( isArray( tmp[ 0 ] ) ) {
		tmp = tmp[ 0 ];
	}
	len = tmp.length;
	if ( !len ) {
		throw new Error( 'insufficient input arguments. Must provide input functions.' );
	}
	fcns = new Array( len );
	names = new Array( len );
	for ( i = 0; i < len; i++ ) {
		fcns[ i ] = tmp[ i ];
		if ( !isFunction( fcns[ i ] ) ) {
			throw new TypeError( 'invalid input argument. Must provide only function arguments. Value: `' + fcns[ i ] + '`.' );
		}
		names[ i ] = fname( fcns[ i ] );
	}

	/**
	* FUNCTION: phase( [...args], next )
	*	Boot phase.
	*
	* @param {*} [...args] - phase arguments
	* @param {Function} next - callback to invoke after completing the phase
	* @returns {Void}
	*/
	function phase() {
		/* jshint validthis:true */
		var clbk,
			args,
			n, i;

		n = arguments.length - 1;
		args = new Array( n );
		for ( i = 0; i < n; i++ ) {
			args[ i ] = arguments[ i ];
		}
		clbk = next( args, this, arguments[ n ] );
		args.push( clbk );
		clbk();
	} // end FUNCTION phase()

	/**
	* FUNCTION: next( args, ctx, done )
	*	Creates a series callback.
	*
	* @private
	* @param {Array} args - array containing arguments which should be passed to each series function
	* @param {*} ctx - phase context
	* @param {Function} done - callback to invoke after the phase completes
	* @returns {Function} callback
	*/
	function next( args, ctx, done ) {
		var idx = -1;
		/**
		* FUNCTION: next( [error] )
		*	Callback invoked after a phase component completes.
		*
		* @private
		* @param {Error} [error] - error object
		* @returns {Void}
		*/
		return function next( error ) {
			if ( error ) {
				debug( '`%s` (%d) series phase returned an error: %s', names[ idx ], idx, error.message );
				return done( error );
			}
			if ( idx >= 0 ) {
				debug( 'Finished series phase: `%s` (%d)', names[ idx ], idx );
			}
			idx += 1;
			if ( idx === len ) {
				debug( 'Finished all series phases.' );
				return done();
			}
			debug( 'Entering series phase: `%s` (%d)', names[ idx ], idx );
			fcns[ idx ].apply( ctx, args );
		}; // end FUNCTION next()
	} // end FUNCTION next()

	return phase;
} // end FUNCTION series()


// EXPORTS //

module.exports = series;
