describe('delete project and disaster', () => {
  const projectUuid = 'delete-project-uuid';
  const projectTitle = 'Project To Delete';
  const disasterSlug = 'flood';

  const radarCsv =
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid\nTest region,Test subregion,Test country,Test data,2026,Description,Response,Test radar item,Source,Idea,Partner,UN host,Use case,SDG,Technology,Flood,Theme,https://example.com/image.png,test-id';

  const projectDetails = {
    uuid: projectUuid,
    title: projectTitle,
    description: 'Will be deleted',
    source: 'https://example.com/source',
    img_url: 'https://example.com/delete.png',
    status: 'Idea',
    country: ['Fiji'],
    disaster_cycles: ['Response'],
    technology: ['Drones'],
    theme: 'Climate',
    use_case: 'Mapping',
    partner: ['Partner Org'],
    un_host: ['UNDP'],
    data: ['Open Data'],
    sdg: ['SDG 13'],
    disaster_type: 'Flood',
    date_of_implementation: '2024'
  };

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
      if (path === `public/details/project/${projectUuid}`) {
        request.reply({ statusCode: 200, body: { data: projectDetails } });
        return;
      }
      if (path === `public/details/disaster-type/${disasterSlug}`) {
        request.reply({
          statusCode: 200,
          body: {
            data: {
              name: 'Flood',
              slug: disasterSlug,
              description: 'Flood overview',
              source: 'https://example.com/flood',
              img_url: 'https://example.com/flood.png'
            }
          }
        });
        return;
      }
      if (path?.startsWith('public/details/')) {
        request.reply({ statusCode: 200, body: { data: [] } });
        return;
      }
      request.reply({ statusCode: 200, body: { data: [] } });
    });
  });

  it('deletes a project as admin', () => {
    cy.intercept('DELETE', `**/api/admin/projects/${projectUuid}`, {
      statusCode: 200,
      body: { ok: true }
    }).as('deleteProject');

    cy.visit(`http://localhost:3456/#/projects/${projectUuid}`, {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-current-user-id', 'admin');
        win.localStorage.setItem('drr-access-token', 'cypress-test-token');
        win.localStorage.setItem('drr-data-version', 'cypress');
      }
    });

    cy.get('[data-testid="project-details-page"]', { timeout: 15000 }).should(
      'be.visible'
    );
    cy.get('[data-testid="delete-project"]').click();

    cy.wait('@deleteProject').then((interception) => {
      expect(interception.request.method).to.eq('DELETE');
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.url().should('include', '/projects');
    cy.url().should('not.include', projectUuid);
  });

  it('deletes a disaster type as admin', () => {
    cy.intercept('DELETE', `**/api/admin/info/disaster-type/${disasterSlug}`, {
      statusCode: 200,
      body: { ok: true }
    }).as('deleteDisaster');

    cy.visit(`http://localhost:3456/#/disasters/${disasterSlug}`, {
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
                slug: disasterSlug,
                description: 'Flood overview',
                source: 'https://example.com/flood',
                img_url: 'https://example.com/flood.png'
              }
            ]
          })
        );
      }
    });

    cy.contains('Flood', { timeout: 15000 }).should('be.visible');
    cy.get('[data-testid="delete-info"]').click();

    cy.wait('@deleteDisaster').then((interception) => {
      expect(interception.request.method).to.eq('DELETE');
      expect(interception.response?.statusCode).to.eq(200);
    });

    cy.url().should('include', '/disasters');
    cy.url().should('not.include', `/${disasterSlug}`);
  });
});
