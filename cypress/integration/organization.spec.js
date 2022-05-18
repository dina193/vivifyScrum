import data from "../fixtures/data.json";
import organizationModal from "../pages/organizationModal.json";
import loginPage from "../pages/loginPage.json";
import myOrganizations from "../pages/myOrganizationsPage.json";
import modal from "../pages/confirmationModal.json";
import sidebar from "../pages/sidebar.json";
import orgPage from "../pages/organizationPage.json";
import header from "../pages/header.json";

describe("Organization CRUD", () => {
    it("Visit login page and login", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Create organization - no organization name", () => {
        cy.get(myOrganizations.addNewOrgSpan).click();
        cy.get(organizationModal.nextBtn).click({ force: true });
    });

    it("Create organization - name with all spaces", () => {
        cy.get(organizationModal.orgNameInput).type("    ");
        cy.get(organizationModal.nextBtn).click({ force: true });
    });

    it("Create organization - valid organization name", () => {
        cy.get(organizationModal.orgNameInput).type("Cypress org");
        cy.get(organizationModal.nextBtn).click();
        cy.get(organizationModal.nextBtn).click();
        cy.get(modal.okBtn).click();
    });

    it("Update organization name - empty name field", () => {
        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn).click();
        cy.get(orgPage.orgNameInput).clear();
        cy.get(orgPage.updateBtn).eq(0).click({ force: true });
    });

    it("Update organization name - all spaces", () => {
        cy.get(orgPage.orgNameInput).type("    ");
        cy.get(orgPage.updateBtn).eq(0).click({ force: true });
    });

    it("Update organization name - positive", () => {
        cy.get(orgPage.orgNameInput).clear().type("Edit Cypress org");
        cy.get(orgPage.updateBtn).eq(0).click();
    });

    it("Delete organization - wrong password", () => {
        cy.get(orgPage.deleteBtn).click();
        cy.get(modal.confirmActionPassInput).type(data.invalidPassword.wrongPassword);
        cy.get(modal.yesBtn).click();
    });

    it("Delete organization", () => {
        cy.get(modal.confirmActionPassInput).clear().type(data.user.password);
        cy.get(modal.yesBtn).click();
    });

    it("Logout", () => {
        cy.get(sidebar.mainSidebar.myAccountAvatarImg).click();
        cy.get(sidebar.sideMenu.accountOptions.profileBtn).click();
        cy.get(header.logOutBtn).click();
    });

});
