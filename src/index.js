/**
 * Internal dependencies
 */
import createShareTargetAPI from './createShareTargetAPI';
import isEditorReady from './util/isEditorReady';
import createLoader from './util/createLoader';
import uploadMediaFile from './util/uploadMediaFile';

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
async function receivePostMessage( event ) {
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
		try {
			attachment = await uploadMediaFile( event.data.file );
		} catch ( error ) {
			console.error( error.message ); // eslint-disable-line no-console
		}
	}

	await isEditorReady();
	await shareTarget.handleShare( { title, description, link, attachment } );
	loader.detach();
}

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
