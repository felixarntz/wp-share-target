/**
 * WordPress dependencies
 */
const config = require( '@wordpress/scripts/config/jest-unit.config.js' );

config.setupFilesAfterEnv = [
	...( config.setupFilesAfterEnv || [] ),
	'<rootDir>/tests/js/jest-matchers',
];

module.exports = config;
