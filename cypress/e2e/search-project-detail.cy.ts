describe('search to project detail', () => {
  const projectUuid = 'search-project-uuid';
  const projectTitle = 'Flood Early Warning System';

  const radarCsv = [
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid',
    `Oceania,Melanesia,Fiji,Open Data,2024,Detects floods early with sensors,Response,${projectTitle},https://example.com/source,Idea,Partner Org,UNDP,Mapping,SDG 13,Drones,Flood,Climate,https://example.com/flood.png,${projectUuid}`,
    'Africa,Eastern Africa,Kenya,Open Data,2023,Unrelated drought tool,Preparedness,Drought Monitor,https://example.com/other,Prototype,WFP,UNDP,Monitoring,SDG 2,Sensors,Drought,Climate,https://example.com/drought.png,other-uuid'
  ].join('\n');

  const publicResources: Record<string, unknown> = {
    'public/dataset-version': { data_version: 'cypress' },
    'public/radar-csv': radarCsv,
    'public/locations': []
  };

  const projectDetails = {
    uuid: projectUuid,
    title: projectTitle,
    description: 'Detects floods early with sensors',
    source: 'https://example.com/source',
    img_url: 'https://example.com/flood.png',
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

      if (path?.startsWith('public/details/')) {
        request.reply({
          statusCode: 200,
          body: { data: projectDetails }
        });
        return;
      }

      const payload = publicResources[path || ''] ?? [];
      request.reply({
        statusCode: 200,
        body: { data: payload }
      });
    }).as('publicData');
  });

  it('searches for a project and opens its detail page', () => {
    cy.visit('http://localhost:3456/#/search', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });

    cy.contains(projectTitle, { timeout: 15000 }).should('be.visible');

    cy.get('[data-testid="search-input"]').clear().type('Flood Early');
    cy.contains('Found 1 out of 2').should('be.visible');
    cy.contains(projectTitle).should('be.visible');
    cy.contains('Drought Monitor').should('not.exist');

    cy.get('[data-testid="search-more"]').click();
    cy.contains('Description:').should('be.visible');
    cy.contains('Detects floods early with sensors').should('be.visible');

    cy.get('[data-testid="search-project-link"]').click();

    cy.url().should('include', `/projects/${projectUuid}`);
    cy.get('[data-testid="project-details-page"]').should('be.visible');
    cy.get('[data-testid="project-details-title"]').should(
      'have.text',
      projectTitle
    );
    cy.contains('SEE PROJECT SOURCE').should('be.visible');
  });
});
