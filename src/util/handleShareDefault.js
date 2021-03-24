/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttachmentBlock from './getAttachmentBlock';

/**
 * Handles data passed in a share event.
 *
 * This is the default handler that will be used if no other (custom) one
 * already handled the data.
 *
 * @param {Object} data               Shared data.
 * @param {string} [data.title]       Text shared as "title", if provided.
 * @param {string} [data.description] Text shared as "description", if
 *                                    provided.
 * @param {string} [data.link]        URL shared, if provided.
 * @param {Object} [data.attachment]  WordPress attachment object, if media
 *                                    file provided.
 * @return {Promise} Promise which resolves to true if the share data was
 *                   handled, or to false otherwise.
 */
export default async function handleShareDefault( {
	title,
	description,
	link,
	attachment,
} ) {
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
		blocks.push(
			createBlock( 'core/paragraph', {
				content: description,
			} )
		);
	}

	// If a link is passed, include it in the content.
	if ( link && link.length ) {
		blocks.push(
			createBlock( 'core/paragraph', {
				content: `<a href="${ link }">${ link }</a>`,
			} )
		);
	}

	if ( blocks.length ) {
		dispatch( 'core/block-editor' ).insertBlocks( blocks );
	}

	return true;
}
