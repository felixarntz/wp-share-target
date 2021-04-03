<?php
/**
 * Dummy class WP_Service_Worker_Scripts
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

/**
 * Dummy class to use instead of the same class from the PWA plugin.
 */
class WP_Service_Worker_Scripts {

	public $scripts = array();

	public function register( string $handle, array $data ) {
		$this->scripts[ $handle ] = $data;
	}
}
