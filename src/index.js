/**
 * Internal dependencies
 */
import uploadMediaFile from './upload-media-file';
import createShareTargetAPI from './create-share-target-api';
import createLoader from './create-loader';

// Create shareTarget API object and assign to `wp` global.
const shareTarget = createShareTargetAPI();
if ( ! global.wp ) {
	global.wp = {};
}
if ( ! global.wp.shareTarget ) {
	global.wp.shareTarget = shareTarget;
}

/**
 * Handles the postMessage event with 'wp_share_target_share' action which is
 * dispatched from the service worker.
 *
 * @param {Object} event Event with relevant data in the `data` property.
 */
const receivePostMessage = async ( event ) => {
	if ( 'wp_share_target_share' !== event.data.action ) {
		return;
	}

	const loader = createLoader( document.getElementById( 'wpbody' ) );
	loader.insert();

	const title = event.data.title;
	const description = event.data.description;
	const link = event.data.link;
	let attachment;

	// If a media file is passed, upload it and get the attachment.
	if ( event.data.file && event.data.file.name ) {
		attachment = await uploadMediaFile( event.data.file );
	}

	await shareTarget.handleShare( { title, description, link, attachment } );
	loader.detach();
};

if ( navigator.serviceWorker ) {
	( async () => {
		const registration = await navigator.serviceWorker.ready;

		if ( registration.active ) {
			registration.active.postMessage( {
				action: 'receive_wp_share_target_share',
			} );
		}
	} )();

	navigator.serviceWorker.addEventListener( 'message', receivePostMessage );
}
