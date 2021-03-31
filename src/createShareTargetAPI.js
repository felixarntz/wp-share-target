/**
 * Internal dependencies
 */
import handleShareDefault from './util/handleShareDefault';

/**
 * Creates a share handlers object which allows for registration and handling.
 *
 * @return {Object} Share handlers object with methods `registerShareHandler`,
 *                  `getShareHandlers`, and `handleShare`.
 */
export default function createShareTargetAPI() {
	const registeredShareHandlers = [];

	const shareHandlers = {
		/**
		 * Registers a new share handler for incoming shared data.
		 *
		 * @param {Object}   options            Handler options.
		 * @param {Function} options.handle     Share handler function. Must
		 *                                      be asynchronous and accept an
		 *                                      object with properties `title`,
		 *                                      `description`, `link` (each
		 *                                      strings), and `attachment`
		 *                                      (object). Any of these may be
		 *                                      undefined. Depending on the
		 *                                      data, the function should
		 *                                      decide whether to handle it and
		 *                                      if so run the necessary logic
		 *                                      and return true, to stop
		 *                                      following handlers from being
		 *                                      called. Otherwise, it should
		 *                                      return false.
		 * @param {number}   [options.priority] Priority for the handler. A
		 *                                      lower number means higher
		 *                                      priority, like for WordPress
		 *                                      hooks. Default is 10.
		 */
		registerShareHandler( options ) {
			if ( 'function' !== typeof options.handle ) {
				throw new Error(
					'options.handle argument must be a function.'
				);
			}

			options.priority = options.priority || 10;

			registeredShareHandlers.push( {
				...options,
			} );

			registeredShareHandlers.sort( ( a, b ) => {
				if ( a.priority > b.priority ) {
					return 1;
				}
				if ( a.priority < b.priority ) {
					return -1;
				}
				return 0;
			} );
		},

		/**
		 * Handles data passed in a share event.
		 *
		 * This iterates through registered share handlers either until one of
		 * them returns `true` or until the end. If there are no registered
		 * share handlers or if they all return `false`, the default share
		 * handler will be used.
		 *
		 * @param {Object} data               Shared data.
		 * @param {string} [data.title]       Text shared as "title", if
		 *                                    provided.
		 * @param {string} [data.description] Text shared as "description", if
		 *                                    provided.
		 * @param {string} [data.link]        URL shared, if provided.
		 * @param {Object} [data.attachment]  WordPress attachment object, if
		 *                                    media file provided.
		 * @return {Promise} Promise which resolves to true if the share data
		 *                   was handled, or to false otherwise.
		 */
		async handleShare( { title, description, link, attachment } ) {
			let i;
			for ( i = 0; i < registeredShareHandlers.length; i++ ) {
				const options = registeredShareHandlers[ i ];
				const result = await options.handle( {
					title,
					description,
					link,
					attachment,
				} );
				if ( result ) {
					return true;
				}
			}

			return await handleShareDefault( {
				title,
				description,
				link,
				attachment,
			} );
		},
	};

	return shareHandlers;
}
