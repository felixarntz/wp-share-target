/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Returns block definition based on the attachment passed.
 *
 * If it is an audio file, a 'core/audio' block is used.
 * If it is an image file, a 'core/image' block is used.
 * If it is a video file, a 'core/video' block is used.
 *
 * @param {Object} attachment WordPress attachment object.
 * @return {Object} Object with block definition, with `name` and `attributes`
 *                  properties.
 */
export default function getAttachmentBlock( attachment ) {
	if ( attachment.mime_type.startsWith( 'audio/' ) ) {
		return {
			name: 'core/audio',
			attributes: {
				id: attachment.id,
				src: attachment.url,
				caption: attachment.caption,
			},
		};
	}

	if ( attachment.mime_type.startsWith( 'image/' ) ) {
		return {
			name: 'core/image',
			attributes: {
				id: attachment.id,
				url: attachment.url,
				sizeSlug: 'large',
				alt: attachment.alt,
				title: attachment.title,
				caption: attachment.caption,
			},
		};
	}

	if ( attachment.mime_type.startsWith( 'video/' ) ) {
		return {
			name: 'core/video',
			attributes: {
				id: attachment.id,
				src: attachment.url,
				caption: attachment.caption,
			},
		};
	}

	throw {
		message: __( 'Unsupported attachment MIME type.', 'share-target' ),
	};
}
