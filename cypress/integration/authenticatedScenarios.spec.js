describe('Scenarios where authentication is a pre-requirement', () => {
    beforeEach(() => {
        cy.intercept('GET', '**/notes').as('getNotes')
        cy.login()
    })

    it('CRUDs a note', () => {
        const faker = require('faker')
        const noteDescription = faker.lorem.words(4)

        cy.createNote(noteDescription)
        cy.wait('@getNotes')

        const updatedNoteDescription = faker.lorem.words(4)
        const attachFile = true

        cy.editNote(noteDescription, updatedNoteDescription, attachFile) // a note que queremos editar (noteDescription), a nova versão editada (updatedDescription), e dizemos que queremos anexar um arquivo (attachFile)
        cy.wait('@getNotes')

        cy.deleteNote(updatedNoteDescription)
        cy.wait('@getNotes')
    })

    it('successfully submits the form', () => {
        cy.intercept('POST', '**/prod/billing').as('paymentRequest')

        cy.fillSettingsFormAndSubmit()

        cy.wait('@getNotes') // depois que submeter o form, seremos direcionados para a Home, então aguarde a requisição
        cy.wait('@paymentRequest').then(response => { // aguarde a requisição, pega a resposta da requisição e verificque se o state é igual a complete
            expect(response.state).to.equal('Complete')
        })
    })

    it('logs out', () => {
        cy.visit('/')
        cy.wait('@getNotes')

        if (Cypress.config('viewportWidth') < Cypress.env('viewportWidthBreakpoint')) {
            cy.get('.navbar-toggle.collapsed')
                .should('be.visible')
                .click()
        }

        /* ==== Generated with Cypress Studio ==== */
        cy.get('.nav > :nth-child(2) > a').click()
        cy.get('#email').should('be.visible')
        /* ==== End Cypress Studio ==== */
    })
})