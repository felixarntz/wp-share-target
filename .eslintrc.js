/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/.eslintrc.js' );

config.globals = {
	...( config.globals || {} ),
	navigator: 'readonly',
	self: 'readonly',
};

module.exports = config;
