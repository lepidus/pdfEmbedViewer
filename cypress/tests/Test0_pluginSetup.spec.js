
describe('Plugin setup', function () {
	it('Does plugin setup', function () {
		cy.login('dbarnes', null, 'publicknowledge');
		cy.contains('a', 'Website').click();

		cy.waitJQuery();
		cy.get('#plugins-button').click();

		cy.get('input[id^=select-cell-pdfembedviewerplugin]').check();
		cy.get('input[id^=select-cell-pdfembedviewerplugin]').should('be.checked');
	});
});