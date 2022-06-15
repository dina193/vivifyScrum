import data from "../fixtures/data.json";
import Login from "../support/classes/login";
import Board from "../support/classes/board";
import Organization from "../support/classes/organization";

const login = new Login();
const board = new Board();

describe("Board CRUD", () => {
    beforeEach(() => {
        cy.loginViaApi(data.user.email, data.user.password);
    
        cy.createOrgViaApi(data.strings.organizationName);

        cy.visit("/my-organizations");
    });

    afterEach(() => {
        cy.deleteOrgViaApi(data.user.password);

        cy.visit("/my-organizations");

        cy.logout();

        login.assertUserIsLoggedOut();
    });

    it("BOCR-01 Create board with no title", () => {
        board.openOrg();

        board.createBoardFirstStep(data.strings.empty);

        board.assertNextBtnIsDisabled();

        board.closeBoardModal();
    });

    it("BOCR-02 Create board without selected board type", () => {
        board.openOrg();

        board.createBoardSecondStep(data.strings.boardName);

        board.assertNextBtnIsDisabled();

        board.closeBoardModal();
    });

    it("BOCR-03 Create board - scrum type", () => {
        board.openOrg();

        board.createBoard(data.strings.boardName);

        board.assertBoardIsCreated();
    });

    it("BOCR-04 Update board title - empty field", () => {
        cy.createBoardViaApi(data.strings.boardName);

        cy.openCreatedBoard();

        board.updateBoardName(data.strings.empty);

        board.assertValidationMsg(data.validationMessages.requiredBoardTitle);
    });

    it("BOCR-05 Update board title - more than 50 characters", () => {
        cy.createBoardViaApi(data.strings.boardName);

        cy.openCreatedBoard();

        board.updateBoardName(data.strings.moreThan50Characters);

        board.assertValidationMsg(data.validationMessages.boardTitleMoreChars);
    });

    it("BOCR-06 Update board title - postive", () => {
        cy.createBoardViaApi(data.strings.boardName);

        cy.openCreatedBoard();
        board.updateBoardName(data.strings.editedBoardName);

        board.clickUpdateBtn();
    
        board.assertBoardNameIsUpdated(data.strings.editedBoardName);
    });

    it("BOCR-07 Create and delete board via api", () => {
        cy.createBoardViaApi(data.strings.boardName);

        cy.deleteBoardViaApi();
        
    });

});
