<?php
/**
 * Plugin initialization file
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 *
 * @wordpress-plugin
 * Plugin Name: Share Target
 * Plugin URI:  https://wordpress.org/plugins/share-target/
 * Description: Plugin to share images and other media directly to a WordPress site via Web Share Target API.
 * Version:     1.0.0
 * Author:      Felix Arntz
 * Author URI:  https://felix-arntz.me
 * License:     GNU General Public License v2 (or later)
 * License URI: http://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: share-target
 */

/* This file must be parseable by PHP 5.2. */

/**
 * Loads the plugin.
 *
 * @since 1.0.0
 */
function wp_share_target_load() {
	if ( version_compare( phpversion(), '7.0', '<' ) ) {
		add_action( 'admin_notices', 'wp_share_target_display_php_version_notice' );
		return;
	}

	if ( version_compare( get_bloginfo( 'version' ), '5.0', '<' ) ) {
		add_action( 'admin_notices', 'wp_share_target_display_wp_version_notice' );
		return;
	}

	if ( file_exists( dirname( __FILE__ ) . '/vendor/autoload.php' ) ) {
		require dirname( __FILE__ ) . '/vendor/autoload.php';
	}

	call_user_func( [ 'Felix_Arntz\\WP_Share_Target\\Plugin', 'load' ], __FILE__ );
}

/**
 * Displays an admin notice about an unmet PHP version requirement.
 *
 * @since 1.0.0
 */
function wp_share_target_display_php_version_notice() {
	?>
	<div class="notice notice-error">
		<p>
			<?php
			sprintf(
				/* translators: 1: required version, 2: currently used version */
				__( 'Share Target requires at least PHP version %1$s. Your site is currently running on PHP %2$s.', 'share-target' ),
				'7.0',
				phpversion()
			);
			?>
		</p>
	</div>
	<?php
}

/**
 * Displays an admin notice about an unmet WordPress version requirement.
 *
 * @since 1.0.0
 */
function wp_share_target_display_wp_version_notice() {
	?>
	<div class="notice notice-error">
		<p>
			<?php
			sprintf(
				/* translators: 1: required version, 2: currently used version */
				__( 'Share Target requires at least WordPress version %1$s. Your site is currently running on WordPress %2$s.', 'share-target' ),
				'5.0',
				get_bloginfo( 'version' )
			);
			?>
		</p>
	</div>
	<?php
}

wp_share_target_load();
