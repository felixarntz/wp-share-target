/* global SHARE_URL, SHARE_REDIRECT_URL */

/**
 * Listens to a share event and sends data to the client via postMessage.
 *
 * This script is injected into the service worker.
 *
 * @param {Object} fetchEvent Fetch event data.
 */
self.addEventListener( 'fetch', async ( fetchEvent ) => {
	if ( fetchEvent.request.method !== 'POST' ) {
		return;
	}

	// Bail if this is not a share request.
	if ( fetchEvent.request.url.startsWith( SHARE_URL ) === false ) {
		return;
	}

	// Redirect the client to the URL that will handle the shared data.
	await fetchEvent.respondWith( Response.redirect( SHARE_REDIRECT_URL, 303 ) );

	// Receive shared data from the request.
	const data = await fetchEvent.request.formData();
	const title = data.get( 'title' );
	const description = data.get( 'description' );
	const link = data.get( 'link' );
	const file = data.get( 'file' );

	// Get the client to send postMessage to below.
	const client = await self.clients.get( fetchEvent.resultingClientId || fetchEvent.clientId );

	/**
	 * Sends postMessage event with the shared data.
	 *
	 * This function is run as an event listener for a 'message' event from
	 * the client, which is necessary for race conditions where the redirect
	 * takes too long or the browser takes too long to load.
	 *
	 * The client will send this 'message' event to indicate it is ready to
	 * handle the shared data.
	 *
	 * @param {Object} messageEvent Message event data.
	 */
	const sendSharePostMessage = async ( messageEvent ) => {
		if ( 'receive_wp_share_target_share' !== messageEvent.data.action ) {
			return;
		}

		// Remove 'message' event listener so that it does not run again for
		// the same data. Also clear the timeout since it is not needed in this
		// case.
		self.removeEventListener( 'message', sendSharePostMessage );
		clearTimeout( timeoutID );

		// Send postMessage to the client.
		client.postMessage( {
			action: 'wp_share_target_share',
			title,
			description,
			link,
			file,
		} );
	};

	// Listen to 'message' event from client.
	self.addEventListener( 'message', sendSharePostMessage );

	// Remove 'message' event listener in case no 'message' has been received
	// after 30 seconds, to prevent memory leaks.
	const timeoutID = setTimeout( () => {
		self.removeEventListener( 'message', sendSharePostMessage );
	}, 30000 );
} );
