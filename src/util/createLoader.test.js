/**
 * Internal dependencies
 */
import createLoader from './createLoader';

describe( 'createLoader', () => {
	const element = document.createElement( 'div' );
	const loader = createLoader( element );

	afterEach( () => {
		// Empty element.
		while ( element.firstChild ) {
			element.removeChild( element.firstChild );
		}
	} );

	it( 'creates an object with insert and detach functions', () => {
		const newLoader = createLoader( element );

		expect( newLoader ).toMatchObject( {
			insert: expect.any( Function ),
			detach: expect.any( Function ),
		} );
	} );

	describe( 'insert', () => {
		it( 'adds the loader to the element', () => {
			expect( element ).toBeEmptyDOMElement();
			loader.insert();

			expect( element ).not.toBeEmptyDOMElement();

			const loaderDiv = element.firstElementChild;
			expect( loaderDiv ).not.toBe( null );

			const loaderContent = loaderDiv.firstElementChild;
			expect( loaderContent ).not.toBe( null );
			expect( loaderContent ).toHaveTextContent( 'Loading shared data…' );
		} );
	} );

	describe( 'detach', () => {
		beforeEach( () => {
			loader.insert();
		} );

		it( 'removes the loader from the element', () => {
			expect( element ).not.toBeEmptyDOMElement();
			loader.detach();

			expect( element ).toBeEmptyDOMElement();
		} );
	} );
} );
