import '../support/commands.js';

describe('Embed PDF viewer', function () {
	it('Checks presence of PDF embed viewer at workflows', function () {
		cy.login('dbarnes', null, 'publicknowledge');
        cy.findSubmission('archive', 'Arguments About Arguments');

        cy.get('#publication-button').click();
        cy.get('#galleys-button').click();

        cy.contains('a', 'PDF');
        cy.get('#pdfEmbedViewer').should('exist');
	});
});