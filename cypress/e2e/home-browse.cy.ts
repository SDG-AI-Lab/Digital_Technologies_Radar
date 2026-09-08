describe('home browse', () => {
  const projectUuid = 'home-project-uuid';
  const projectTitle = 'Home Featured Project';
  const techSlug = 'drones';
  const disasterSlug = 'flood';

  const radarCsv =
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid\nTest region,Test subregion,Test country,Test data,2026,Description,Response,Test radar item,Source,Idea,Partner,UN host,Use case,SDG,Technology,Flood,Theme,https://example.com/image.png,test-id';

  const projectDetails = {
    uuid: projectUuid,
    title: projectTitle,
    description: 'Featured from the home page',
    source: 'https://example.com/source',
    img_url: 'https://example.com/home-project.png',
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
      if (path === 'public/home-projects') {
        // HomePage drops the first item via slice(1)
        request.reply({
          statusCode: 200,
          body: {
            data: [
              { uuid: 'discarded', name: 'Discarded' },
              {
                uuid: projectUuid,
                name: projectTitle,
                img_url: 'https://example.com/home-project.png'
              }
            ]
          }
        });
        return;
      }
      if (path === 'public/home-technologies') {
        request.reply({
          statusCode: 200,
          body: {
            data: [
              {
                id: 1,
                name: 'Drones',
                slug: techSlug,
                img_url: 'https://example.com/drones.png'
              }
            ]
          }
        });
        return;
      }
      if (path === 'public/home-disaster-types') {
        request.reply({
          statusCode: 200,
          body: {
            data: [
              {
                id: 1,
                name: 'Flood',
                slug: disasterSlug,
                img_url: 'https://example.com/flood.png'
              }
            ]
          }
        });
        return;
      }
      if (path === 'public/home-help-needed' || path === 'public/home-recent-events') {
        request.reply({ statusCode: 200, body: { data: [] } });
        return;
      }
      if (path?.startsWith('public/details/')) {
        request.reply({
          statusCode: 200,
          body: { data: projectDetails }
        });
        return;
      }

      request.reply({ statusCode: 200, body: { data: [] } });
    }).as('publicHomeData');
  });

  it('shows home sections and opens a featured project', () => {
    cy.visit('http://localhost:3456/#/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-data-version', 'cypress');
      }
    });

    cy.get('.homePage').should('be.visible');
    cy.get('.maintitle').should(
      'contain.text',
      'Frontier Technology Radar for Disaster Risk Reduction'
    );
    cy.get('.projectTitle').contains('Projects').should('be.visible');
    cy.get('.projectSections').contains(projectTitle).should('be.visible');
    cy.get('.projectTitle').contains('Technologies').should('be.visible');
    cy.get('.projectSections').contains('Drones').should('be.visible');
    cy.get('.projectTitle').contains('Disasters').should('be.visible');
    cy.get('.projectSections').contains('Flood').should('be.visible');

    cy.get('.projectSections').contains(projectTitle).click();
    cy.url().should('include', `/projects/${projectUuid}`);
    cy.get('[data-testid="project-details-page"]').should('be.visible');
    cy.get('[data-testid="project-details-title"]').should(
      'have.text',
      projectTitle
    );
  });

  it('launches the radar from the home hero', () => {
    cy.visit('http://localhost:3456/#/', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-data-version', 'cypress');
      }
    });

    cy.get('.launchBtnDesktop').click();
    cy.url().should('include', '/projectsRadar');
  });
});
