<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests\Plugin_Tests
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests;

use Felix_Arntz\WP_Share_Target\Plugin;
use Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Includes\Test_Case;

/**
 * Class containing tests for the Plugin class.
 */
class Plugin_Tests extends Test_Case {

	private $plugin;

	public function setUp() {
		parent::setUp();

		$this->plugin = new Plugin( TESTS_PLUGIN_DIR . '/share-target.php' );
	}

	public function test_register() {
		remove_all_filters( 'web_app_manifest' );
		remove_all_actions( 'wp_admin_service_worker' );
		remove_all_actions( 'enqueue_block_editor_assets' );
		remove_all_actions( 'admin_notices' );

		// This should trigger the notice about the missing PWA plugin, since the plugin is not active during tests.
		$this->plugin->register();
		$this->assertTrue( has_action( 'admin_notices' ) );
		// In that case, the other actions should not be added.
		$this->assertFalse( has_filter( 'web_app_manifest' ) );
		$this->assertFalse( has_action( 'wp_admin_service_worker' ) );
		$this->assertFalse( has_action( 'enqueue_block_editor_assets' ) );

		// Run tests for the one other method since it only works if the PWA plugin is missing.
		$this->run_admin_notices_display_pwa_plugin_missing_notice_tests();

		// This is in principle a problematic side effect, but since the plugin does not rely on it elsewhere, it's ok.
		define( 'PWA_VERSION', '0.6.0' );
		$this->plugin->register();
		// Now the other actions should be added.
		$this->assertTrue( has_filter( 'web_app_manifest' ) );
		$this->assertTrue( has_action( 'wp_admin_service_worker' ) );
		$this->assertTrue( has_action( 'enqueue_block_editor_assets' ) );
	}

	protected function run_admin_notices_display_pwa_plugin_missing_notice_tests() {
		// This is called from the `test_register()` method since it can no longer be tested after setting the PWA constant.
		// First, test for non-admin user.
		ob_start();
		do_action( 'admin_notices' );
		$output = ob_get_clean();
		$this->assertSame( 1, preg_match( '/href="([^"]+)"/', $output, $matches ) );
		$this->assertSame( 'https://wordpress.org/plugins/pwa/', $matches[1] );

		// Then, test for admin user.
		wp_set_current_user( $this->create_administrator_user() );
		ob_start();
		do_action( 'admin_notices' );
		$output = ob_get_clean();
		$this->assertSame( 1, preg_match( '/href="([^"]+)"/', $output, $matches ) );
		$this->assertSame( 'http://example.org/wp-admin/plugin-install.php?s=pwa&amp;tab=search&amp;type=term', $matches[1] );
	}

	protected function create_administrator_user() {
		$user_id = $this->factory()->user->create( array( 'role' => 'administrator' ) );
		if ( is_multisite() ) {
			grant_super_admin( $user_id );
		}
		return $user_id;
	}
}
