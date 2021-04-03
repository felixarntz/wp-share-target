<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests\Service_Worker_Tests
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests;

use Felix_Arntz\WP_Share_Target\Context;
use Felix_Arntz\WP_Share_Target\Service_Worker;
use Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Includes\Test_Case;
use WP_Service_Worker_Scripts;

/**
 * Class containing tests for the Service_Worker class.
 */
class Service_Worker_Tests extends Test_Case {

	private $service_worker;

	public function setUp() {
		parent::setUp();

		$this->service_worker = new Service_Worker(
			new Context( TESTS_PLUGIN_DIR . '/share-target.php' ),
			'src/sw.js'
		);
	}

	public function test_register() {
		remove_all_actions( 'wp_admin_service_worker' );

		$this->service_worker->register();
		$this->assertTrue( has_action( 'wp_admin_service_worker' ) );
	}

	public function test_register_service_worker_scripts() {
		// Instantiate dummy class as replacement for the PWA plugin class.
		$scripts = new WP_Service_Worker_Scripts();
		$this->service_worker->register_service_worker_scripts( $scripts );
		$this->assertTrue( isset( $scripts->scripts['share-target-sw']['src'] ) );
		$this->assertTrue( is_callable( $scripts->scripts['share-target-sw']['src'] ) );

		// Check output replacements: Comment about globals should be removed and globals should be replaced.
		$output = $scripts->scripts['share-target-sw']['src']();
		$this->assertFalse( strpos( $output, '/* global SHARE_URL, SHARE_REDIRECT_URL */' ) );
		$this->assertTrue( ! ! strpos( $output, "'http://example.org/wp-admin/share/'" ) );
		$this->assertTrue( ! ! strpos( $output, "'http://example.org/wp-admin/post-new.php'" ) );
	}
}
