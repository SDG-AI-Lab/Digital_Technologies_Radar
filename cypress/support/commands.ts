/// <reference types="cypress" />

// Command for selecting a value in our custom dropowns
Cypress.Commands.add('selectFirstDropdownOption', (selector) => {
  cy.get(selector + ' .rmsc > .dropdown-container').click();

  cy.get(
    selector +
      ' .rmsc > .dropdown-container > .dropdown-content input[placeholder="Search"]'
  ).type('{downArrow}{enter}{esc}');
});
