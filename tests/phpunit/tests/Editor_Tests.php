<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests\Editor_Tests
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests;

use Felix_Arntz\WP_Share_Target\Context;
use Felix_Arntz\WP_Share_Target\Editor;
use Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Includes\Test_Case;

/**
 * Class containing tests for the Editor class.
 */
class Editor_Tests extends Test_Case {

	private $editor;

	public function setUp() {
		parent::setUp();

		$this->editor = new Editor(
			new Context( TESTS_PLUGIN_DIR . '/share-target.php' ),
			array(
				'dependencies' => array( 'wp-data' ),
				'version'      => '1.0.0',
			)
		);
	}

	public function test_register() {
		remove_all_actions( 'enqueue_block_editor_assets' );

		$this->editor->register();
		$this->assertTrue( has_action( 'enqueue_block_editor_assets' ) );
	}

	public function test_enqueue_share_handler_script() {
		global $hook_suffix;

		// Tests that the script should not be enqueued on any screen other than `post-new.php`.
		$hook_suffix = 'post.php';
		$this->editor->enqueue_share_handler_script();
		$this->assertFalse( wp_script_is( 'share-target', 'enqueued' ) );

		// Tests that the script gets enqueued on `post-new.php`.
		$hook_suffix = 'post-new.php';
		$this->editor->enqueue_share_handler_script();
		$this->assertTrue( wp_script_is( 'share-target', 'enqueued' ) );
		$script = wp_scripts()->registered['share-target'];
		// `wp-i18n` is required automatically due to script translations being set.
		$this->assertSame( array( 'wp-data', 'wp-i18n' ), $script->deps );
		$this->assertSame( '1.0.0', $script->ver );
	}
}
