/* global require, describe, it */
'use strict';

// MODULES //

var chai = require( 'chai' ),
	noop = require( '@kgryte/noop' ),
	series = require( './../lib' );


// VARIABLES //

var expect = chai.expect,
	assert = chai.assert;


// TESTS //

describe( 'series-boot-phase', function tests() {

	it( 'should export a function', function test() {
		expect( series ).to.be.a( 'function' );
	});

	it( 'should throw an error if not provided input functions', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			series();
		}
	});

	it( 'should throw an error if provided an empty array', function test() {
		expect( foo ).to.throw( Error );
		function foo() {
			series( [] );
		}
	});

	it( 'should throw an error if any input argument is not a function', function test() {
		var values,
			i;

		values = [
			'5',
			5,
			NaN,
			null,
			undefined,
			// [], // allowed as long as contains functions
			{}
		];

		for ( i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function badValue() {
				series( noop, value );
			};
		}
	});

	it( 'should throw an error if an input array element is not a function', function test() {
		var values,
			i;

		values = [
			'5',
			5,
			NaN,
			null,
			undefined,
			[],
			{}
		];

		for ( i = 0; i < values.length; i++ ) {
			expect( badValue( values[ i ] ) ).to.throw( TypeError );
		}
		function badValue( value ) {
			return function badValue() {
				series( [ noop, value ] );
			};
		}
	});

	it( 'should return a function', function test() {
		assert.isFunction( series( noop, noop ) );
	});

	it( 'should complete only when all provided functions complete', function test( done ) {
		var phase = series( foo, bar, bap );
		phase( clbk );
		function foo( next ) {
			setTimeout( onTimeout, 50 );
			function onTimeout() {
				next();
			}
		}
		function bar( next ) {
			setTimeout( onTimeout, 100 );
			function onTimeout() {
				next();
			}
		}
		function bap( next ) {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				next();
			}
		}
		function clbk( error ) {
			if ( error ) {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should complete only when all provided functions complete (input array)', function test( done ) {
		var phase = series( [ foo, bar, bap ] );
		phase( clbk );
		function foo( next ) {
			setTimeout( onTimeout, 50 );
			function onTimeout() {
				next();
			}
		}
		function bar( next ) {
			setTimeout( onTimeout, 100 );
			function onTimeout() {
				next();
			}
		}
		function bap( next ) {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				next();
			}
		}
		function clbk( error ) {
			if ( error ) {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should return an error if one of the input functions returns an error', function test( done ) {
		var phase = series( foo, bar, bap );
		phase( clbk );
		function foo( next ) {
			setTimeout( onTimeout, 50 );
			function onTimeout() {
				next( new Error( 'beep' ) );
			}
		}
		function bar( next ) {
			setTimeout( onTimeout, 100 );
			function onTimeout() {
				next();
			}
		}
		function bap( next ) {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				next();
			}
		}
		function clbk( error ) {
			if ( error ) {
				assert.strictEqual( error.message, 'beep' );
			} else {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should throw if one of the provided functions throws', function test() {
		var phase = series( foo, bar, bap );
		expect( shouldThrow ).to.throw( Error );

		function shouldThrow() {
			phase( clbk );
		}
		function foo() {
			throw new Error( 'beep' );
		}
		function bar( next ) {
			setTimeout( onTimeout, 100 );
			function onTimeout() {
				next();
			}
		}
		function bap( next ) {
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				next();
			}
		}
		function clbk() {
			assert.ok( false );
		}
	});

	it( 'should support multiple boot phase arguments', function test( done ) {
		var phase = series( foo, bar, bap );
		phase( noop, noop, clbk );
		function foo( f1, f2, next ) {
			assert.strictEqual( f1, noop );
			assert.strictEqual( f2, noop );
			setTimeout( onTimeout, 50 );
			function onTimeout() {
				next();
			}
		}
		function bar( f1, f2, next ) {
			assert.strictEqual( f1, noop );
			assert.strictEqual( f2, noop );
			setTimeout( onTimeout, 100 );
			function onTimeout() {
				next();
			}
		}
		function bap( f1, f2, next ) {
			assert.strictEqual( f1, noop );
			assert.strictEqual( f2, noop );
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				next();
			}
		}
		function clbk( error ) {
			if ( error ) {
				assert.ok( false );
			}
			done();
		}
	});

	it( 'should apply a phase\'s this context', function test( done ) {
		var phase,
			ctx;

		phase = series( foo, bar, bap );
		ctx = {};
		phase.call( ctx, clbk );
		function foo( next ) {
			/* jshint validthis: true */
			assert.strictEqual( this, ctx );
			setTimeout( onTimeout, 50 );
			function onTimeout() {
				next();
			}
		}
		function bar( next ) {
			/* jshint validthis: true */
			assert.strictEqual( this, ctx );
			setTimeout( onTimeout, 100 );
			function onTimeout() {
				next();
			}
		}
		function bap( next ) {
			/* jshint validthis: true */
			assert.strictEqual( this, ctx );
			setTimeout( onTimeout, 0 );
			function onTimeout() {
				next();
			}
		}
		function clbk( error ) {
			if ( error ) {
				assert.ok( false );
			}
			done();
		}
	});

});
