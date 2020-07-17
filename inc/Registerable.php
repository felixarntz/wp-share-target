<?php
/**
 * Interface Felix_Arntz\WP_Share_Target\Registerable
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target;

/**
 * Interface for a class that has registerable functionality.
 *
 * @since 1.0.0
 */
interface Registerable {

	/**
	 * Registers the class's functionality, e.g. via WordPress hooks.
	 *
	 * @since 1.0.0
	 */
	public function register();
}
