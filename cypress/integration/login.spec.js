import loginPage from "../pages/loginPage.json";
import data from "../fixtures/data.json";
import sidebar from "../pages/sidebar.json";
import header from "../pages/header.json";

describe("Login", () => {
    beforeEach(() => {
        cy.visit("/login");
        cy.url().should("contain", "/login");
    });

    after(() => {
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

    it("Login without any credentials", () => {
        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationMsgSpan).should("have.length", 2);

        cy.get(loginPage.validationMsgSpan).should(($validation) => {
            expect($validation[0]).to.have.text(data.validationMessages.emailValidation)
            expect($validation[1]).to.have.text(data.validationMessages.passwordValidation)
        }); 
    });

    it("Login with no email and correct password", () => {
        cy.get(loginPage.passwordInput).type(data.user.password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationMsgSpan).eq(0)
            .should("be.visible")
            .and("have.text", data.validationMessages.emailValidation);
    });

    it("Login with correct email and no password", () => {
        cy.get(loginPage.emailInput).type(data.user.email);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationMsgSpan).eq(1)
            .should("be.visible")
            .and("have.text", data.validationMessages.passwordValidation);
    });

    it("Login with invalid email - missing '@' sign", () => {
        cy.get(loginPage.emailInput).type(data.invalidEmail.emailNoMonkeySign);

        cy.get(loginPage.passwordInput).type(data.user.password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationMsgSpan).eq(0)
            .should("be.visible")
            .and("have.text", data.validationMessages.emailValidation);
    });

    it("Login with invalid email - missing dot", () => {
        cy.get(loginPage.emailInput).type(data.invalidEmail.emailMissingDot);

        cy.get(loginPage.passwordInput).type(data.user.password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationMsgSpan).eq(0)
            .should("be.visible")
            .and("have.text", data.validationMessages.emailValidation);
    });

    it("Login with invalid email - double dot after '@' sign", () => {
        cy.get(loginPage.emailInput).type(data.invalidEmail.emailTwoDots);

        cy.get(loginPage.passwordInput).type(data.user.password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationMsgSpan).eq(0)
            .should("be.visible")
            .and("have.text", data.validationMessages.emailValidation);
    });

    it("Login with incorrect email and correct password", () => {
        cy.get(loginPage.emailInput).type(data.invalidEmail.wrongEmail);

        cy.get(loginPage.passwordInput).type(data.user.password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationOopsSpan)
            .should("be.visible")
            .and("have.text", data.validationMessages.emailPassMismatch);
    });

    it("Login with correct email and incorrect password", () => {
        cy.get(loginPage.emailInput).type(data.user.email);

        cy.get(loginPage.passwordInput).type(data.invalidPassword.wrongPassword);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.get(loginPage.validationOopsSpan)
            .should("be.visible")
            .and("have.text", data.validationMessages.emailPassMismatch);
    });

    it("Login with valid credentials", () => {
        cy.get(loginPage.emailInput).type(data.user.email);

        cy.get(loginPage.passwordInput).type(data.user.password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();

        cy.url().should("contain", "/my-organizations");

        cy.get(sidebar.mainSidebar.myAccountAvatarImg).should("be.visible");
    });

});
