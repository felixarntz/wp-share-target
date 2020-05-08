/**
 * Internal dependencies
 */
import uploadMediaFile from './upload-media-file';
import handleShareDefault from './handle-share-default';

/**
 * Handles the postMessage event with 'image_sharer_share' action which is dispatched from the service worker.
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
		try {
			attachment = await uploadMediaFile( event.data.file );
		} catch ( error ) {
			console.error( error.message ); // eslint-disable-line no-console
		}
	}

	handleShareDefault( { title, description, link, attachment } );
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
