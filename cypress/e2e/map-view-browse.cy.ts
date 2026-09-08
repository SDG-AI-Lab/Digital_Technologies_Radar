describe('map view browse', () => {
  const projectTitle = 'Flood Early Warning System';

  const radarCsv = [
    'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid',
    `Oceania,Melanesia,Fiji,Open Data,2024,Detects floods early,Response,${projectTitle},https://example.com/source,Idea,Partner,UNDP,Mapping,SDG 13,Drones,Flood,Climate,https://example.com/flood.png,map-project-uuid`
  ].join('\n');

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
    }).as('publicMapData');
  });

  it('loads the map and opens a country marker popup', () => {
    cy.visit('http://localhost:3456/#/map-view', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-data-version', 'cypress');
      }
    });

    cy.get('[data-testid="map"]', { timeout: 15000 }).should('be.visible');
    cy.get('.leaflet-container', { timeout: 15000 }).should('be.visible');

    // Circle markers render as SVG paths in Leaflet.
    cy.get('.leaflet-overlay-pane path.leaflet-interactive', {
      timeout: 15000
    })
      .should('have.length.at.least', 1)
      .first()
      .click({ force: true });

    cy.get('.leaflet-popup', { timeout: 10000 }).should('be.visible');
    cy.get('.leaflet-popup').contains(projectTitle).should('be.visible');
  });
});
