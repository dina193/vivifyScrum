import myOrgs from "../../pages/myOrganizationsPage.json";
import orgModal from "../../pages/organizationModal.json";
import modal from "../../pages/confirmationModal.json";
import orgPage from "../../pages/organizationPage.json";
import sidebar from "../../pages/sidebar.json";
import header from "../../pages/header.json";

let orgId;
class Organization {
    openOrganizationModal() {
        cy.get(myOrgs.addNewOrgSpan)
            .should("be.visible")
            .click();
    }

    createOrgInvalidTry(orgName) {
        this.openOrganizationModal();
        cy.get(orgModal.orgNameInput).type(orgName);
    }

    assertNextBtnIsDisabled() {
        cy.get(orgModal.nextBtn).should(($button) => {
            expect($button).to.be.disabled
        });
    }

    createOrganization(orgName) {
        cy.intercept({
            method: "POST",
            url: "https://cypress-api.vivifyscrum-stage.com/api/v2/organizations"
        }).as("createOrg");

        this.createOrgInvalidTry(orgName);

        cy.get(orgModal.nextBtn).click();

        cy.get(orgModal.nextBtn).click();

        cy.get(modal.okBtn)
            .should("be.visible")
            .click();

        cy.wait("@createOrg").then(({ response }) => {
            expect(response.statusCode).to.equal(201)
            orgId = response.body.id
            cy.url().should("contain", `${orgId}/boards`)
        })
    }

    assertOrganizationIsCreated(orgName) {
        cy.get(header.vsLogoBtn).click();
        cy.get(myOrgs.createdOrgDiv).contains(orgName)
            .should("exist");
    }

    editOrgNameInvalidTry(editName) {
        cy.get(myOrgs.createdOrgDiv).click();

        cy.get(modal.okBtn)
            .should("be.visible")
            .click();

        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn)
            .should("be.visible")
            .click();

        cy.get(orgPage.orgNameInput).clear().type(editName);
    }

    assertOrgNameIsNotUpdated(index, message) {
        cy.get(orgPage.validationMsgSpan).eq(index)
            .should("be.visible")
            .and("have.text", message);

        cy.get(orgPage.updateBtn).eq(0).should("be.disabled");
    }

    updateOrgName(updateName) {
        cy.intercept({
            method: "PUT",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`
        }).as("editOrg");

        this.editOrgNameInvalidTry(updateName);

        cy.get(orgPage.updateBtn).eq(0)
            .should("not.be.disabled")
            .click();

        cy.wait("@editOrg").then(({ response }) => {
            expect(response.statusCode).to.equal(200)
        })
    }

    assertOrgNameIsUpdated(updatedName) {
        cy.get(orgPage.validationMsgSpan).eq(0).should("not.be.visible");
        cy.get(orgPage.orgNameInput).should("have.value", updatedName);
    }

    deleteOrganization(password, statusCode) {
        cy.intercept({
            method: "POST",
            url: `https://cypress-api.vivifyscrum-stage.com/api/v2/organizations/${orgId}`
        }).as("deleteOrg")
        cy.get(myOrgs.createdOrgDiv).click();

        cy.get(modal.okBtn).click();

        cy.get(sidebar.sideMenu.organizationOptions.configurationBtn)
            .should("be.visible")
            .click();

        cy.get(orgPage.deleteBtn)
            .scrollIntoView()
            .should("be.visible")
            .click();

        cy.get(modal.confirmActionPassInput).type(password);

        cy.get(modal.yesBtn).click();

        cy.wait("@deleteOrg").then(({ response }) => {
            expect(response.statusCode).to.equal(statusCode)
        })
    }

    assertOrgIsNotDeleted() {
        cy.get(modal.confirmActionH4).should("be.visible");
    }

    assertOrgIsDeleted() {
        cy.get(myOrgs.createdOrgDiv).should("not.exist");
    }
    
    createOrgApi(orgName) {
        cy.request({
            method: 'POST', 
            url: 'https://cypress-api.vivifyscrum-stage.com/api/v2/organizations',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${window.localStorage.getItem('token')}`
            },
            body: {
                name: orgName
            }
        }).then((resp) => {
            console.log(resp)
        })
    }
}

export default Organization;
