describe('User Flows on IMMUNE Films App', () => {
  it('should allow the user to visit the homepage and navigate to the films list', () => {
    cy.visit('/');
    cy.wait(2000);
    cy.log('Página cargada');
    cy.get('header').should('be.visible');
    cy.contains('Feel your films', { matchCase: false }).should('be.visible');
    cy.get('a').contains('Films').click();
    cy.url().should('include', '/list');
  });

  it('should allow the user to navigate to register page from homepage', () => {
    cy.visit('/');
    cy.contains('create your account here').click();
    cy.url().should('include', '/register');
  });

  it('should allow the user to navigate to login page', () => {
    cy.visit('/');
    cy.contains('Login').click();
    cy.url().should('include', '/login');
  });

  it('should navigate to a specific film detail when clicking on a film', () => {
    cy.visit('/list');
    cy.get('.film-card').first().click();
    cy.url().should('include', '/films');
  });
});
