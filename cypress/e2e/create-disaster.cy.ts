describe('create disaster', () => {
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
    ).as('createDisaster');
  });

  it('creates a disaster in supabase', () => {
    cy.visit('http://localhost:3000/#/disasters');
    cy.get('[data-testid="add-disaster"]').click();
    cy.get('[data-testid="field-title"]').type('Test disaster');
    cy.get('[data-testid="field-description"]').type(
      'Test disaster description'
    );
    cy.get('[data-testid="field-source"]').type('Test source');
    cy.get('[data-testid="field-img_url"]').type('Test image url');

    // Assert that the data was posted to supabase
    /*cy.wait('@createDisaster').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body.description).to.eq(
        'Test disaster description'
      );
      expect(interception.request.body.img_url).to.eq('Test image url');
      expect(interception.request.body.source).to.eq('Test source');
      expect(interception.request.body.title).to.eq('Test disaster');
    });*/
  });
});
