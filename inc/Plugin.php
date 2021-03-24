<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Plugin
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target;

/**
 * Main class for the plugin.
 *
 * @since 1.0.0
 */
class Plugin implements Registerable {

	/**
	 * Context instance for the plugin.
	 *
	 * @since 1.0.0
	 * @var Context
	 */
	protected $context;

	/**
	 * Main instance of the plugin.
	 *
	 * @since 1.0.0
	 * @var Plugin|null
	 */
	protected static $instance = null;

	/**
	 * Sets the plugin main file.
	 *
	 * @since 1.0.0
	 *
	 * @param string $main_file Absolute path to the plugin main file.
	 */
	public function __construct( string $main_file ) {
		$this->context = new Context( $main_file );
	}

	/**
	 * Registers the plugin with WordPress.
	 *
	 * @since 1.0.0
	 */
	public function register() {
		if ( ! defined( 'PWA_VERSION' ) ) {
			add_action(
				'admin_notices',
				function() {
					$this->display_pwa_plugin_missing_notice();
				}
			);
			return;
		}

		( new Web_App_Manifest( $this->context ) )->register();
		( new Service_Worker( $this->context ) )->register();
		( new Editor( $this->context ) )->register();
	}

	/**
	 * Displays an admin notice about the PWA plugin missing.
	 *
	 * @since 1.0.0
	 */
	private function display_pwa_plugin_missing_notice() {
		$pwa_plugin_url = __( 'https://wordpress.org/plugins/pwa/', 'share-target' );

		if ( current_user_can( 'install_plugins' ) ) {
			$pwa_plugin_url = add_query_arg(
				array(
					's'    => 'pwa',
					'tab'  => 'search',
					'type' => 'term',
				),
				admin_url( 'plugin-install.php' )
			);
		}

		?>
		<div class="notice notice-error">
			<p>
				<?php
				echo wp_kses(
					sprintf(
						/* translators: %s: URL to PWA plugin in WordPress directory */
						__( 'Share Target requires the <a href="%s">PWA plugin</a> to be installed and activated. Once you have done so, you will be able to share data directly to your WordPress site.', 'share-target' ),
						$pwa_plugin_url
					),
					array(
						'a' => array(
							'href' => true,
						),
					)
				);
				?>
			</p>
		</div>
		<?php
	}

	/**
	 * Retrieves the main instance of the plugin.
	 *
	 * @since 1.0.0
	 *
	 * @return Plugin Plugin main instance.
	 */
	public static function instance() : Plugin {
		return static::$instance;
	}

	/**
	 * Loads the plugin main instance and initializes it.
	 *
	 * @since 1.0.0
	 *
	 * @param string $main_file Absolute path to the plugin main file.
	 * @return bool True if the plugin main instance could be loaded, false otherwise.
	 */
	public static function load( string $main_file ) : bool {
		if ( null !== static::$instance ) {
			return false;
		}

		static::$instance = new static( $main_file );
		static::$instance->register();

		return true;
	}
}
