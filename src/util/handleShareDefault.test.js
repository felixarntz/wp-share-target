/**
 * WordPress dependencies
 */
import * as wpBlocks from '@wordpress/blocks';
import * as wpData from '@wordpress/data';

/**
 * Internal dependencies
 */
import handleShareDefault from './handleShareDefault';

jest.mock( '@wordpress/blocks' );
jest.mock( '@wordpress/data' );

describe( 'handleShareDefault', () => {
	let editPost, insertBlocks;

	beforeEach( () => {
		wpBlocks.createBlock.mockImplementation( ( name, attributes ) => {
			return { name, attributes };
		} );

		editPost = jest.fn();
		insertBlocks = jest.fn();
		const coreEditor = { editPost };
		const coreBlockEditor = { insertBlocks };

		wpData.dispatch.mockImplementation( ( storeName ) => {
			switch ( storeName ) {
				case 'core/editor':
					return coreEditor;
				case 'core/block-editor':
					return coreBlockEditor;
			}
			return null;
		} );
	} );

	it( 'sets the post title when a title is shared', async () => {
		const title = 'Shared title';
		expect( await handleShareDefault( { title } ) ).toBe( true );
		expect( editPost ).toHaveBeenCalledWith( { title } );
	} );

	it( 'does not set post title when no title is shared', async () => {
		const description = 'Shared description';
		expect( await handleShareDefault( { description } ) ).toBe( true );
		expect( editPost ).not.toHaveBeenCalled();
	} );

	it( 'does not insert any blocks when only title is shared', async () => {
		const title = 'Shared title';
		expect( await handleShareDefault( { title } ) ).toBe( true );
		expect( insertBlocks ).not.toHaveBeenCalled();
	} );

	const testCases = [
		[
			{ description: 'Here is a description.' },
			[
				{
					name: 'core/paragraph',
					attributes: {
						content: 'Here is a description.',
					},
				},
			],
		],
		[
			{
				description: 'Above you can find an audio file.',
				attachment: {
					id: 1,
					url: 'https://example.org/media/audio.mp3',
					title: 'Audio',
					caption: 'This is an audio file.',
					mime_type: 'audio/mpeg',
				},
			},
			[
				{
					name: 'core/audio',
					attributes: {
						id: 1,
						src: 'https://example.org/media/audio.mp3',
						caption: 'This is an audio file.',
					},
				},
				{
					name: 'core/paragraph',
					attributes: {
						content: 'Above you can find an audio file.',
					},
				},
			],
		],
		[
			{ link: 'https://wordpress.org' },
			[
				{
					name: 'core/paragraph',
					attributes: {
						content:
							'<a href="https://wordpress.org">https://wordpress.org</a>',
					},
				},
			],
		],
		[
			{
				description: 'This describes the link below.',
				link: 'https://example.org',
			},
			[
				{
					name: 'core/paragraph',
					attributes: {
						content: 'This describes the link below.',
					},
				},
				{
					name: 'core/paragraph',
					attributes: {
						content:
							'<a href="https://example.org">https://example.org</a>',
					},
				},
			],
		],
	];
	it.each( testCases )(
		'inserts expected blocks for %s',
		async ( sharedData, expectedBlocks ) => {
			expect( await handleShareDefault( sharedData ) ).toBe( true );
			expect( insertBlocks ).toHaveBeenCalledWith( expectedBlocks );
		}
	);
} );
