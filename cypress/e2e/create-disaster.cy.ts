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
    cy.visit('http://localhost:3456/#/disasters');
    cy.get('[data-testid="add-disaster"]').click();
    cy.get('[data-testid="field-title"]').type('Test disaster');
    cy.get('[data-testid="field-description"]').type(
      'Test disaster description'
    );
    cy.get('[data-testid="field-source"]').type('Test source');
    cy.get('[data-testid="field-img_url"]').type('Test image url');

    cy.get('[data-testid="submit"]').click();

    // Assert that the data was posted to supabase
    cy.wait('@createDisaster').then((interception) => {});
  });
});
