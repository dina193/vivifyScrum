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
        cy.get(sidebar.mainSidebar.myAccountAvatarImg)
            .should("be.visible")
            .click();

        cy.get(sidebar.sideMenu.accountOptions.profileBtn).click();

        cy.get(header.logOutBtn).click();
            
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
    
}

export default Login;
