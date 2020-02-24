/**
 * WordPress dependencies
 */
import { createBlock } from '@wordpress/blocks';
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import uploadMediaFile from './upload-media-file';
import getAttachmentBlock from './get-attachment-block';

navigator.serviceWorker.onmessage = async ( event ) => {
	if ( 'image_sharer_share' !== event.data.action ) {
		return;
	}

	const { editPost, insertBlocks } = dispatch( 'core/editor' );
	const blocks = [];

	const title = event.data.title;
	const description = event.data.description;
	const link = event.data.link;
	const file = event.data.file;

	// If a title is passed, set the post title.
	if ( title ) {
		editPost( { title } );
	}

	// If a media file is passed, upload it and include it in the content.
	if ( file ) {
		try {
			const attachment = await uploadMediaFile( file );
			const block = getAttachmentBlock( attachment );

			blocks.push( createBlock( block.name, block.attributes ) );
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
		insertBlocks( { blocks } );
	}
};
