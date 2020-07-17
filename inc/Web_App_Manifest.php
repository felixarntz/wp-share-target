<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Web_App_Manifest
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target;

/**
 * Class integrating with the site's web app manifest.
 *
 * @since 1.0.0
 */
class Web_App_Manifest implements Registerable {

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
		add_filter( 'web_app_manifest', array( $this, 'modify_manifest' ) );
	}

	/**
	 * Modifies the site's web app manifest.
	 *
	 * @since 1.0.0
	 *
	 * @param array $manifest The associative web app manifest array.
	 * @return array The filtered $manifest.
	 */
	public function modify_manifest( array $manifest ) : array {
		$manifest['share_target'] = array(
			'action'  => $this->context->share_url(),
			'method'  => 'POST',
			'enctype' => 'multipart/form-data',
			'params'  => array(
				'title' => 'title',
				'text'  => 'description',
				'url'   => 'link',
				'files' => array(
					array(
						'name'   => 'file',
						'accept' => array(
							'audio/*',
							'image/*',
							'video/*',
						),
					),
				),
			),
		);

		return $manifest;
	}
}
