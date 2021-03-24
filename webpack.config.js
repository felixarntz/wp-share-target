/**
 * External dependencies
 */
const CopyPlugin = require( 'copy-webpack-plugin' );

/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/webpack.config.js' );

if ( ! config.plugins ) {
	config.plugins = [];
}

config.plugins.push(
	new CopyPlugin( [
		{
			from: 'src/sw.js',
		},
	] )
);

module.exports = config;
