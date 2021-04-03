<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests\Web_App_Manifest_Tests
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests;

use Felix_Arntz\WP_Share_Target\Context;
use Felix_Arntz\WP_Share_Target\Web_App_Manifest;
use Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Includes\Test_Case;

/**
 * Class containing tests for the Web_App_Manifest class.
 */
class Web_App_Manifest_Tests extends Test_Case {

	private $web_app_manifest;

	public function setUp() {
		parent::setUp();

		$this->web_app_manifest = new Web_App_Manifest(
			new Context( TESTS_PLUGIN_DIR . '/share-target.php' )
		);
	}

	public function test_register() {
		remove_all_filters( 'web_app_manifest' );

		$this->web_app_manifest->register();
		$this->assertTrue( has_filter( 'web_app_manifest' ) );
	}

	public function test_modify_manifest() {
		$config = $this->web_app_manifest->modify_manifest( array() );
		$this->assertTrue( isset( $config['share_target'] ) );

		// Tests more specific configuration.
		$share_target = $config['share_target'];
		$this->assertTrue(
			isset(
				$share_target['action'],
				$share_target['method'],
				$share_target['enctype'],
				$share_target['params']
			)
		);
		$this->assertSame( 'http://example.org/wp-admin/share/', $share_target['action'] );
	}
}
