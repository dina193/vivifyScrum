import boardModal from "../../pages/boardModal.json";
import modal from "../../pages/confirmationModal.json";
import sidebar from "../../pages/sidebar.json";
import boardPage from "../../pages/boardPage.json";
import orgPage from "../../pages/organizationPage.json";
import myOrgs from "../../pages/myOrganizationsPage.json";

let boardId;

class Board {
    closeBoardModal() {
        cy.get(boardModal.closeModalBtn).click();
    }

    deleteOrg(password) {
        cy.get(sidebar.mainSidebar.orgFromSidebarSpan).click();

        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn).click({force: true});

        cy.get(boardPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();
        
        cy.get(modal.confirmActionPassInput).type(password);
        cy.get(modal.yesBtn).click();
    }

    createBoardFirstStep(boardName) {
        cy.get(orgPage.addNewBoardDiv).click();

        cy.get(boardModal.orgDropdownBtn).click();

        cy.get(boardModal.orgFromDropdownLi)
            .should("be.visible")
            .click();
        
        cy.get(boardModal.boardTitleInput).type(boardName)
    }

    createBoardSecondStep(boardName) {
        this.createBoardFirstStep(boardName);

        cy.get(boardModal.nextBtn)
            .should("not.be.disabled")
            .click();
    }

    createBoard(boardName) {
        cy.intercept({
            method: "POST",
            url: "https://cypress-api.vivifyscrum-stage.com/api/v2/boards",
        }).as("createBoard");

        this.createBoardSecondStep(boardName);

        cy.get(boardModal.scrumBoardCheckbox).click();

        cy.get(boardModal.nextBtn).click();

        cy.get(boardModal.nextBtn).click();

        cy.get(boardModal.nextBtn).click();

        cy.wait("@createBoard").then(({ response }) => {
            expect(response.statusCode).to.equal(201);
            boardId = response.body.id;
        });
    }

    updateBoardName(editedBoardName) {
        cy.get(sidebar.sideMenu.boardOptions.configurationBtn)
            .should("be.visible")
            .click();

        cy.get(boardPage.boardTitleInput)
            .clear()
            .type(editedBoardName);
    }

    clickUpdateBtn() {
        cy.get(boardPage.updateBtn)
            .contains("Update")
            .click();
    }

    deleteBoard() {
        cy.get(sidebar.sideMenu.boardOptions.configurationBtn).click({ force: true });
        
        cy.get(boardPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();

        cy.get(modal.yesBtn).click();
    }

    assertValidationMsg(message) {
        cy.get(boardPage.validationMsgSpan).eq(0)
            .should("have.text", message)
            .and("have.css", "color", "rgb(187, 57, 22)");
    }

    assertNextBtnIsDisabled() {
        cy.get(boardModal.nextBtn).should("be.disabled");
    }

    assertBoardNameIsUpdated(updatedName) {
        cy.get(boardPage.boardTitleInput).should("have.value", updatedName);
    }

    assertBoardIsCreated() {
        cy.get(sidebar.sideMenu.boardOptions.productBacklogBtn).should("be.visible");
    }

    openOrg() {
        cy.get(myOrgs.createdOrgDiv).click();
        cy.get(modal.okBtn).click();
    }

}

export default Board;
