/* global SHARE_URL, SHARE_REDIRECT_URL */

self.addEventListener( 'fetch', async (event) => {
	if ( event.request.method !== 'POST' ) {
		return;
	}

	if ( event.request.url.startsWith( SHARE_URL ) === false ) {
		return;
	}

	event.respondWith( Response.redirect( SHARE_REDIRECT_URL ) );

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
