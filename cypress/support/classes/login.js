import loginPage from "../../pages/loginPage.json";
import sidebar from "../../pages/sidebar.json";
import header from "../../pages/header.json";

class Login {
    loginViaUI(email, password) {
        cy.get(loginPage.emailInput).clear().type(email);

        cy.get(loginPage.passwordInput).clear().type(password);

        cy.get(loginPage.loginBtn)
            .should("be.visible")
            .click();
    }

    logOutViaUI() {
        cy.intercept("POST", "https://cypress-api.vivifyscrum-stage.com/api/v2/logout").as("logOut");

        cy.get(sidebar.mainSidebar.myAccountAvatarImg)
            .should("be.visible")
            .click();

        cy.get(sidebar.sideMenu.accountOptions.profileBtn).click();

        cy.get(header.logOutBtn).click();

        cy.wait("@logOut").should(({ response }) => {
            expect(response.statusCode).to.equal(201);
        });     
    }

    assertUserIsLoggedIn() {
        cy.url().should("contain", "/my-organizations");
        cy.get(sidebar.mainSidebar.myAccountAvatarImg).should("be.visible");
    }

    assertUserIsLoggedOut() {
        cy.get(loginPage.loginHeading).should("be.visible");
    }

    assertOneValidationMsg(index, message) {
        cy.get(loginPage.validationMsgSpan).eq(index)
            .should("be.visible")
            .and("have.text", message);
    }

    assertTwoValidationMsgs(firstMessage, secondMessage) {
        cy.get(loginPage.validationMsgSpan).should("have.length", 2);

        cy.get(loginPage.validationMsgSpan).should(($validation) => {
            expect($validation[0]).to.have.text(firstMessage)
            expect($validation[1]).to.have.text(secondMessage)
        });
    }

    assertEmailPassMismatch(message) {
        cy.get(loginPage.validationOopsSpan)
            .should("be.visible")
            .and("have.text", message)
    }

    interceptInvalidLogin(email, pass) {
        cy.intercept("POST", "https://cypress-api.vivifyscrum-stage.com/api/v2/login").as("invalidLogin");

        this.loginViaUI(email, pass);

        cy.wait("@invalidLogin").should(({ response }) => {
            expect(response.statusCode).to.equal(401);
            expect(response.statusMessage).to.contain("Unauthorized");
        });
    }

    interceptLogin(email, pass) {
        cy.intercept("POST", "https://cypress-api.vivifyscrum-stage.com/api/v2/login").as("login");

        this.loginViaUI(email, pass);

        cy.wait("@login").should(({ response }) => {
            expect(response.statusCode).to.equal(200);
        });
    }

    interceptLogOut() {
        cy.intercept("POST", "https://cypress-api.vivifyscrum-stage.com/api/v2/logout").as("logOut");

        this.logOutViaUI();

        cy.wait("@logOut").should(({ response }) => {
            expect(response.statusCode).to.equal(201);
        });
    }
    
}

export default Login;
