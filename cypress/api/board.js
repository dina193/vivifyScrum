import data from "../fixtures/data.json";
import consoleColor from "../support/consoleColor";

module.exports = {
    get({token = "", statusCode = 200, orgId = "", testName = ""}) {
        return cy.request({
            failOnStatusCode: false,
            method: "GET",
            url: `${data.apiBaseUrl}/api/v2/organizations/${orgId}/boards-data`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            typeof response.status !== "undefined" && response.status === statusCode 
                ? consoleColor.log(`${testName} -- PASS`, "success") 
                : consoleColor.log(`${testName} -- FAIL \n ${JSON.stringify(response)}`, "error");
            expect(response.status).to.eql(statusCode);
            return response.body
        });
    },

    post({name = "", token = "", statusCode = "", boardType = "", orgId = "", testName = ""}) {
        return cy.request({
            failOnStatusCode: false,
            method: "POST",
            url: `${data.apiBaseUrl}/api/v2/boards`,
            body: {
                name: name,
                type: boardType,
                organization_id: orgId
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            typeof response.status !== "undefined" && response.status === statusCode 
                ? consoleColor.log(`${testName} -- PASS`, "success") 
                : consoleColor.log(`${testName} -- FAIL \n ${JSON.stringify(response)}`, "error");
            expect(response.status).to.eql(statusCode);
            return response.body
        });
    },

    update({updatedName = "", token = "", statusCode = "", boardId = "", boardCode = "", testName = ""}) {
        return cy.request({
            failOnStatusCode: false,
            method: "PUT",
            url: `${data.apiBaseUrl}/api/v2/boards/${boardId}`,
            body: {
                name: updatedName,
                code: boardCode
            },
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            typeof response.status !== "undefined" && response.status === statusCode 
                ? consoleColor.log(`${testName} -- PASS`, "success") 
                : consoleColor.log(`${testName} -- FAIL \n ${JSON.stringify(response)}`, "error");
            expect(response.status).to.eql(statusCode);
            return response.body
        });
    },

    delete({token = "", statusCode = 200, boardId = "", testName = ""}) {
        cy.request({
            failOnStatusCode: false,
            method: "DELETE",
            url: `${data.apiBaseUrl}/api/v2/boards/${boardId}`,
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((response) => {
            typeof response.status !== "undefined" && response.status === statusCode 
                ? consoleColor.log(`${testName} -- PASS`, "success") 
                : consoleColor.log(`${testName} -- FAIL \n ${JSON.stringify(response)}`, "error");
            expect(response.status).to.eql(statusCode);
        });
    }
}
