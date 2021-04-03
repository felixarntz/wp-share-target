<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Service_Worker
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target;

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
	 * Plugin-relative path to the service worker script to use.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	protected $sw_file;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param Context $context The plugin context.
	 * @param string  $sw_file Optional. Plugin-relative path to the service worker script to use.
	 */
	public function __construct( Context $context, string $sw_file = 'build/sw.js' ) {
		$this->context = $context;
		$this->sw_file = $sw_file;
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
			'share-target-sw',
			array(
				'src' => function() {
					$replacements = array(
						'SHARE_URL'          => "'" . $this->context->share_url() . "'",
						'SHARE_REDIRECT_URL' => "'" . admin_url( 'post-new.php' ) . "'",
					);

					// phpcs:ignore WordPress.WP.AlternativeFunctions.file_get_contents_file_get_contents
					$script = file_get_contents( $this->context->path( $this->sw_file ) );
					$script = preg_replace( '#/\*\s*global.+?\*/#s', '', $script );

					return preg_replace_callback(
						'/\b(' . implode( '|', array_keys( $replacements ) ) . ')\b/',
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
