/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttachmentBlock from './get-attachment-block';

/**
 * Handles data passed in a share event.
 *
 * This is the default handler that will be used if no other (custom) one
 * already handled the data.
 *
 * @param {Object} options
 * @param {(string|undefined)} options.title       Text shared as "title", if provided.
 * @param {(string|undefined)} options.description Text shared as "description", if provided.
 * @param {(string|undefined)} options.link        URL shared, if provided.
 * @param {(Object|undefined)} options.attachment  WordPress attachment object, if media file provided.
 * @return {boolean} True if the share data was handled, false otherwise.
 */
export default ( { title, description, link, attachment } ) => {
	const blocks = [];

	// If a title is passed, set the post title.
	if ( title ) {
		dispatch( 'core/editor' ).editPost( { title } );
	}

	// If an attachment was created from a media file passed, include it in the content.
	if ( attachment ) {
		try {
			const { name, attributes } = getAttachmentBlock( attachment );
			blocks.push( createBlock( name, attributes ) );
		} catch ( error ) {
			console.error( error.message ); // eslint-disable-line no-console
		}
	}

	// If a description is passed, add it as content.
	if ( description && description.length ) {
		blocks.push( createBlock( 'core/paragraph', {
			content: description,
		} ) );
	}

	// If a link is passed, include it in the content.
	if ( link && link.length ) {
		blocks.push( createBlock( 'core/paragraph', {
			content: `<a href="${ link }">${ link }</a>`,
		} ) );
	}

	if ( blocks.length ) {
		dispatch( 'core/block-editor' ).insertBlocks( blocks );
	}

	return true;
};
