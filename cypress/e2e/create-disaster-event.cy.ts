describe('create disaster event', () => {
  const radarCsv =
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid\nTest region,Test subregion,Test country,Test data,2026,Description,Response,Test radar item,Source,Idea,Partner,UN host,Use case,SDG,Technology,Flood,Theme,https://example.com/image.png,test-id';

  beforeEach(() => {
    cy.intercept('GET', '**/api/public/**', (request) => {
      const path = request.url.split('/api/')[1]?.split('?')[0];
      if (path === 'public/dataset-version') {
        request.reply({
          statusCode: 200,
          body: { data: { data_version: 'cypress' } }
        });
        return;
      }
      if (path === 'public/radar-csv') {
        request.reply({ statusCode: 200, body: { data: radarCsv } });
        return;
      }
      if (path === 'public/locations') {
        request.reply({
          statusCode: 200,
          body: {
            data: [
              {
                country: 'Fiji',
                region: 'Oceania',
                subregion: 'Melanesia'
              }
            ]
          }
        });
        return;
      }
      if (path === 'public/disaster-events') {
        request.reply({ statusCode: 200, body: { data: [] } });
        return;
      }
      request.reply({ statusCode: 200, body: { data: [] } });
    });

    cy.intercept('POST', '**/api/admin/disaster-events', {
      statusCode: 200,
      body: { id: 999 }
    }).as('createDisasterEvent');
  });

  it('creates a disaster event in supabase', () => {
    cy.visit('http://localhost:3456/#/disaster-events', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-current-user-id', 'admin');
        win.localStorage.setItem('drr-access-token', 'cypress-test-token');
        win.localStorage.setItem('drr-data-version', 'cypress');
      }
    });

    cy.get('[data-testid="add-disaster-event"]').click();
    cy.url().should('include', '/disaster-events/new');
    cy.contains('Add Event').should('be.visible');

    cy.get('[data-testid="field-title"]').type('Test disaster event');
    cy.get('[data-testid="field-overview"]').type(
      'Test disaster event overview'
    );
    cy.get('[data-testid="field-summary"]').type('Test summary');
    cy.get('[data-testid="field-img_url"]').type('https://example.com/event.png');
    cy.get('[data-testid="field-source"]').type('https://example.com/source');
    cy.get('[data-testid="field-impact"]').type('Widespread flooding');
    cy.get('[data-testid="field-resources"]').type('Resource pack');
    cy.get('[data-testid="field-solutions"]').type('Emergency kits');
    cy.get('[data-testid="field-contacts"]').type('ops@example.com');

    cy.selectFirstDropdownOption('.eventActionForm');

    cy.get('[data-testid="submit"]').click();

    cy.wait('@createDisasterEvent').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body.title).to.eq('Test disaster event');
      expect(interception.request.body.overview).to.eq(
        'Test disaster event overview'
      );
      expect(interception.request.body.summary).to.eq('Test summary');
      expect(interception.request.body.img_url).to.eq(
        'https://example.com/event.png'
      );
      expect(interception.request.body.source).to.eq(
        'https://example.com/source'
      );
      expect(interception.request.body.impact).to.eq('Widespread flooding');
      expect(interception.request.body.resources).to.eq('{Resource pack}');
      expect(interception.request.body.solutions).to.eq('{Emergency kits}');
      expect(interception.request.body.contacts).to.eq('{ops@example.com}');
      expect(interception.request.body.slug).to.eq('test_disaster_event');
      expect(interception.request.body.countries).to.include('Fiji');
      expect(interception.response?.statusCode).to.eq(200);
    });
  });
});
