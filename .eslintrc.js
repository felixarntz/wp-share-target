/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/.eslintrc.js' );

config.globals = {
	...( config.globals || {} ),
	navigator: 'readonly',
	Response: 'readonly',
	self: 'readonly',
};

module.exports = config;
