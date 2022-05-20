import loginPage from "../pages/loginPage.json";
import data from "../fixtures/data.json";
import sidebar from "../pages/sidebar.json";
import header from "../pages/header.json";

describe("Login", () => {
    it("Login without any credentials", () => {
        cy.visit("/login");
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with no email and correct password", () => {
        cy.visit("/login");
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with correct email and no password", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with invalid email - missing '@' sign", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.invalidEmail.emailNoMonkeySign);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with invalid email - missing dot", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.invalidEmail.emailMissingDot);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with invalid email - double dot after '@' sign", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.invalidEmail.emailTwoDots);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with incorrect email and correct password", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.invalidEmail.wrongEmail);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with correct email and incorrect password", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.passwordInput).type(data.invalidPassword.wrongPassword);
        cy.get(loginPage.loginBtn).click();
    });

    it("Login with valid credentials", () => {
        cy.visit("/login");
        cy.get(loginPage.emailInput).type(data.user.email);
        cy.get(loginPage.passwordInput).type(data.user.password);
        cy.get(loginPage.loginBtn).click();
    });

    it("Logout", () => {
        cy.get(sidebar.mainSidebar.myAccountAvatarImg).click();
        cy.get(sidebar.sideMenu.accountOptions.profileBtn).click();
        cy.get(header.logOutBtn).click();
    });

});
