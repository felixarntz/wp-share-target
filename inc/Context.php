<?php
/**
 * Class Felix_Arntz\WP_Image_Sharer\Context
 *
 * @package Felix_Arntz\WP_Image_Sharer
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/image-sharer/
 */

namespace Felix_Arntz\WP_Image_Sharer;

/**
 * Class representing the context in which the plugin is running.
 *
 * @since 1.0.0
 */
class Context {

	/**
	 * Absolute path to the plugin main file.
	 *
	 * @since 1.0.0
	 * @var string
	 */
	protected $main_file;

	/**
	 * Constructor.
	 *
	 * @since 1.0.0
	 *
	 * @param string $main_file Absolute path to the plugin main file.
	 */
	public function __construct( string $main_file ) {
		$this->main_file = $main_file;
	}

	/**
	 * Gets the absolute path for a path relative to the plugin directory.
	 *
	 * @since 1.0.0
	 *
	 * @param string $relative_path Optional. Relative path. Default '/'.
	 * @return string Absolute path.
	 */
	public function path( string $relative_path = '/' ) : string {
		return plugin_dir_path( $this->main_file ) . ltrim( $relative_path, '/' );
	}

	/**
	 * Gets the full URL for a path relative to the plugin directory.
	 *
	 * @since 1.0.0
	 *
	 * @param string $relative_path Optional. Relative path. Default '/'.
	 * @return string Full URL.
	 */
	public function url( string $relative_path = '/' ) : string {
		return plugin_dir_url( $this->main_file ) . ltrim( $relative_path, '/' );
	}
}
