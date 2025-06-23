import '../support/commands.js';

function firstStep() {
    cy.get('input[id^="checklist-"]').click({multiple: true});
	cy.get('input[id=privacyConsent]').click();
	cy.get('#submitStep1Form button.submitFormButton').click();
}

function addGalleyFile(file) {
    cy.get('a:contains("Add galley")').click();
    cy.wait(2000);
    cy.get('div.pkp_modal_panel').then($modalDiv => {
        cy.wait(3000);
        cy.get('div.pkp_modal_panel input[id^="label-"]').type('PDF', {delay: 0});
        cy.get('div.pkp_modal_panel button:contains("Save")').click();
        cy.wait(2000);
    });
    cy.get('select[id=genreId]').select(file.genre);
    cy.fixture(file.file, 'base64').then(fileContent => {
        cy.get('input[type=file]').upload(
            {fileContent, 'fileName': file.fileName, 'mimeType': 'application/pdf', 'encoding': 'base64'}
        );
    });
    cy.get('button').contains('Continue').click();
    cy.wait(2000);
    for (const field in file.metadata) {
        cy.get('input[id^="' + Cypress.$.escapeSelector(field) + '"]:visible,textarea[id^="' + Cypress.$.escapeSelector(field) + '"]').type(file.metadata[field], {delay: 0});
        cy.get('input[id^="language"').click({force: true});
    }
    cy.get('button').contains('Continue').click();
    cy.get('button').contains('Complete').click();
}

function secondStep(submissionData) {
    for(let file of submissionData.files) {
        addGalleyFile(file);
    }
	cy.get('#submitStep2Form button.submitFormButton').click();
}

function thirdStep(submissionData) {
    cy.get('input[id^="title-en_US-"').type(submissionData.title, {delay: 0});
	cy.get('label').contains('Title').click();
	cy.get('textarea[id^="abstract-en_US"]').then(node => {
		cy.setTinyMceContent(node.attr('id'), submissionData.abstract);
	});
	cy.get('ul[id^="en_US-keywords-"]').then(node => {
		for(let keyword of submissionData.keywords) {
            node.tagit('createTag', keyword);
        }
	});
	cy.waitJQuery();
	cy.get('#submitStep3Form button:contains("Save and continue"):visible').click();
}

function fourthStep() {
    cy.waitJQuery();
	cy.get('form[id=submitStep4Form] button:contains("Finish Submission")').click();
    cy.wait(1000);
	cy.get('button.pkpModalConfirmButton').click();
}

function createNewSubmission(submissionData) {
    cy.get('a:contains("Make a New Submission"), div#myQueue a:contains("New Submission")').click();

    firstStep(submissionData);
    secondStep(submissionData);    
    thirdStep(submissionData);
    fourthStep();
    cy.waitJQuery();
	cy.get('h2:contains("Submission complete")');
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
        cy.get('input[id^="titleAbstract-title-control-en_US"').type(' plus text', {delay: 0});
        cy.contains('button', 'Save').click();
        cy.wait(3000);

        cy.get('#galleys-button').click();
        cy.contains('a', 'PDF');
        cy.get('#pdfEmbedViewer').should('exist');
    });
});