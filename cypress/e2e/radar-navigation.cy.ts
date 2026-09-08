describe('radar quadrant and blip navigation', () => {
  const responseTitle = 'Flood Early Warning System';
  const preparednessTitle = 'Community Preparedness Kit';

  // Status/Maturity values and Disaster Cycle values must match radar orders.
  const radarCsv = [
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid',
    `Oceania,Melanesia,Fiji,Open Data,2024,Detects floods early,Response,${responseTitle},https://example.com/source,Idea,Partner,UNDP,Mapping,SDG 13,Drones,Flood,Climate,https://example.com/flood.png,response-uuid`,
    `Africa,Eastern Africa,Kenya,Open Data,2023,Preparedness toolkit,Preparedness,${preparednessTitle},https://example.com/prep,Prototype,WFP,UNDP,Training,SDG 11,Sensors,Drought,Climate,https://example.com/prep.png,prep-uuid`
  ].join('\n');

  const publicResources: Record<string, unknown> = {
    'public/dataset-version': { data_version: 'cypress' },
    'public/radar-csv': radarCsv,
    'public/locations': []
  };

  beforeEach(() => {
    cy.intercept('GET', '**/api/public/**', (request) => {
      const path = request.url.split('/api/')[1]?.split('?')[0];
      const payload = publicResources[path || ''] ?? [];
      request.reply({
        statusCode: 200,
        body: { data: payload }
      });
    }).as('publicData');
  });

  const visitRadar = (): void => {
    cy.visit('http://localhost:3456/#/radar', {
      onBeforeLoad(win) {
        win.localStorage.clear();
      }
    });
  };

  it('loads the radar and opens a blip in the Project tab', () => {
    visitRadar();

    cy.get('[data-testid="waiting-for-radar"]', { timeout: 15000 }).should(
      'not.exist'
    );
    cy.get('[data-testid="radar-component"]').should('be.visible');
    cy.get('[data-testid="stages-tab"]').should('be.visible');

    // Expand Response quadrant → Idea horizon → blip, then open Project tab
    cy.contains('.MuiAccordionSummary-content', 'Response', {
      timeout: 15000
    }).click();
    cy.contains('.MuiAccordionSummary-content', 'Idea').click();
    cy.contains('.MuiAccordionSummary-content', responseTitle).click();
    cy.get('[data-testid="blip-more"]').click();

    cy.get('[data-testid="project-tab"]').should('have.attr', 'aria-selected', 'true');
    cy.get('[data-testid="project-panel"]').within(() => {
      cy.contains(responseTitle).should('be.visible');
      cy.contains('Detects floods early').should('be.visible');
    });
  });

  it('navigates to a quadrant view and returns via Back', () => {
    visitRadar();

    cy.get('[data-testid="waiting-for-radar"]', { timeout: 15000 }).should(
      'not.exist'
    );

    // Quadrant labels are rendered in the radar SVG; click the Response label.
    cy.get('#radar-container', { timeout: 15000 })
      .contains(/response/i)
      .click({ force: true });

    cy.url({ timeout: 10000 }).should('include', 'quadrant');
    cy.get('[data-testid="quadrant-view"]').should('be.visible');
    cy.get('[data-testid="quadrant-title"]').should('contain.text', 'RESPONSE');

    cy.get('[data-testid="back-button"]').click({ force: true });
    cy.url().should('include', '/radar');
    cy.url().should('not.include', 'quadrant');
    cy.get('[data-testid="radar-component"]').should('be.visible');
  });
});
