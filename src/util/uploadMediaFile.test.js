/**
 * WordPress dependencies
 */
import * as wpMediaUtils from '@wordpress/media-utils';

/**
 * Internal dependencies
 */
import uploadMediaFile from './uploadMediaFile';

jest.mock( '@wordpress/media-utils' );

describe( 'uploadMediaFile', () => {
	let mockError;

	wpMediaUtils.uploadMedia.mockImplementation( async ( options = {} ) => {
		if (
			! mockError &&
			options.filesList &&
			options.filesList.length &&
			options.filesList[ 0 ]?.name &&
			options.onFileChange
		) {
			const mockAttachment = {
				id: 1,
				url: `https://example.org/media/${ options.filesList[ 0 ].name }`,
				mime_type: options.filesList[ 0 ].type,
			};
			options.onFileChange( [ mockAttachment ] );
		}
		if ( mockError && options.onError ) {
			options.onError( mockError );
		}
	} );

	afterEach( () => {
		mockError = undefined;
	} );

	it( 'uploads file and returns the created attachment', async () => {
		const file = {
			name: 'audio.mp3',
			type: 'audio/mpeg',
		};
		await expect( uploadMediaFile( file ) ).resolves.toMatchObject( {
			id: 1,
			url: 'https://example.org/media/audio.mp3',
			mime_type: 'audio/mpeg',
		} );
		expect( wpMediaUtils.uploadMedia ).toHaveBeenCalled();
	} );

	it( 'throws error if the upload fails', async () => {
		const file = {
			name: 'audio.mp3',
			type: 'audio/mpeg',
		};
		mockError = { message: 'Upload was enforced to fail!' };
		await expect( uploadMediaFile( file ) ).rejects.toMatchObject(
			mockError
		);
		expect( wpMediaUtils.uploadMedia ).toHaveBeenCalled();
	} );

	it( 'throws error if no attachment is returned', async () => {
		// Use empty file to make the mock not do anything.
		const file = {};
		await expect( uploadMediaFile( file ) ).rejects.toMatchObject( {
			message: 'Unknown upload error.',
		} );
		expect( wpMediaUtils.uploadMedia ).toHaveBeenCalled();
	} );
} );
