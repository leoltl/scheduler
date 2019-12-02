describe('appointments', () => {
  beforeEach(() => cy.request('GET', '/api/debug/reset'));

  it('should book an interview', () => {
    cy.visit('/');
    cy.contains('Monday');
    cy.get('[alt=Add]')
      .first()
      .click();
    cy.get('[data-testid=student-name-input]').type('Lydia Miller-Jones');
    cy.get('[alt="Sylvia Palmer"]')
      .first()
      .click();

    cy.contains('Save').click();
    cy.contains('.appointment__card--show', 'Lydia Miller-Jones');
    cy.contains('.appointment__card--show', 'Sylvia Palmer');
  });

  it('should edit an interview', () => {
    cy.visit('/');
    cy.contains('Monday');
    cy.get('[alt=Edit]')
      .first()
      .click({ force: true });
    cy.get('[alt="Tori Malcolm"]')
      .first()
      .click();

    cy.contains('Save').click();
    cy.contains('.appointment__card--show', 'Archie Cohen');
    cy.contains('.appointment__card--show', 'Tori Malcolm');
  });

  it('should cancel an interview', () => {
    cy.get('[alt=Delete]')
      .first()
      .click({ force: true });
    cy.contains('button', 'Confirm').click();

    cy.contains('Deleting your appointment...').should('exist');
    cy.contains('Deleting your appointment...').should('not.exist');
    cy.contains('.appointment__card--show', 'Archie Cohen').should('not.exist');
  });
});
