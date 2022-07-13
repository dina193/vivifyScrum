import data from "../../fixtures/data.json"
import user from "../../api/user"
import organization from "../../api/organization"
import board from "../../api/board"

describe("APIB - Board CRUD", () => {
    let token
    let organizationData
    let boardData
    let allBoards

    before(() => {
        user.login({testName: Cypress.currentTest.title}).then((response) => {
            token = response.token
            
            organization.post({
                name: data.strings.organizationName,
                token: token,
                statusCode: 201,
                testName: Cypress.currentTest.title
            }).then((response) => {
                organizationData = response
            })
        })
    })

    after(() => {
        organization.delete({
            token: token,
            orgId: organizationData.id,
            testName: Cypress.currentTest.title
        })
    })

    it("APIB - 01 - negative - title with more than 50 characters", () => {
        board.post({
            name: data.strings.moreThan50Characters,
            token: token,
            statusCode: 400,
            boardType: "scrum_board",
            orgId: organizationData.id,
            testName: Cypress.currentTest.title
        })
    })

    it("APIB - 02 - negative - sql inject", () => {
        board.post({
            name: "{$",
            token: token,
            statusCode: 400,
            boardType: "scrum_board",
            orgId: organizationData.id,
            testName: Cypress.currentTest.title
        })
    })

    it("APIB - 03 - positive", () => {
        board.post({
            name: data.strings.boardName,
            token: token,
            statusCode: 201,
            boardType: "scrum_board",
            orgId: organizationData.id,
            testName: Cypress.currentTest.title
        }).then((response) => {
            boardData = response
        })
    })

    it("APIB - 04 - update negative - empty name", () => {
        board.update({
            updatedName: data.strings.emptyTitle,
            token: token,
            statusCode: 400,
            boardId: boardData.id,
            boardCode: boardData.code,
            testName: Cypress.currentTest.title
        })
    })

    it("APIB - 05 - update negative - white spaces", () => {
        board.update({
            updatedName: data.strings.multipleSpaces,
            token: token,
            statusCode: 400,
            boardId: boardData.id,
            boardCode: boardData.code,
            testName: Cypress.currentTest.title
        })
    })

    it("APIB - 06 - update positive", () => {
        board.update({
            updatedName: data.strings.editedBoardName,
            token: token,
            statusCode: 200,
            boardId: boardData.id,
            boardCode: boardData.code,
            testName: Cypress.currentTest.title
        })
    })

    it("APIB - 07 - get boards from one organization", () => {
        board.get({
            token: token,
            orgId: organizationData.id,
            testName: Cypress.currentTest.title
        }).then((response) => {
            allBoards = response
        })
    })

    it("APIB - 08 - delete all board", () => {
       allBoards.forEach((brd) => {
           board.delete({
               token: token,
               boardId: brd.id,
               testName: Cypress.currentTest.title
           }) 
        })
    })
})
