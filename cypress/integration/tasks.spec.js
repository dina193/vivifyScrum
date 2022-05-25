import data from "../fixtures/data.json";
import loginPage from "../pages/loginPage.json";
import myOrgs from "../pages/myOrganizationsPage.json";
import orgModal from "../pages/organizationModal.json";
import orgPage from "../pages/organizationPage.json";
import boardModal from "../pages/boardModal.json";
import modal from "../pages/confirmationModal.json";
import boardPage from "../pages/boardPage.json";
import taskModal from "../pages/taskModal.json";
import sidebar from "../pages/sidebar.json";
import header from "../pages/header.json";

describe("Column and task CRUD", () => {
    before(() => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();
        cy.url().should("contain", "/my-organizations");

        cy.get(myOrgs.addNewOrgSpan)
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

        cy.get(orgPage.addNewBoardDiv)
            .should("be.visible")
            .click();
        cy.get(boardModal.orgDropdownBtn).click();
        cy.get(boardModal.orgFromDropdownLi).click();
        cy.get(boardModal.boardTitleInput).type("First board");
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.scrumBoardCheckbox).click();
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.nextBtn).click();
        cy.get(sidebar.sideMenu.boardOptions.productBacklogBtn).should("be.visible")
    });

    after(() => {
        cy.get(sidebar.sideMenu.boardOptions.configurationBtn)
            .should("be.visible")
            .click();
        cy.get(boardPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();
        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();
        cy.get(modal.okBtn).click();

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

    it("Create new column", () => {
        cy.get(boardPage.addColumnBtn)
            .should("be.visible")
            .click();
        cy.get(boardPage.columnNameInput).type("New column{enter}");
        cy.get(boardPage.columnNameH2).eq(1).should("be.visible");
    });

    it("Create task", () => {
        cy.get(boardPage.addTaskBtn).eq(1).invoke("show").click();
        cy.get(boardPage.taskTitleTextarea).type("First task{enter}");
        cy.get(boardPage.taskCardDiv).contains("First task").should("be.visible");
    });

    it("Edit task title and add description", () => {
        cy.wait(1000);
        cy.get(boardPage.taskCardDiv).contains("First task")
            .should("be.visible")
            .click();
        cy.get(taskModal.taskTitleH2).click();
        cy.get(taskModal.taskTitleInput).clear().type("Edit title");
        cy.get(taskModal.saveTitleBtn)
            .should("be.visible")
            .click();
        cy.get(taskModal.editDescriptionBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();
        cy.get(taskModal.descriptionTextarea).type("Task description");
        cy.get(taskModal.saveDescBtn).click();
    });

    it("Move task to another column", () => {
        cy.get(taskModal.sprintInfoDropdownBtn)
            .should("be.visible")
            .click();
        cy.get(taskModal.columnFromDropdownLi).eq(1)
            .should("contain.text", "New column")
            .click();
    });

    it("Delete task", () => {
        cy.get(taskModal.taskOptionsBtn)
            .should("be.visible")
            .click();
        cy.get(taskModal.deleteTaskLi)
            .should("include.text", "Delete")
            .click();
        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();
    });

    it("Edit column name", () => {
        cy.get(boardPage.columnNameH2).eq(1)
            .should("be.visible")
            .click();
        cy.get(boardPage.editColumnNameInput).clear().type("Column edit{enter}")
        cy.get(boardPage.columnNameH2).eq(1).should("have.text", "Column edit")
    });

    it("Delete column", () => {
        cy.get(boardPage.columnOptionsBtn).eq(2)
            .should("be.visible")
            .click();
        cy.get(boardPage.deleteColumnLi).eq(0)
            .should("include.text", "Delete")
            .click();
        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();
    });

    it("Start sprint", () => {
        cy.get(boardPage.columnOptionsBtn).eq(1)
            .should("be.visible")
            .click();
        cy.get(boardPage.startSprintLi).eq(2)
            .should("include.text", "Start")
            .click();
        cy.get(modal.sprintGoalInput).type("Goals");
        cy.get(modal.yesBtn)
            .should("be.visible")
            .click();
    });

});
