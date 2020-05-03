<?php
/**
 * Class Felix_Arntz\WP_Image_Sharer\Service_Worker
 *
 * @package Felix_Arntz\WP_Image_Sharer
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/image-sharer/
 */

namespace Felix_Arntz\WP_Image_Sharer;

use WP_Service_Worker_Scripts;

/**
 * Class integrating with the admin service worker.
 *
 * @since 1.0.0
 */
class Service_Worker implements Registerable {

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
		add_action( 'wp_admin_service_worker', array( $this, 'register_service_worker_scripts' ) );
	}

	/**
	 * Registers the service worker script that handles incoming share requests.
	 *
	 * @since 1.0.0
	 *
	 * @param WP_Service_Worker_Scripts $scripts Service worker scripts registry.
	 */
	public function register_service_worker_scripts( WP_Service_Worker_Scripts $scripts ) {
		$scripts->register(
			'image-sharer-sw',
			array(
				'src' => function() {
					$replacements = array(
						'SHARE_URL'          => $this->context->share_url(),
						'SHARE_REDIRECT_URL' => admin_url( 'post-new.php' ),
					);

					$script = file_get_contents( $this->context->path( 'build/sw.js' ) );
					$script = preg_replace( '#/\*\s*global.+?\*/#s', '', $script );

					return preg_replace_callback(
						'/\b(' . implode( '|', array_keys( $this->replacements ) ) . ')\b/',
						function( array $matches ) use ( $replacements ) : string {
							if ( isset( $replacements[ $matches[0] ] ) ) {
								return $replacements[ $matches[0] ];
							}
							return 'null';
						},
						$script
					);
				},
			)
		);
	}
}
