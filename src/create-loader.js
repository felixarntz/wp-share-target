/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

let counter = 0;

/**
 * Creates a loader object that can be used to add a loading indicator to the DOM..
 *
 * @param {Object} element Element that the loader should be attached to.
 * @return {Object} Loader with `insert()` and `detach()` methods.
 */
const createLoader = ( element ) => {
	counter++;
	const id = `wp-share-target-loader-${ counter }`;

	const loaderDiv = document.createElement( 'div' );
	loaderDiv.id = id;
	loaderDiv.style.position = 'fixed';
	loaderDiv.style.top = '0';
	loaderDiv.style.right = '0';
	loaderDiv.style.bottom = '0';
	loaderDiv.style.left = '0';
	loaderDiv.style.zIndex = '10000000';
	loaderDiv.style.background = 'rgba(0, 0, 0, 0.8)';

	const loaderContent = document.createElement( 'div' );
	loaderContent.style.position = 'absolute';
	loaderContent.style.top = '50%';
	loaderContent.style.left = '50%';
	loaderContent.style.transform = 'translate(-50%, -50%)';
	loaderContent.style.color = 'white';
	loaderContent.style.fontSize = '3rem';
	loaderContent.textContent = __( 'Loading shared data…', 'share-target' );

	loaderDiv.appendChild( loaderContent );

	return {
		insert: () => {
			element.appendChild( loaderDiv );
		},
		detach: () => {
			element.removeChild( loaderDiv );
		},
	};
};

export default createLoader;
