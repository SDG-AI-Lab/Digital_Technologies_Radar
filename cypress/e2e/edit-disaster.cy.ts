describe('edit disaster', () => {
  const slug = 'flood';
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
      request.reply({ statusCode: 200, body: { data: [] } });
    });

    cy.intercept('PUT', `**/api/admin/info/disaster-type/${slug}`, {
      statusCode: 200,
      body: { ok: true }
    }).as('updateDisaster');
  });

  it('loads a disaster from cache and updates it', () => {
    cy.visit(`http://localhost:3456/#/disasters/${slug}/edit`, {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-current-user-id', 'admin');
        win.localStorage.setItem('drr-access-token', 'cypress-test-token');
        win.localStorage.setItem('drr-data-version', 'cypress');
        win.localStorage.setItem(
          'drr-disaster-types',
          JSON.stringify({
            version: 'cypress',
            data: [
              {
                name: 'Flood',
                slug,
                description: 'Original flood description',
                source: 'https://example.com/flood',
                img_url: 'https://example.com/flood.png'
              }
            ]
          })
        );
      }
    });

    cy.contains('EDIT DISASTER').should('be.visible');
    cy.get('[data-testid="field-title"]').should('have.value', 'Flood');
    cy.get('[data-testid="field-description"]')
      .clear()
      .type('Updated flood description');

    cy.get('[data-testid="submit"]').click();

    cy.wait('@updateDisaster').then((interception) => {
      expect(interception.request.method).to.eq('PUT');
      expect(interception.request.body.name).to.eq('Flood');
      expect(interception.request.body.description).to.eq(
        'Updated flood description'
      );
      expect(interception.request.body.slug).to.eq('flood');
      expect(interception.response?.statusCode).to.eq(200);
    });
  });
});
