import myOrgs from "../../pages/myOrganizationsPage.json";
import orgModal from "../../pages/organizationModal.json";
import modal from "../../pages/confirmationModal.json";
import orgPage from "../../pages/organizationPage.json";
import sidebar from "../../pages/sidebar.json";
import header from "../../pages/header.json";

class Organization {
    openOrganizationModal() {
        cy.get(myOrgs.addNewOrgSpan)
            .should("be.visible")
            .click();
    }

    createOrgInvalidTry(orgName) {
        this.openOrganizationModal();
        cy.get(orgModal.orgNameInput).type(orgName);
    }

    assertNextBtnIsDisabled() {
        cy.get(orgModal.nextBtn).should(($button) => {
            expect($button).to.be.disabled
        });
    }

    createOrganization(orgName) {
        this.createOrgInvalidTry(orgName);

        cy.get(orgModal.nextBtn).click();

        cy.get(orgModal.nextBtn).click();

        cy.get(modal.okBtn)
            .should("be.visible")
            .click();
    }

    assertOrganizationIsCreated(orgName) {
        cy.get(header.vsLogoBtn).click();
        cy.get(myOrgs.createdOrgDiv).contains(orgName)
            .should("exist");
    }

    editOrgNameInvalidTry(editName) {
        cy.get(myOrgs.createdOrgDiv).click();

        cy.get(modal.okBtn)
            .should("be.visible")
            .click();

        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn)
            .should("be.visible")
            .click();

        cy.get(orgPage.orgNameInput).clear().type(editName);
    }

    assertOrgNameIsNotUpdated(index, message) {
        cy.get(orgPage.validationMsgSpan).eq(index)
            .should("be.visible")
            .and("have.text", message);

        cy.get(orgPage.updateBtn).eq(0).should("be.disabled");
    }

    updateOrgName(updateName) {
        this.editOrgNameInvalidTry(updateName);

        cy.get(orgPage.updateBtn).eq(0)
            .should("not.be.disabled")
            .click();
    }

    assertOrgNameIsUpdated(updatedName) {
        cy.get(orgPage.validationMsgSpan).eq(0).should("not.be.visible");
        cy.get(orgPage.orgNameInput).should("have.value", updatedName);
    }

    deleteOrganization(password) {
        cy.get(myOrgs.createdOrgDiv).click();

        cy.get(modal.okBtn).click();

        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn)
            .should("be.visible")
            .click();

        cy.get(orgPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();

        cy.get(modal.confirmActionPassInput).type(password);

        cy.get(modal.yesBtn).click();
    }

    assertOrgIsNotDeleted() {
        cy.get(modal.confirmActionH4).should("be.visible");
    }

    assertOrgIsDeleted() {
        cy.get(myOrgs.createdOrgDiv).should("not.exist");
    }
}

export default Organization;
