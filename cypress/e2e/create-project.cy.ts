describe('create project', () => {
  const publicResources: Record<string, unknown> = {
    'public/dataset-version': { data_version: 'cypress' },
    'public/technologies': [{ name: 'Test technology' }],
    'public/disaster-types': [{ id: 1, name: 'Climate Change' }],
    'public/locations': [
      {
        country: 'Test country',
        region: 'Test region',
        subregion: 'Test subregion'
      }
    ],
    'public/themes': [{ theme: 'Test theme' }],
    'public/data-types': [{ name: 'Test data type' }],
    'public/use-cases': [{ use_case: 'Test use case' }],
    'public/partners': [{ name: 'Test partner' }],
    'public/un-hosts': [{ name: 'Test UN host' }],
    'public/radar-csv':
      'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid\nTest region,Test subregion,Test country,Test data,2026,Description,Response,Test radar item,Source,Idea,Partner,UN host,Use case,SDG,Technology,Climate Change,Theme,https://example.com/image.png,test-id'
  };

  // Set logged in state
  beforeEach(() => {
    window.localStorage.setItem('drr-current-user-id', 'admin');
    window.localStorage.setItem('drr-access-token', 'cypress-test-token');

    // The form test should not depend on a separately deployed Netlify API.
    // It only needs stable public reference data in order to exercise the form.
    cy.intercept('GET', '**/api/public/**', (request) => {
      const path = request.url.split('/api/')[1];
      request.reply({
        statusCode: 200,
        body: { data: publicResources[path] || [] }
      });
    }).as('publicReferenceData');

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
    ).as('createProject');
  });

  it('creates a project in supabase', () => {
    cy.visit('http://localhost:3456/#/projects');
    cy.get('[data-testid="add-project"]').click();
    cy.get('[data-testid="field-title"]').type('Test project');
    cy.get('[data-testid="field-description"]').type(
      'Test project description'
    );
    cy.get('[data-testid="field-source"]').type('Test source');
    cy.get('[data-testid="field-img_url"]').type('Test image url');
    cy.get('[data-testid="field-date_of_implementation"]').type(
      'Test implementation date'
    );

    cy.selectFirstDropdownOption('[data-testid="field-theme"]');
    cy.selectFirstDropdownOption('[data-testid="field-sdg"]');
    cy.selectFirstDropdownOption('[data-testid="field-data"]');
    cy.selectFirstDropdownOption('[data-testid="field-use_case"]');
    cy.get('[data-testid="field-status"]').select('IDEA');

    cy.selectFirstDropdownOption('[data-testid="field-disaster_cycles"]');
    cy.selectFirstDropdownOption('[data-testid="field-partner"]');
    cy.selectFirstDropdownOption('[data-testid="field-un_host"]');
    cy.selectFirstDropdownOption('[data-testid="field-country"]');

    cy.get('[data-testid="field-disaster_type"]').select('Climate Change');

    cy.selectFirstDropdownOption('[data-testid="field-technology"]');

    cy.get('[data-testid="project-form-submit"]').click();

    // Assert that the data was posted to supabase
    cy.wait('@createProject').then((interception) => {
      expect(interception.request.method).to.eq('POST');

      // Check the values we set explicitly
      expect(interception.request.body.date_of_implementation).to.eq(
        'Test implementation date'
      );
      expect(interception.request.body.description).to.eq(
        'Test project description'
      );
      expect(interception.request.body.img_url).to.eq('Test image url');
      expect(interception.request.body.source).to.eq('Test source');
      expect(interception.request.body.title).to.eq('Test project');

      // Check the rest of the values are set
      [
        'country',
        'data',
        'disaster_cycles',
        'disaster_type',
        'partner',
        'region',
        'sdg',
        'status',
        'subregion',
        'technology',
        'theme',
        'un_host',
        'use_case'
      ].forEach((field) =>
        expect(interception.request.body).to.have.property(field)
      );

      // Assert properties of the response, like status code or headers
      expect(interception.response.statusCode).to.eq(200);
    });
  });
});
