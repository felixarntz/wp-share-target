/**
 * WordPress dependencies
 */
import { uploadMedia } from '@wordpress/media-utils';
import { __ } from '@wordpress/i18n';

/**
 * Uploads a media file to WordPress and returns the attachment for it.
 *
 * @param {Object} file Uploaded file object.
 * @return {Object} WordPress attachment object.
 */
export default async ( file ) => {
	let attachment;

	await uploadMedia( {
		filesList: [ file ],
		allowedTypes: [ 'audio', 'image', 'video' ],
		onFileChange: ( files ) => {
			if ( ! files[0] ) {
				return;
			}
			attachment = files[0];
		},
		onError: ( error ) => {
			throw error;
		},
	} );

	if ( ! attachment || ! attachment.id ) {
		throw {
			message: __( 'Unknown upload error.', 'image-sharer' ),
		};
	}

	return attachment;
};
