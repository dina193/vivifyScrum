import data from "../fixtures/data.json";
import Login from "../support/classes/login";

const login = new Login();

describe("Login", () => {
    beforeEach(() => {
        cy.visit("/login");
        
        cy.url().should("contain", "/login");
    });

    after(() => {
        cy.logout();

        login.assertUserIsLoggedOut();
    });

    it("LOG-01 Login without any credentials", () => {
        login.loginViaUI(data.strings.empty, data.strings.empty);

        login.assertTwoValidationMsgs(data.validationMessages.emailValidation, data.validationMessages.passwordValidation);
    });

    it("LOG-02 Login with no email and correct password", () => {
        login.loginViaUI(data.strings.empty, data.user.password);

        login.assertOneValidationMsg(0, data.validationMessages.emailValidation);
    });

    it("LOG-03 Login with correct email and no password", () => {
        login.loginViaUI(data.user.email, data.strings.empty);

        login.assertOneValidationMsg(1, data.validationMessages.passwordValidation);
    });

    it("LOG-04 Login with invalid email - missing '@' sign", () => {
        login.loginViaUI(data.invalidEmail.emailNoMonkeySign, data.user.password);

        login.assertOneValidationMsg(0, data.validationMessages.emailValidation);
    });

    it("LOG-05 Login with invalid email - missing dot", () => {
        login.loginViaUI(data.invalidEmail.emailMissingDot, data.user.password);

        login.assertOneValidationMsg(0, data.validationMessages.emailValidation);
    });

    it("LOG-06 Login with invalid email - double dot after '@' sign", () => {
        login.loginViaUI(data.invalidEmail.emailTwoDots, data.user.password);

        login.assertOneValidationMsg(0, data.validationMessages.emailValidation);
    });

    it("LOG-07 Login with incorrect email and correct password", () => {
        login.interceptInvalidLogin(data.invalidEmail.wrongEmail, data.user.password)

        login.assertEmailPassMismatch(data.validationMessages.emailPassMismatch);

    });

    it("LOG-08 Login with correct email and incorrect password", () => {
        login.interceptInvalidLogin(data.user.email, data.invalidPassword.wrongPassword);

        login.assertEmailPassMismatch(data.validationMessages.emailPassMismatch);
    });

    it("LOG-09 Login with valid credentials", () => {
        login.interceptLogin(data.user.email, data.user.password);

        login.assertUserIsLoggedIn();
    });

});
