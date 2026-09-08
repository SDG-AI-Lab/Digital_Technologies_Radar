describe('admin register user', () => {
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
  });

  it('redirects non-admins away from register', () => {
    cy.visit('http://localhost:3456/#/register', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-access-token', 'user-token');
        win.localStorage.setItem('drr-current-user-id', 'user');
      }
    });

    cy.get('[data-testid="register-page"]').should('not.exist');
    cy.url().should('not.include', '/register');
  });

  it('registers a user as admin', () => {
    cy.intercept('POST', '**/api/auth/users', {
      statusCode: 200,
      body: { user: { id: 'u1', email: 'new@example.com', role: 'user' } }
    }).as('registerUser');

    cy.visit('http://localhost:3456/#/register', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.localStorage.setItem('drr-access-token', 'cypress-test-token');
        win.localStorage.setItem('drr-current-user-id', 'admin');
        win.localStorage.setItem('drr-data-version', 'cypress');
      }
    });

    cy.get('[data-testid="register-page"]').should('be.visible');
    cy.get('[data-testid="register-email"]').type('new@example.com');
    cy.get('[data-testid="register-password"]').type('long-enough-pass');
    cy.get('[data-testid="register-submit"]').click();

    cy.wait('@registerUser').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body).to.deep.include({
        email: 'new@example.com',
        password: 'long-enough-pass',
        role: 'user'
      });
      expect(interception.response?.statusCode).to.eq(200);
    });
  });
});
