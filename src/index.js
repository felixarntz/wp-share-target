/**
 * Internal dependencies
 */
import uploadMediaFile from './upload-media-file';
import createShareTargetAPI from './create-share-target-api';

// Create shareTarget API object and assign to `wp` global.
const shareTarget = createShareTargetAPI();
if ( ! global.wp ) {
	global.wp = {};
}
if ( ! global.wp.shareTarget ) {
	global.wp.shareTarget = shareTarget;
}

/**
 * Handles the postMessage event with 'image_sharer_share' action which is
 * dispatched from the service worker.
 *
 * @param {Object} event Event with relevant data in the `data` property.
 */
const receivePostMessage = async ( event ) => {
	if ( 'image_sharer_share' !== event.data.action ) {
		return;
	}

	const title = event.data.title;
	const description = event.data.description;
	const link = event.data.link;
	let attachment;

	// If a media file is passed, upload it and get the attachment.
	if ( event.data.file && event.data.file.name ) {
		attachment = await uploadMediaFile( event.data.file );
	}

	await shareTarget.handleShare( { title, description, link, attachment } );
};

if ( navigator.serviceWorker ) {
	( async () => {
		const registration = await navigator.serviceWorker.ready;

		if ( registration.active ) {
			registration.active.postMessage( {
				action: 'receive_image_sharer_share',
			} );
		}
	} )();

	navigator.serviceWorker.addEventListener( 'message', receivePostMessage );
}
