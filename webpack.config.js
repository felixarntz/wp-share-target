/**
 * External dependencies
 */
const path = require( 'path' );

/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/webpack.config.js' );

// Extra entry point for service worker script.
config.entry.sw = path.resolve( process.cwd(), 'src', 'sw.js' );

module.exports = config;
