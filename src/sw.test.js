describe( 'service worker', () => {
	let addEventListener;

	beforeEach( () => {
		addEventListener = self.addEventListener;

		self.listeners = {};
		self.addEventListener = ( event, func ) => {
			if ( ! self.listeners[ event ] ) {
				self.listeners[ event ] = [];
			}
			self.listeners[ event ].push( func );
		};
		jest.resetModules();
	} );

	afterEach( () => {
		delete self.listeners;
		self.addEventListener = addEventListener;
	} );

	it( 'should add fetch and message listener', () => {
		require( './sw.js' );
		expect( self.listeners.fetch ).toBeDefined();
		expect( self.listeners.message ).toBeDefined();
	} );
} );
