/* global SHARE_URL, SHARE_REDIRECT_URL */

/**
 * Listens to a share event and sends data to the client via postMessage.
 *
 * This script is injected into the service worker.
 *
 * @param {Object} event Fetch event data.
 */
self.addEventListener( 'fetch', async (event) => {
	if ( event.request.method !== 'POST' ) {
		return;
	}

	if ( event.request.url.startsWith( SHARE_URL ) === false ) {
		return;
	}

	event.respondWith( Response.redirect( SHARE_REDIRECT_URL, 303 ) );

	event.waitUntil( async () => {
		const data = await event.request.formData();
		const client = await self.clients.get( event.resultingClientId || event.clientId );

		const title = data.get( 'title' );
		const description = data.get( 'description' );
		const link = data.get( 'link' );
		const file = data.get( 'file' );

		client.postMessage( {
			action: 'image_sharer_share',
			title,
			description,
			link,
			file,
		} );
	} );
} );
