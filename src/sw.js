/* global SHARE_URL, SHARE_REDIRECT_URL */

let currentShareData;

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

	currentShareData = {
		title,
		description,
		link,
		file,
	};
} );

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
self.addEventListener( 'message', ( messageEvent ) => {
	console.log( 'messageEvent', messageEvent ); // eslint-disable-line no-console
	if ( 'receive_wp_share_target_share' !== messageEvent.data.action ) {
		return;
	}

	if ( ! messageEvent.source || messageEvent.source.url !== SHARE_REDIRECT_URL ) {
		return;
	}

	if ( ! currentShareData ) {
		return;
	}

	const messageData = {
		action: 'wp_share_target_share',
		...currentShareData,
	};
	currentShareData = undefined;

	// Send postMessage to the client.
	messageEvent.source.postMessage( messageData );
} );
