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
    before(() => {
        cy.visit("/login");

        cy.get(loginPage.emailInput).type(data.user.email);

        cy.get(loginPage.passwordInput).type(data.user.password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.url().should("contain", "/my-organizations");

        cy.get(myOrganizations.addNewOrgSpan)
            .should("be.visible")
            .click();

        cy.get(orgModal.orgNameInput).type("Cypress org");

        cy.get(orgModal.nextBtn)
            .should("be.visible")
            .click();

        cy.get(orgModal.nextBtn)
            .should("be.visible")
            .click();

        cy.get(modal.okBtn)
            .should("be.visible")
            .click();
    });

    after(() => {
        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn)
            .should("be.visible")
            .click();

        cy.get(orgPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();

        cy.get(modal.confirmActionPassInput).clear().type(data.user.password);

        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();

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

    it("Create board with no title", () => {
        cy.get(orgPage.addNewBoardDiv)
            .should("be.visible")
            .click();

        cy.get(boardModal.orgDropdownBtn)
            .should("be.visible")
            .click();

        cy.get(boardModal.orgFromDropdownLi)
            .should("be.visible")
            .click();

        cy.get(boardModal.nextBtn).should("be.disabled");
    });

    it("Create board without selected board type", () => {
        cy.get(boardModal.boardTitleInput).type("First board");

        cy.get(boardModal.nextBtn)
            .should("not.be.disabled")
            .click();

        cy.get(boardModal.nextBtn).should("be.disabled");
    });

    it("Create board - scrum type", () => {
        cy.get(boardModal.scrumBoardCheckbox)
            .should("be.visible")
            .click();

        cy.get(boardModal.nextBtn)
            .should("be.enabled")
            .click();

        cy.get(boardModal.nextBtn)
            .should("be.visible")
            .click();

        cy.get(boardModal.nextBtn).click();

        cy.get(sidebar.sideMenu.boardOptions.productBacklogBtn).should("be.visible");
    });

    it("Update board title - empty field", () => {
        cy.get(sidebar.sideMenu.boardOptions.configurationBtn)
            .should("be.visible")
            .click();

        cy.get(boardPage.boardTitleInput).clear();

        cy.get(boardPage.updateBtn).contains("Update").should("be.disabled");

        cy.get(boardPage.validationMsgSpan).eq(0)
            .should("have.text", data.validationMessages.requiredBoardTitle)
            .and("have.css", "color", "rgb(187, 57, 22)");
    });

    it("Update board title - more than 50 characters", () => {
        cy.get(boardPage.boardTitleInput).type("Lorem ipsum dolor sit amet, consectetur erat curae.");

        cy.get(boardPage.validationMsgSpan).eq(0)
            .should("have.text", data.validationMessages.boardTitleMoreChars)
            .and("have.css", "color", "rgb(187, 57, 22)");

        cy.get(boardPage.updateBtn).contains("Update").should("be.disabled");
    });

    it("Update board title - postive", () => {
        cy.get(boardPage.boardTitleInput).clear().type("Edited board");

        cy.get(boardPage.updateBtn).contains("Update")
            .should("not.be.disabled")
            .click();

        cy.get(boardPage.boardTitleInput).should("have.value", "Edited board");
    });

    it("Delete board", () => {
        cy.get(boardPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();

        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();

        cy.get(modal.okBtn)
            .should("be.visible")
            .click();

        cy.get(sidebar.sideMenu.organizationOptions.boardsBtn).should("be.visible");
    });

});
