import data from "../fixtures/data.json";
import Login from "../support/classes/login";
import Board from "../support/classes/board";
import Organization from "../support/classes/organization";

const login = new Login();
const org = new Organization();
const board = new Board();

describe("Board CRUD", () => {
    beforeEach(() => {
        cy.visit("/login");

        login.loginViaUI(data.user.email, data.user.password);
        
        login.assertUserIsLoggedIn();
    
        org.createOrganization(data.strings.organizationName);
    });

    afterEach(() => {
        board.deleteOrg(data.user.password);

        login.logOutViaUI();

        login.assertUserIsLoggedOut();
    });

    it("Create board with no title", () => {
        board.createBoardFirstStep(data.strings.empty);

        board.assertNextBtnIsDisabled();

        board.closeBoardModal();
    });

    it("Create board without selected board type", () => {
        board.createBoardSecondStep(data.strings.boardName);

        board.assertNextBtnIsDisabled();

        board.closeBoardModal();
    });

    it("Create board - scrum type", () => {
        board.createBoard(data.strings.boardName);

        board.assertBoardIsCreated();
    });

    it("Update board title - empty field", () => {
        board.createBoard(data.strings.boardName);

        board.updateBoardName(data.strings.empty);

        board.assertValidationMsg(data.validationMessages.requiredBoardTitle);
    });

    it("Update board title - more than 50 characters", () => {
        board.createBoard(data.strings.boardName);

        board.updateBoardName(data.strings.moreThan50Characters);

        board.assertValidationMsg(data.validationMessages.boardTitleMoreChars);
    });

    it("Update board title - postive", () => {
        board.createBoard(data.strings.boardName);

        board.updateBoardName(data.strings.editedBoardName);

        board.clickUpdateBtn();
    
        board.assertBoardNameIsUpdated(data.strings.editedBoardName);
    });

    it("Delete board", () => {
        board.createBoard(data.strings.boardName);

        board.deleteBoard();
    });

});
