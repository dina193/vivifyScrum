import data from "../fixtures/data.json";
import loginPage from "../pages/loginPage.json";
import myOrganizations from "../pages/myOrganizationsPage.json";
import orgModal from "../pages/organizationModal.json";
import orgPage from "../pages/organizationPage.json";
import boardModal from "../pages/boardModal.json";
import modal from "../pages/confirmationModal.json";
import sidebar from "../pages/sidebar.json";
import boardPage from "../pages/boardPage.json";
import header from "../pages/header.json";

describe("Board CRUD", () => {
    it("Visit login page and login", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Create organization", () => {
        cy.get(myOrganizations.addNewOrgSpan).click();
        cy.get(orgModal.orgNameInput).type("Cypress org");
        cy.get(orgModal.nextBtn).click();
        cy.get(orgModal.nextBtn).click();
        cy.get(modal.okBtn).click();
    });

    it("Create board with no title", () => {
        cy.get(orgPage.addNewBoardDiv).click();
        cy.get(boardModal.orgDropdownBtn).click();
        cy.get(boardModal.orgFromDropdownLi).click();
        cy.get(boardModal.nextBtn).click({ force: true });
    });

    it("Create board without selected board type", () => {
        cy.get(boardModal.boardTitleInput).type("First board");
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.nextBtn).click({ force: true });
    });

    it("Create board - scrum type", () => {
        cy.get(boardModal.scrumBoardCheckbox).click();
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.nextBtn).click();
    });

    it("Update board title - empty field", () => {
        cy.get(sidebar.sideMenu.boardOptions.configurationBtn).click();
        cy.get(boardPage.boardTitleInput).clear();
        cy.get(boardPage.updateBtn).click({ force: true });
    });

    it("Update board title - more than 50 characters", () => {
        cy.get(boardPage.boardTitleInput).type("Lorem ipsum dolor sit amet, consectetur erat curae.");
        cy.get(boardPage.updateBtn).click({ force: true });
    });

    it("Update board title - postive", () => {
        cy.get(boardPage.boardTitleInput).clear().type("Edited board");
        cy.get(boardPage.updateBtn).click({ force: true });
    });

    it("Delete board", () => {
        cy.get(boardPage.deleteBtn).click();
        cy.get(modal.yesBtn).click();
        cy.get(modal.okBtn).click();
    });

    it("Delete organization", () => {
        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn).click();
        cy.get(orgPage.deleteBtn).click();
        cy.get(modal.confirmActionPassInput).clear().type(data.user.password);
        cy.get(modal.yesBtn).click();
    });

    it("Logout", () => {
        cy.get(sidebar.mainSidebar.myAccountAvatarImg).click();
        cy.get(sidebar.sideMenu.accountOptions.profileBtn).click();
        cy.get(header.logOutBtn).click();
    });

});
