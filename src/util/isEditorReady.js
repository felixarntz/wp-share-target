/**
 * WordPress dependencies
 */
import { select, subscribe } from '@wordpress/data';

/**
 * Returns a promise that resolves when the block editor is ready.
 *
 * This fixes a race condition where the current post and the datastore may be
 * interacted with too early.
 *
 * @return {Promise} Promise that resolves when the block editor is ready.
 */
export default async function isEditorReady() {
	new Promise( ( resolve ) => {
		const unsubscribe = subscribe( () => {
			// Approximate editor ready by checking for clean post or blocks loaded.
			const isCleanNewPost = select( 'core/editor' ).isCleanNewPost();
			if ( isCleanNewPost ) {
				unsubscribe();
				resolve();
			}
			const blocks = select( 'core/block-editor' ).getBlocks();
			if ( blocks.length > 0 ) {
				unsubscribe();
				resolve();
			}
		} );
	} );
}
