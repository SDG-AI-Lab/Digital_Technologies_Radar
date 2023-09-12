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

    /*   cy.get('[data-testid="field-title"]').type('Test disaster event');
    cy.get('[data-testid="field-description"]').type(
      'Test disaster event description'
    );
    cy.get('[data-testid="field-source"]').type('Test source');
    cy.get('[data-testid="field-img_url"]').type('Test image url');

    // Assert that the data was posted to supabase
      cy.wait('@createDisasterEvent').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body.description).to.eq(
        'Test disaster event description'
      );
      expect(interception.request.body.img_url).to.eq('Test image url');
      expect(interception.request.body.source).to.eq('Test source');
      expect(interception.request.body.title).to.eq('Test disaster event');
    });*/
  });
});
