<?php
/**
 * Class Felix_Arntz\WP_Image_Sharer\Editor
 *
 * @package Felix_Arntz\WP_Image_Sharer
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/image-sharer/
 */

namespace Felix_Arntz\WP_Image_Sharer;

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
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Context $context The plugin context.
	 */
	public function __construct( Context $context ) {
		$this->context = $context;
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

		$script_data = require $this->context->path( 'build/index.asset.php' );

		wp_enqueue_script(
			'image-sharer',
			$this->context->url( 'build/index.js' ),
			$script_data['dependencies'],
			$script_data['version'],
			true
		);
		wp_set_script_translations( 'image-sharer', 'image-sharer' );
	}
}
