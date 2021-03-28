/**
 * Internal dependencies
 */
import getAttachmentBlock from './getAttachmentBlock';

describe( 'getAttachmentBlock', () => {
	it( 'turns an audio attachment into a core/audio block', () => {
		const attachment = {
			id: 1,
			url: 'https://example.org/wp-content/uploads/2020/06/audio.mp3',
			title: 'Audio',
			caption: 'This is an audio file.',
			mime_type: 'audio/mpeg',
		};
		const block = getAttachmentBlock( attachment );

		expect( block ).toMatchObject( {
			name: 'core/audio',
			attributes: {
				id: attachment.id,
				src: attachment.url,
				caption: attachment.caption,
			},
		} );
	} );

	it( 'turns an image attachment into a core/image block', () => {
		const attachment = {
			id: 1,
			url: 'https://example.org/wp-content/uploads/2020/06/image.jpg',
			title: 'Image',
			caption: 'This is an image file.',
			mime_type: 'image/jpeg',
		};
		const block = getAttachmentBlock( attachment );

		expect( block ).toMatchObject( {
			name: 'core/image',
			attributes: {
				id: attachment.id,
				url: attachment.url,
				sizeSlug: 'large',
				alt: undefined,
				title: attachment.title,
				caption: attachment.caption,
			},
		} );
	} );

	it( 'turns a video attachment into a core/video block', () => {
		const attachment = {
			id: 1,
			url: 'https://example.org/wp-content/uploads/2020/06/video.mp4',
			title: 'Video',
			caption: 'This is a video file.',
			mime_type: 'video/mp4',
		};
		const block = getAttachmentBlock( attachment );

		expect( block ).toMatchObject( {
			name: 'core/video',
			attributes: {
				id: attachment.id,
				src: attachment.url,
				caption: attachment.caption,
			},
		} );
	} );

	it( 'fails for an attachment of any other type', () => {
		const attachment = {
			id: 1,
			url: 'https://example.org/wp-content/uploads/2020/06/form.pdf',
			title: 'PDF',
			caption: 'This is a PDF document.',
			mime_type: 'application/pdf',
		};

		expect( () => getAttachmentBlock( attachment ) ).toThrow(
			'Unsupported attachment MIME type.'
		);
	} );
} );
