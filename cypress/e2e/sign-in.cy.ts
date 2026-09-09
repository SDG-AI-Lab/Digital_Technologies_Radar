describe('sign in', () => {
  const publicResources: Record<string, unknown> = {
    'public/dataset-version': { data_version: 'cypress' },
    'public/radar-csv':
      'region,subregion,country,data,date_of_implementation,description,disaster_cycle,title,source,status,partner,un_host,use_case,sdg,technology,disaster_type,theme,img_url,uuid\nTest region,Test subregion,Test country,Test data,2026,Description,Response,Test radar item,Source,Idea,Partner,UN host,Use case,SDG,Technology,Climate Change,Theme,https://example.com/image.png,test-id',
    'public/locations': []
  };

  const visitSignIn = (): void => {
    cy.visit('http://localhost:3456/#/sign-in', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        win.sessionStorage.clear();
      }
    });
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

  it('signs in successfully and stores the session', () => {
    cy.intercept('POST', '**/api/auth/sign-in', {
      statusCode: 200,
      body: {
        access_token: 'cypress-access-token',
        user: { role: 'admin' }
      }
    }).as('signIn');

    visitSignIn();

    cy.get('[data-testid="sign-in-page"]').should('be.visible');
    cy.get('[data-testid="sign-in-email"]').type('admin@example.com');
    cy.get('[data-testid="sign-in-password"]').type('secret-password');

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('[data-testid="sign-in-submit"]').click();

    cy.wait('@signIn').then((interception) => {
      expect(interception.request.method).to.eq('POST');
      expect(interception.request.body).to.deep.equal({
        email: 'admin@example.com',
        password: 'secret-password'
      });
    });

    cy.get('@alert').should(
      'have.been.calledWith',
      'Successfully Signed In'
    );

    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('drr-access-token')).to.eq(
        'cypress-access-token'
      );
      expect(win.sessionStorage.getItem('drr-current-user-id')).to.eq('admin');
      expect(win.localStorage.getItem('drr-access-token')).to.eq(null);
      expect(win.localStorage.getItem('drr-current-user-id')).to.eq(null);
    });
  });

  it('shows an error for incorrect credentials', () => {
    cy.intercept('POST', '**/api/auth/sign-in', {
      statusCode: 401,
      body: { error: 'Invalid login credentials' }
    }).as('signInFail');

    visitSignIn();

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('[data-testid="sign-in-email"]').type('user@example.com');
    cy.get('[data-testid="sign-in-password"]').type('wrong-password');
    cy.get('[data-testid="sign-in-submit"]').click();

    cy.wait('@signInFail');
    cy.get('@alert').should(
      'have.been.calledWith',
      'Incorrect credentials, please check and try again'
    );

    cy.window().then((win) => {
      expect(win.sessionStorage.getItem('drr-access-token')).to.eq(null);
      expect(win.sessionStorage.getItem('drr-current-user-id')).to.eq(null);
      expect(win.localStorage.getItem('drr-access-token')).to.eq(null);
      expect(win.localStorage.getItem('drr-current-user-id')).to.eq(null);
    });

    cy.get('[data-testid="sign-in-page"]').should('be.visible');
    cy.get('[data-testid="sign-in-submit"]').should('be.visible');
  });

  it('redirects away when a session already exists', () => {
    cy.visit('http://localhost:3456/#/sign-in', {
      onBeforeLoad(win) {
        win.sessionStorage.setItem('drr-access-token', 'existing-token');
        win.sessionStorage.setItem('drr-current-user-id', 'admin');
      }
    });

    cy.get('[data-testid="sign-in-page"]').should('not.exist');
    cy.url().should('not.include', 'sign-in');
  });

  it('shows Sign Out in the nav after a successful sign-in reload', () => {
    cy.intercept('POST', '**/api/auth/sign-in', {
      statusCode: 200,
      body: {
        access_token: 'cypress-access-token',
        user: { role: 'user' }
      }
    }).as('signIn');

    visitSignIn();

    cy.window().then((win) => {
      cy.stub(win, 'alert').as('alert');
    });

    cy.get('[data-testid="sign-in-email"]').type('user@example.com');
    cy.get('[data-testid="sign-in-password"]').type('secret-password');
    cy.get('[data-testid="sign-in-submit"]').click();
    cy.wait('@signIn');
    cy.get('@alert').should('have.been.called');

    cy.contains('Sign Out', { timeout: 10000 }).should('be.visible');
  });
});
