describe('admin review and approve project', () => {
  const pendingUuid = 'pending-project-uuid';
  const pendingTitle = 'Pending Sensor Network';

  const pendingProject = {
    id: 42,
    uuid: pendingUuid,
    title: pendingTitle,
    description: 'A project awaiting approval',
    img_url: 'https://example.com/pending.png',
    source: 'https://example.com/source',
    status: 'Idea',
    country: ['Fiji'],
    disaster_cycles: ['Response'],
    technology: ['Sensors'],
    theme: 'Climate',
    use_case: 'Monitoring',
    partner: ['Partner Org'],
    un_host: ['UNDP'],
    data: ['Open Data'],
    sdg: ['SDG 13'],
    disaster_type: 'Flood',
    date_of_implementation: '2024',
    approved: false
  };

  const radarCsv =
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid\nOceania,Melanesia,Fiji,Open Data,2024,Desc,Response,Radar Item,Source,Idea,Partner,UNDP,Use,SDG 13,Tech,Flood,Theme,https://example.com/i.png,radar-id';

  beforeEach(() => {
    cy.intercept('GET', '**/api/public/**', (request) => {
      const path = request.url.split('/api/')[1]?.split('?')[0];
      if (path === 'public/radar-csv') {
        request.reply({ statusCode: 200, body: { data: radarCsv } });
        return;
      }
      if (path === 'public/dataset-version') {
        request.reply({
          statusCode: 200,
          body: { data: { data_version: 'cypress' } }
        });
        return;
      }
      request.reply({ statusCode: 200, body: { data: [] } });
    });
  });

  it('redirects non-admins away from the review page', () => {
    cy.visit('http://localhost:3456/#/projects/review', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-access-token', 'user-token');
        win.localStorage.setItem('drr-current-user-id', 'user');
      }
    });

    cy.get('[data-testid="review-projects-page"]').should('not.exist');
    cy.url().should('not.include', '/projects/review');
  });

  it('lists pending projects, opens review modal, and approves', () => {
    let pendingCalls = 0;

    cy.intercept('GET', '**/api/admin/projects/pending', (request) => {
      pendingCalls += 1;
      request.reply({
        statusCode: 200,
        body: {
          data: pendingCalls === 1 ? [pendingProject] : []
        }
      });
    }).as('pendingProjects');

    cy.intercept('POST', '**/api/admin/projects/approve', {
      statusCode: 200,
      body: { ok: true }
    }).as('approveProject');

    cy.visit('http://localhost:3456/#/projects/review', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-access-token', 'admin-token');
        win.localStorage.setItem('drr-current-user-id', 'admin');
      }
    });

    cy.wait('@pendingProjects');
    cy.get('[data-testid="review-projects-page"]').should('be.visible');
    cy.contains(pendingTitle).should('be.visible');

    cy.get('[data-testid="review-project-cta"]').click();
    cy.contains(pendingTitle).should('be.visible');
    cy.get('[data-testid="approve-project"]').should('be.visible');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('[data-testid="approve-project"]').click();

    cy.wait('@approveProject').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body).to.deep.equal({ uuid: pendingUuid });
      expect(interception.request.headers).to.have.property(
        'authorization',
        'Bearer admin-token'
      );
    });

    cy.get('@alert').should(
      'have.been.calledWith',
      'Project approved successfully'
    );

    // approveProject reloads the page; second pending fetch is empty
    cy.get('[data-testid="review-projects-empty"]', { timeout: 15000 }).should(
      'be.visible'
    );
  });
});
