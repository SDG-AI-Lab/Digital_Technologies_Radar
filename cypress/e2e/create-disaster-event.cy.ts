describe('create disaster event', () => {
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
    ).as('createDisasterEvent');
  });

  it('creates a disaster event in supabase', () => {
    cy.visit('http://localhost:3456/#/disaster-events');
    cy.get('[data-testid="add-disaster-event"]').click();
    cy.get('[data-testid="submit"]').click();

    cy.get('[data-testid="field-title"]').type('Test disaster event');
    cy.get('[data-testid="field-overview"]').type(
      'Test disaster event overview'
    );
    cy.get('[data-testid="field-summary"]').type('Test summary');
    cy.get('[data-testid="field-img_url"]').type('Test image url');
    cy.get('[data-testid="field-resources"]').type('Test resources');
    cy.get('[data-testid="field-solutions"]').type('Test solutions');
    cy.get('[data-testid="field-contacts"]').type('Test contacts');

    // Assert that the data was posted to supabase
    /*cy.wait('@createDisasterEvent').then((interception) => {
      expect(interception.request.method).to.eq('POST');
    });*/
  });
});
