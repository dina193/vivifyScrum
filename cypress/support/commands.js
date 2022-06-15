// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import sidebar from "../pages/sidebar.json";
import header from "../pages/header.json";

let orgId;
let boardId;

Cypress.Commands.add("loginViaApi", (email, password) => {
    cy.request({
        method: "POST",
        url: "https://cypress-api.vivifyscrum-stage.com/api/v2/login ",
        body: {
            email: email,
            "g-recaptcha-response": "",
            password: password
        }}).then((response) => {
            expect(response.status).to.equal(200);
            expect(response.body).to.have.property("token");
            window.localStorage.setItem("token", response.body.token);
            window.localStorage.setItem("user", JSON.stringify(response.body.user));
            window.localStorage.setItem("user_id", response.body.user.id);
        });
});

Cypress.Commands.add("createOrgViaApi", (orgName) => {
    cy.request({
        method: 'POST', 
        url: 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations',
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        },
        body: {
            name: orgName
        }
    }).then((response) => {
        expect(response.status).to.equal(201)
        orgId = response.body.id;
    });
});

Cypress.Commands.add("deleteOrgViaApi", (password) => {
    cy.request({
        method: "POST",
        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        },
        body: {
            passwordOrEmail: password
        }
    }).then((response) => {
        expect(response.status).to.equal(201);
    });
});

Cypress.Commands.add("logout", () => {
    cy.get(sidebar.mainSidebar.myAccountAvatarImg)
        .should("be.visible")
        .click();

    cy.get(sidebar.sideMenu.accountOptions.profileBtn).click();

    cy.get(header.logOutBtn).click();
});

Cypress.Commands.add("updateOrgViaApi", (updatedName) => {
    cy.request({
        method: "PUT",
        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`,
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        },
        body: {
            name: updatedName
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
        expect(response.body.name).to.equal(updatedName)
    });
});

Cypress.Commands.add("createBoardViaApi", (boardName) => {
    cy.request({
        method: "POST",
        url: "https://cypress-api.vivifyscrum-stage.com/api/v2/boards",
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        },
        body: {
            name: boardName,
            organization_id: orgId,
            type: "scrum_board"
        }
    }).then((response) => {
        expect(response.status).to.equal(201);
        boardId = response.body.id;
    });
});

Cypress.Commands.add("deleteBoardViaApi", () => {
    cy.request({
        method: "DELETE",
        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`,
        headers: {
            authorization: `Bearer ${window.localStorage.getItem("token")}`
        }
    }).then((response) => {
        expect(response.status).to.equal(200);
    });
});

Cypress.Commands.add("openCreatedBoard", () => {
    cy.intercept({
        method: "GET",
        url: `https://cypress-api.vivifyscrum-stage.com/api/v2/boards/${boardId}`
    }).as("getBoard");

    cy.get(sidebar.mainSidebar.boardFromSidebarLi).click();

    cy.wait("@getBoard").then(({ response }) => {
        expect(response.statusCode).to.equal(200)
    });
});
