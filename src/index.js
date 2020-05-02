/**
 * Internal dependencies
 */
import uploadMediaFile from './upload-media-file';
import handleShareDefault from './handle-share-default';

navigator.serviceWorker.onmessage = async ( event ) => {
	if ( 'image_sharer_share' !== event.data.action ) {
		return;
	}

	const title = event.data.title;
	const description = event.data.description;
	const link = event.data.link;
	let attachment;

	// If a media file is passed, upload it and get the attachment.
	if ( event.data.file ) {
		try {
			attachment = await uploadMediaFile( event.data.file );
		} catch ( error ) {
			console.error( error.message ); // eslint-disable-line no-console
		}
	}

	handleShareDefault( { title, description, link, attachment } );
};
