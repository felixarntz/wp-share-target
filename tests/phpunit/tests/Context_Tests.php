<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests\Context_Tests
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests;

use Felix_Arntz\WP_Share_Target\Context;
use Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Includes\Test_Case;

/**
 * Class containing tests for the Context class.
 */
class Context_Tests extends Test_Case {

	private $context;

	public function setUp() {
		parent::setUp();

		$this->context = new Context( TESTS_PLUGIN_DIR . '/share-target.php' );
	}

	public function test_path() {
		// Tests the default.
		$this->assertSame( TESTS_PLUGIN_DIR . '/', $this->context->path() );
		// Tests without passing a slash.
		$this->assertSame( TESTS_PLUGIN_DIR . '/build/index.asset.php', $this->context->path( 'build/index.asset.php' ) );
		// Tests with passing a slash.
		$this->assertSame( TESTS_PLUGIN_DIR . '/build/index.asset.php', $this->context->path( '/build/index.asset.php' ) );
	}

	public function test_url() {
		$plugin_dir_url = 'http://example.org/wp-content/plugins/' . basename( TESTS_PLUGIN_DIR );

		// Tests the default.
		$this->assertSame( $plugin_dir_url . '/', $this->context->url() );
		// Tests without passing a slash.
		$this->assertSame( $plugin_dir_url . '/build/index.asset.php', $this->context->url( 'build/index.asset.php' ) );
		// Tests with passing a slash.
		$this->assertSame( $plugin_dir_url . '/build/index.asset.php', $this->context->url( '/build/index.asset.php' ) );
	}

	public function test_share_url() {
		$this->assertSame( 'http://example.org/wp-admin/share/', $this->context->share_url() );
	}
}
