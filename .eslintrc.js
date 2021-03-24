/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/.eslintrc.js' );

module.exports = {
	...config,
	globals: {
		navigator: 'readonly',
		Response: 'readonly',
		self: 'readonly',
	},
};
