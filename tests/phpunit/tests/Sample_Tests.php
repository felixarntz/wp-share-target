<?php
/**
 * Class Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests\Sample_Tests
 *
 * @package Felix_Arntz\WP_Share_Target
 * @license GNU General Public License v2 (or later)
 * @link    https://wordpress.org/plugins/share-target/
 */

namespace Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Tests;

use Felix_Arntz\WP_Share_Target\Tests\PHPUnit\Includes\Test_Case;

/**
 * Class containing a sample test.
 */
class Sample_Tests extends Test_Case {

	/**
	 * Performs a sample test.
	 */
	public function testNothingUseful() {
		$this->assertTrue( defined( 'ABSPATH' ) );
	}
}
