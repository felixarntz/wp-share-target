<?php
/**
 * Integration tests bootstrap script.
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

// Detect project directory.
define( 'TESTS_PLUGIN_DIR', dirname( dirname( dirname( __DIR__ ) ) ) );

require_once TESTS_PLUGIN_DIR . '/vendor/autoload.php';

if ( false !== getenv( 'WP_PLUGIN_DIR' ) ) {
	define( 'WP_PLUGIN_DIR', getenv( 'WP_PLUGIN_DIR' ) );
} else {
	define( 'WP_PLUGIN_DIR', dirname( TESTS_PLUGIN_DIR ) );
}

// Detect where to load the WordPress tests environment from.
if ( false !== getenv( 'WP_TESTS_DIR' ) ) {
	$_test_root = getenv( 'WP_TESTS_DIR' );
} elseif ( false !== getenv( 'WP_DEVELOP_DIR' ) ) {
	$_test_root = getenv( 'WP_DEVELOP_DIR' ) . '/tests/phpunit';
} elseif ( file_exists( '/tmp/wordpress-tests-lib/includes/bootstrap.php' ) ) {
	$_test_root = '/tmp/wordpress-tests-lib';
} else {
	if ( ! getenv( 'WP_PHPUNIT__DIR' ) ) {
		printf( '%s is not defined. Run `composer install` to install the WordPress tests library.' . "\n", 'WP_PHPUNIT__DIR' );
		exit;
	}

	$_test_root = getenv( 'WP_PHPUNIT__DIR' );

	// phpcs:ignore WordPress.PHP.DiscouragedPHPFunctions.runtime_configuration_putenv
	putenv( sprintf( 'WP_PHPUNIT__TESTS_CONFIG=%s', __DIR__ . '/wp-tests-config.php' ) );
}

// Ensure the plugin is loaded.
$GLOBALS['wp_tests_options'] = array(
	'active_plugins' => array( basename( TESTS_PLUGIN_DIR ) . '/share-target.php' ),
);

// Load the WordPress tests environment.
require_once $_test_root . '/includes/bootstrap.php';
