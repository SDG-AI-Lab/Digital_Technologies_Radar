describe('edit disaster event', () => {
  const eventUuid = 'edit-event-uuid';
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
      request.reply({ statusCode: 200, body: { data: [] } });
    });

    cy.intercept('PUT', `**/api/admin/disaster-events/${eventUuid}`, {
      statusCode: 200,
      body: { ok: true }
    }).as('updateDisasterEvent');
  });

  it('loads a disaster event from cache and updates it', () => {
    cy.visit(`http://localhost:3456/#/disaster-events/${eventUuid}/edit`, {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-current-user-id', 'admin');
        win.localStorage.setItem('drr-access-token', 'cypress-test-token');
        win.localStorage.setItem('drr-data-version', 'cypress');
        win.localStorage.setItem(
          'drr-disaster-events',
          JSON.stringify({
            version: 'cypress',
            data: [
              {
                uuid: eventUuid,
                title: 'Original cyclone event',
                overview: 'Overview text',
                summary: 'Summary text',
                img_url: 'https://example.com/event.png',
                source: 'https://example.com/source',
                impact: 'Widespread flooding',
                resources: 'Resource pack',
                solutions: 'Emergency kits',
                contacts: 'ops@example.com',
                help_needed: 0,
                how_to_help: '',
                countries: ['Fiji']
              }
            ]
          })
        );
      }
    });

    cy.contains('Edit Event').should('be.visible');
    cy.get('[data-testid="field-title"]')
      .should('have.value', 'Original cyclone event')
      .clear()
      .type('Updated cyclone event');

    cy.get('[data-testid="submit"]').click();

    cy.wait('@updateDisasterEvent').then((interception) => {
      expect(interception.request.method).to.eq('PUT');
      expect(interception.request.body.title).to.eq('Updated cyclone event');
      expect(interception.request.body.overview).to.eq('Overview text');
      expect(interception.request.body.slug).to.eq('updated_cyclone_event');
      expect(interception.response?.statusCode).to.eq(200);
    });
  });
});
