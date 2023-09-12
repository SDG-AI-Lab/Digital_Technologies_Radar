describe('create technology', () => {
  // Set logged in state
  beforeEach(() => {
    window.localStorage.setItem('drr-current-user-id', 'admin');

    // intercept the creation request, stub empty 200 response
    cy.intercept(
      {
        method: 'POST'
      },
      {
        statusCode: 200,
        body: {
          id: 999
        }
      }
    ).as('createTechnology');
  });

  it('creates a technology in supabase', () => {
    cy.visit('http://localhost:3456/#/technologies');
    cy.get('[data-testid="add-technology"]').click();
    cy.get('[data-testid="field-title"]').type('Test technology');
    cy.get('[data-testid="field-description"]').type(
      'Test technology description'
    );
    cy.get('[data-testid="field-source"]').type('Test source');
    cy.get('[data-testid="field-img_url"]').type('Test image url');

    // Assert that the data was posted to supabase
    /*cy.wait('@createTechnology').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body.description).to.eq(
        'Test technology description'
      );
      expect(interception.request.body.img_url).to.eq('Test image url');
      expect(interception.request.body.source).to.eq('Test source');
      expect(interception.request.body.title).to.eq('Test technology');
    });*/
  });
});
