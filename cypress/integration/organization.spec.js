import data from "../fixtures/data.json";
import organizationModal from "../pages/organizationModal.json";
import loginPage from "../pages/loginPage.json";
import myOrganizations from "../pages/myOrganizationsPage.json";
import modal from "../pages/confirmationModal.json";
import sidebar from "../pages/sidebar.json";
import orgPage from "../pages/organizationPage.json";
import header from "../pages/header.json";


describe("Organization CRUD", () => {
    before(() => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();
        cy.url().should("contain", "/my-organizations");
    });

    after(() => {
        cy.get(sidebar.mainSidebar.myAccountAvatarImg)
            .should("be.visible")
            .click();
        cy.get(sidebar.sideMenu.accountOptions.profileBtn)
            .should("be.visible")
            .click();
        cy.get(header.logOutBtn)
            .should("be.visible")
            .click();
        cy.get(loginPage.loginHeading).should("be.visible");
    });

    it("Create organization - no organization name", () => {
        cy.get(myOrganizations.addNewOrgSpan)
            .should("be.visible")
            .click();
        cy.get(organizationModal.nextBtn).should(($button) => {
            expect($button).to.be.disabled
        });
    });

    it("Create organization - name with all spaces", () => {
        cy.get(organizationModal.orgNameInput).type("    ");
        cy.get(organizationModal.nextBtn).should(($button) => {
            expect($button).to.be.disabled
        });
    });

    it("Create organization - valid organization name", () => {
        cy.get(organizationModal.orgNameInput).type("Cypress org");
        cy.get(organizationModal.nextBtn)
            .should("be.visible")
            .click();
        cy.get(organizationModal.nextBtn)
            .should("be.visible")
            .click();
        cy.get(modal.okBtn)
            .should("be.visible")
            .click();
    });

    it("Update organization name - empty name field", () => {
        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn)
            .should("be.visible")
            .click();
        cy.get(orgPage.orgNameInput).clear();
        cy.get(orgPage.validationMsgSpan)
            .should("be.visible")
            .and("have.text", data.validationMessages.requiredNameField);
        cy.get(orgPage.updateBtn).eq(0).should(($button) => {
            expect($button).to.be.disabled
        });
    });

    it("Update organization name - all spaces", () => {
        cy.get(orgPage.orgNameInput).type("    ");
        cy.get(orgPage.validationMsgSpan).eq(0)
            .should("be.visible")
            .and("have.text", data.validationMessages.requiredNameField);
        cy.get(orgPage.updateBtn).eq(0).should(($button) => {
            expect($button).to.be.disabled
        });
    });

    it("Update organization name - positive", () => {
        cy.get(orgPage.orgNameInput).clear().type("Edit Cypress org");
        cy.get(orgPage.updateBtn).eq(0)
            .should("be.visible")
            .click();
        cy.get(orgPage.validationMsgSpan).should("not.be.visible");
        cy.get(orgPage.orgNameInput).should("have.value", "Edit Cypress org");
    });

    it("Delete organization - wrong password", () => {
        cy.get(orgPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible").click();
        cy.get(modal.confirmActionPassInput).type(data.invalidPassword.wrongPassword);
        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();
        cy.get(modal.confirmActionH4).should("be.visible");
    });

    it("Delete organization", () => {
        cy.get(modal.confirmActionPassInput).clear().type(data.user.password);
        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();
        cy.get(myOrganizations.createdOrgDiv).should("not.exist");
    });

});
