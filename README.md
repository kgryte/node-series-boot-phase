Series Boot Phase
===
[![NPM version][npm-image]][npm-url] [![Build Status][travis-image]][travis-url] [![Coverage Status][codecov-image]][codecov-url] [![Dependencies][dependencies-image]][dependencies-url]

> Series boot phase when [booting](https://github.com/kgryte/node-app-boot) an application.


## Installation

``` bash
$ npm install series-boot-phase
```


## Usage

``` javascript
var series = require( 'series-boot-phase' );
```

#### series( ...fcns )

Creates a series [boot](https://github.com/kgryte/node-app-boot) phase based on provided input `functions`.

``` javascript
function beep( app, next ) {
	// Do something...
	next();
}
function boop( app, next ) {
	// Do something else...
	process.nextTick( next );
}

var phase = series( beep, boop );
```

A function `array` is also accepted.

``` javascript
var phase = series( [ beep, boop ] );
```


## Notes

*	The phase is considered complete when all `functions` have successfully returned.
* 	If a `function` errors or provides an `error` argument to the `next` callback, the phase aborts and causes the [boot](https://github.com/kgryte/node-app-boot) sequence to fail.


## Examples

``` javascript
var express = require( 'express' ),
	bootable = require( 'app-boot' ),
	series = require( 'series-boot-phase' );

var phase, boot, app;

// Mock connecting to a database...
function db1( app, config, locals, next ) {
	console.log( 'Connecting to database 1...' );
	setTimeout( onTimeout, 1000 );
	function onTimeout() {
		console.log( 'Connected to database 1...' );
		locals.db1 = {
			'beep': 'boop'
		};
		next();
	}
}

// Mock connecting to a different database...
function db2( app, config, locals, next ) {
	console.log( 'Connecting to database 2...' );
	setTimeout( onTimeout, 500 );
	function onTimeout() {
		console.log( 'Connected to database 2...' );
		locals.db2 = {
			'bop': 'bip'
		};
		next();
	}
}

// Callback invoked once an application boots...
function done( error ) {
	if ( error ) {
		throw error;
	}
	console.log( 'Application booted...' );
}

// Create a new application:
app = express();

// Create a boot phase:
phase = series( db1, db2 );

// Create a boot function:
boot = bootable( app, {}, {} );

// Register the phase:
boot.phase( phase );

// Boot the application:
boot( done );
```

To run the example code from the top-level application directory,

``` bash
$ DEBUG=* node ./examples/index.js
```


## See Also

-	[app-boot](https://github.com/kgryte/node-app-boot)
-	[parallel-boot-phase](https://github.com/kgryte/node-parallel-boot-phase)


## Tests

### Unit

Unit tests use the [Mocha](http://mochajs.org/) test framework with [Chai](http://chaijs.com) assertions. To run the tests, execute the following command in the top-level application directory:

``` bash
$ make test
```

All new feature development should have corresponding unit tests to validate correct functionality.


### Test Coverage

This repository uses [Istanbul](https://github.com/gotwarlost/istanbul) as its code coverage tool. To generate a test coverage report, execute the following command in the top-level application directory:

``` bash
$ make test-cov
```

Istanbul creates a `./reports/coverage` directory. To access an HTML version of the report,

``` bash
$ make view-cov
```


---
## License

[MIT license](http://opensource.org/licenses/MIT).


## Copyright

Copyright &copy; 2015. Athan Reines.


[npm-image]: http://img.shields.io/npm/v/series-boot-phase.svg
[npm-url]: https://npmjs.org/package/series-boot-phase

[travis-image]: http://img.shields.io/travis/kgryte/node-series-boot-phase/master.svg
[travis-url]: https://travis-ci.org/kgryte/node-series-boot-phase

[codecov-image]: https://img.shields.io/codecov/c/github/kgryte/node-series-boot-phase/master.svg
[codecov-url]: https://codecov.io/github/kgryte/node-series-boot-phase?branch=master

[dependencies-image]: http://img.shields.io/david/kgryte/node-series-boot-phase.svg
[dependencies-url]: https://david-dm.org/kgryte/node-series-boot-phase

[dev-dependencies-image]: http://img.shields.io/david/dev/kgryte/node-series-boot-phase.svg
[dev-dependencies-url]: https://david-dm.org/dev/kgryte/node-series-boot-phase

[github-issues-image]: http://img.shields.io/github/issues/kgryte/node-series-boot-phase.svg
[github-issues-url]: https://github.com/kgryte/node-series-boot-phase/issues
