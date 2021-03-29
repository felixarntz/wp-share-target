/**
 * WordPress dependencies
 */
import * as wpData from '@wordpress/data';

/**
 * Internal dependencies
 */
import isEditorReady from './isEditorReady';

jest.mock( '@wordpress/data' );
jest.useFakeTimers();

describe( 'isEditorReady', () => {
	let isCleanNewPost, getBlocks, editPost, insertBlocks;

	beforeEach( () => {
		let currentPost = null;
		const currentBlocks = [];
		const subscribedFunctions = {};
		let subscribedFunctionCount = 0;

		// Mock subscribe function.
		const refreshSubscribedFunctions = () =>
			Object.values( subscribedFunctions ).forEach( ( func ) => func() );
		wpData.subscribe.mockImplementation( ( func ) => {
			subscribedFunctionCount++;
			subscribedFunctions[ `f${ subscribedFunctionCount }` ] = func;
			setTimeout( func, 0 );
			return () => {
				delete subscribedFunctions[ `f${ subscribedFunctionCount }` ];
			};
		} );

		// Mock necessary selectors.
		isCleanNewPost = jest.fn( () => currentPost !== null );
		getBlocks = jest.fn( () => currentBlocks );
		const selectCoreEditor = { isCleanNewPost };
		const selectCoreBlockEditor = { getBlocks };
		wpData.select.mockImplementation( ( storeName ) => {
			switch ( storeName ) {
				case 'core/editor':
					return selectCoreEditor;
				case 'core/block-editor':
					return selectCoreBlockEditor;
			}
			return null;
		} );

		// Mock necessary actions, including refresh of subscribed functions.
		editPost = jest.fn( ( post ) => {
			currentPost = { ...( currentPost || {} ), ...post };
			refreshSubscribedFunctions();
		} );
		insertBlocks = jest.fn( ( blocks ) => {
			if ( blocks.length ) {
				currentBlocks.push( ...blocks );
			}
			refreshSubscribedFunctions();
		} );
		const dispatchCoreEditor = { editPost };
		const dispatchCoreBlockEditor = { insertBlocks };
		wpData.dispatch.mockImplementation( ( storeName ) => {
			switch ( storeName ) {
				case 'core/editor':
					return dispatchCoreEditor;
				case 'core/block-editor':
					return dispatchCoreBlockEditor;
			}
			return null;
		} );
	} );

	describe( 'subscribe mock', () => {
		it( 'calls subscribed functions on every refresh', () => {
			const fn = jest.fn();
			wpData.subscribe( fn );
			jest.runAllTimers();
			expect( fn ).toBeCalledTimes( 1 );

			for ( let i = 0; i < 3; i++ ) {
				wpData.dispatch( 'core/block-editor' ).insertBlocks( [] );
			}
			expect( fn ).toBeCalledTimes( 4 );
		} );

		it( 'returns a function to unsubscribe', () => {
			const fn = jest.fn();
			const unsubscribe = wpData.subscribe( fn );
			jest.runAllTimers();
			expect( fn ).toBeCalledTimes( 1 );

			unsubscribe();
			for ( let i = 0; i < 3; i++ ) {
				wpData.dispatch( 'core/block-editor' ).insertBlocks( [] );
			}
			expect( fn ).toBeCalledTimes( 1 );
		} );
	} );

	it( 'resolves once the post is loaded', async () => {
		wpData.dispatch( 'core/editor' ).editPost( { title: 'Title' } );

		await isEditorReady();
		expect( true ).toBe( true );
	} );

	it( 'resolves once blocks are loaded', async () => {
		wpData
			.dispatch( 'core/block-editor' )
			.insertBlocks( [ { name: 'core/paragraph' } ] );

		await isEditorReady();
		expect( true ).toBe( true );
	} );

	// TODO: The following should fail, but it doesn't.
	// eslint-disable-next-line jest/no-commented-out-tests
	/*it( 'does not resolve if neither post is loaded nor blocks are added', async () => {
		await isEditorReady();
		expect( true ).toBe( true );
	} );*/
} );
