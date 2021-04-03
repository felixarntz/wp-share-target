<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Editor
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target;

/**
 * Class integrating with the editor.
 *
 * @since 1.0.0
 */
class Editor implements Registerable {

	/**
	 * Context instance for the plugin.
	 *
	 * @since 1.0.0
	 * @var Context
	 */
	protected $context;

	/**
	 * Dependencies and version data for the editor script.
	 *
	 * @since 1.0.0
	 * @var array
	 */
	protected $script_data;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Context $context     The plugin context.
	 * @param array   $script_data Optional. Dependencies and version data for the editor script. If not provided, it
	 *                             will try to read the built asset PHP file.
	 */
	public function __construct( Context $context, array $script_data = array() ) {
		$this->context     = $context;
		$this->script_data = $script_data;
	}

	/**
	 * Registers the class's functionality, e.g. via WordPress hooks.
	 *
	 * @since 1.0.0
	 */
	public function register() {
		add_action( 'enqueue_block_editor_assets', array( $this, 'enqueue_share_handler_script' ) );
	}

	/**
	 * Registers the editor script that handles incoming shares via postMessage.
	 *
	 * @since 1.0.0
	 */
	public function enqueue_share_handler_script() {
		global $hook_suffix;

		// Only enqueue if this is for a new post.
		if ( 'post-new.php' !== $hook_suffix ) {
			return;
		}

		if ( ! $this->script_data ) {
			$this->script_data = require $this->context->path( 'build/index.asset.php' );
		}

		wp_enqueue_script(
			'share-target',
			$this->context->url( 'build/index.js' ),
			$this->script_data['dependencies'],
			$this->script_data['version'],
			true
		);
		wp_set_script_translations( 'share-target', 'share-target' );
	}
}
