describe('edit project', () => {
  const projectUuid = 'edit-project-uuid';

  const radarCsv =
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid\nTest region,Test subregion,Test country,Test data,2026,Description,Response,Test radar item,Source,Idea,Partner,UN host,Use case,SDG,Technology,Climate Change,Theme,https://example.com/image.png,test-id';

  const publicResources: Record<string, unknown> = {
    'public/dataset-version': { data_version: 'cypress' },
    'public/technologies': [{ name: 'GIS' }],
    'public/disaster-types': [{ id: 1, name: 'Climate Change' }],
    'public/locations': [
      {
        country: 'Test country',
        region: 'Test region',
        subregion: 'Test subregion'
      }
    ],
    'public/themes': [{ theme: 'Climate' }],
    'public/data-types': [{ name: 'Spatial' }],
    'public/use-cases': [{ use_case: 'Awareness' }],
    'public/partners': [{ name: 'UNDP' }],
    'public/un-hosts': [{ name: 'UNDP' }],
    'public/radar-csv': radarCsv,
    [`public/details/project/${projectUuid}`]: {
      id: 7,
      uuid: projectUuid,
      title: 'Original project title',
      description: 'Original description',
      source: 'https://example.com/source',
      img_url: 'https://example.com/image.png',
      date_of_implementation: '2024',
      theme: 'Climate',
      sdg: ['SDG 13'],
      data: ['Spatial'],
      use_case: 'Awareness',
      status: 'production',
      disaster_cycles: ['response'],
      partner: ['UNDP'],
      un_host: ['UNDP'],
      country: ['Test country'],
      disaster_type: 'Climate Change',
      technology: ['GIS'],
      region: ['Test region'],
      subregion: ['Test subregion']
    }
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/public/**', (request) => {
      const path = request.url.split('/api/')[1]?.split('?')[0];
      request.reply({
        statusCode: 200,
        body: { data: publicResources[path || ''] ?? [] }
      });
    }).as('publicReferenceData');

    cy.intercept('PUT', `**/api/admin/projects/${projectUuid}`, {
      statusCode: 200,
      body: { ok: true }
    }).as('updateProject');
  });

  it('loads an existing project and updates it', () => {
    cy.visit(`http://localhost:3456/#/projects/${projectUuid}/edit`, {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-current-user-id', 'admin');
        win.localStorage.setItem('drr-access-token', 'cypress-test-token');
        win.localStorage.setItem('drr-data-version', 'cypress');
      }
    });

    cy.contains('Edit Project').should('be.visible');
    cy.get('[data-testid="field-title"]')
      .should('have.value', 'Original project title')
      .clear()
      .type('Updated project title');

    cy.get('[data-testid="project-form-submit"]').click();

    cy.wait('@updateProject').then((interception) => {
      expect(interception.request.method).to.eq('PUT');
      expect(interception.request.body.title).to.eq('Updated project title');
      expect(interception.request.body.description).to.eq(
        'Original description'
      );
      expect(interception.request.body.disaster_type).to.eq('Climate Change');
      expect(interception.response?.statusCode).to.eq(200);
    });
  });
});
