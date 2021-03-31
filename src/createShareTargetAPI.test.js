/**
 * Internal dependencies
 */
import createShareTargetAPI from './createShareTargetAPI';

describe( 'createShareTargetAPI', () => {
	let api;

	beforeEach( () => {
		api = createShareTargetAPI();
	} );

	it( 'creates an object with the expected functions', () => {
		const newAPI = createShareTargetAPI();

		expect( newAPI ).toMatchObject( {
			registerShareHandler: expect.any( Function ),
			handleShare: expect.any( Function ),
		} );
	} );

	describe( 'registerShareHandler', () => {
		it( 'throws an error if no handle is provided', () => {
			expect( () => api.registerShareHandler( {} ) ).toThrow(
				'options.handle argument must be a function.'
			);
		} );

		it( 'registers a share handler so that it is called in handleShare', async () => {
			const handle = jest.fn();
			api.registerShareHandler( { handle } );

			await api.handleShare( {} );
			expect( handle ).toHaveBeenCalled();
		} );

		it( 'sorts registered share handlers by priority for calling in handleShare', async () => {
			const order = [];

			function addToOrder( value ) {
				order.push( value );
				return false;
			}

			// Default priority is 10.
			const handle10 = jest.fn( () => addToOrder( 10 ) );
			api.registerShareHandler( { handle: handle10 } );
			const handle5 = jest.fn( () => addToOrder( 5 ) );
			api.registerShareHandler( { handle: handle5, priority: 5 } );
			const handle195 = jest.fn( () => addToOrder( 195 ) );
			api.registerShareHandler( { handle: handle195, priority: 195 } );

			await api.handleShare( {} );
			expect( handle10 ).toHaveBeenCalled();
			expect( handle5 ).toHaveBeenCalled();
			expect( handle195 ).toHaveBeenCalled();
			expect( order ).toEqual( [ 5, 10, 195 ] );
		} );
	} );

	describe( 'handleShare', () => {
		it( 'only calls handlers until the first one returns true', async () => {
			const handle1 = jest.fn( () => false );
			api.registerShareHandler( { handle: handle1, priority: 1 } );
			const handle2 = jest.fn( () => true );
			api.registerShareHandler( { handle: handle2, priority: 2 } );
			const handle3 = jest.fn( () => true );
			api.registerShareHandler( { handle: handle3, priority: 3 } );
			const handle4 = jest.fn( () => false );
			api.registerShareHandler( { handle: handle4, priority: 4 } );

			await api.handleShare( {} );
			expect( handle1 ).toHaveBeenCalled();
			expect( handle2 ).toHaveBeenCalled();
			expect( handle3 ).not.toHaveBeenCalled();
			expect( handle4 ).not.toHaveBeenCalled();
		} );
	} );
} );
