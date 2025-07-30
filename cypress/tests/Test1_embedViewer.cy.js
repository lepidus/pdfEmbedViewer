import '../support/commands.js';

function beginSubmission(submissionData) {
    cy.get('input[name="locale"][value="en"]').click();
    cy.setTinyMceContent('startSubmission-title-control', submissionData.title);
    cy.get('input[name="submissionRequirements"]').check();
    cy.get('input[name="privacyConsent"]').check();

    cy.contains('button', 'Begin Submission').click();
}

function detailsStep(submissionData) {
    cy.setTinyMceContent('titleAbstract-abstract-control-en', submissionData.abstract);
    submissionData.keywords.forEach(keyword => {
        cy.get('#titleAbstract-keywords-control-en').type(keyword, {delay: 0});
        cy.get('#titleAbstract-keywords-control-en').type('{enter}', {delay: 0});
    });
    cy.contains('button', 'Continue').click();
}

function filesStep(submissionData) {
    cy.addSubmissionGalleys(submissionData.files);
    cy.contains('button', 'Continue').click();
}

function createNewSubmission(submissionData) {
    cy.get('div#myQueue a:contains("New Submission")').click();

    beginSubmission(submissionData);
    detailsStep(submissionData);
    filesStep(submissionData);    
    cy.contains('button', 'Continue').click();
    cy.contains('button', 'Continue').click();
    cy.contains('button', 'Submit').click();
    cy.get('.modal__panel:visible').within(() => {
        cy.contains('button', 'Submit').click();
    });
}

describe('Embed PDF viewer', function () {
    let submissionData;

    before(function () {
		submissionData = {
			title: 'New designs for aircraft engines',
			abstract: 'An example abstract.',
			keywords: ['aircraft', 'engines', 'mechanical design'],
            files: [{
                'file': 'dummy.pdf',
                'fileName': 'design_aircraft_engines.pdf',
                'genre': Cypress.env('defaultGenre')
            }]
		}
	});
    
    it('Creates new submission with PDF', function () {
        cy.login('ckwantes', null, 'publicknowledge');
        createNewSubmission(submissionData);
    });
    it('Checks presence of PDF embed viewer at workflow', function () {
		cy.login('dbarnes', null, 'publicknowledge');
        cy.findSubmission('active', submissionData.title);

        cy.get('#publication-button').click();
        cy.get('#galleys-button').click();

        cy.contains('a', 'PDF');
        cy.get('#pdfEmbedViewer').should('exist');
	});
    it('PDF embed viewer is not affected by metadata editing', function () {
        cy.login('dbarnes', null, 'publicknowledge');
        cy.findSubmission('active', submissionData.title);

        cy.get('#publication-button').click();
        cy.get('#galleys-button').click();
        cy.wait(3000);
        cy.contains('a', 'PDF');
        cy.get('#pdfEmbedViewer').should('exist');

        cy.get('#titleAbstract-button').click();
        cy.get('input[id^="titleAbstract-title-control-en"').type(' plus text', {delay: 0});
        cy.contains('button', 'Save').click();
        cy.wait(3000);

        cy.get('#galleys-button').click();
        cy.contains('a', 'PDF');
        cy.get('#pdfEmbedViewer').should('exist');
    });
});