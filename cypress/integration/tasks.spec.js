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
    it("Visit login page and login", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Create organization", () => {
        cy.get(myOrgs.addNewOrgSpan).click();
        cy.get(orgModal.orgNameInput).type("Cypress org");
        cy.get(orgModal.nextBtn).click();
        cy.get(orgModal.nextBtn).click();
        cy.get(modal.okBtn).click();
    });

    it("Create board", () => {
        cy.get(orgPage.addNewBoardDiv).click();
        cy.get(boardModal.orgDropdownBtn).click();
        cy.get(boardModal.orgFromDropdownLi).click();
        cy.get(boardModal.boardTitleInput).type("First board");
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.scrumBoardCheckbox).click();
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.nextBtn).click();
        cy.get(boardModal.nextBtn).click();
    });

    it("Create new column", () => {
        cy.get(boardPage.addColumnBtn).click();
        cy.get(boardPage.columnNameInput).type("New column{enter}");
    });

    it("Create task", () => {
        cy.get(boardPage.addTaskBtn).eq(1).invoke("show").click();
        cy.get(boardPage.taskTitleTextarea).type("First task{enter}");
    });

    it("Edit task title and add description", () => {
        cy.wait(1000);
        cy.get(boardPage.taskCardDiv).eq(1).click();
        cy.get(taskModal.taskTitleH2).click();
        cy.get(taskModal.taskTitleInput).clear().type("Edit title");
        cy.get(taskModal.saveTitleBtn).click();
        cy.get(taskModal.editDescriptionBtn).click();
        cy.get(taskModal.descriptionTextarea).type("Task description");
        cy.get(taskModal.saveDescBtn).click();
    });

    it("Move task to another column", () => {
        cy.get(taskModal.sprintInfoDropdownBtn).click();
        cy.get(taskModal.columnFromDropdownLi).eq(1).click();
    });

    it("Delete task", () => {
        cy.get(taskModal.taskOptionsBtn).click();
        cy.get(taskModal.deleteTaskLi).click();
        cy.get(modal.yesBtn).click();
    });

    it("Edit column name", () => {
        cy.get(boardPage.columnNameH2).eq(1).click();
        cy.get(boardPage.editColumnNameInput).clear().type("Column edit{enter}")
    });

    it("Delete column", () => {
        cy.get(boardPage.columnOptionsBtn).eq(2).click();
        cy.get(boardPage.deleteColumnLi).eq(0).click();
        cy.get(modal.yesBtn).click();
    });

    it("Start sprint", () => {
        cy.get(boardPage.columnOptionsBtn).eq(1).click();
        cy.get(boardPage.startSprintLi).eq(2).click();
        cy.get(modal.sprintGoalInput).type("Goals");
        cy.get(modal.yesBtn).click();
    });

    it("Delete board", () => {
        cy.get(sidebar.sideMenu.boardOptions.configurationBtn).click();
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
