import data from "../fixtures/data.json";
import Login from "../support/classes/login";
import Organization from "../support/classes/organization";

const login = new Login();
const org = new Organization();

describe("Organization CRUD", () => {
    beforeEach(() => {
        cy.visit("/login");

        login.loginViaUI(data.user.email, data.user.password);

        login.assertUserIsLoggedIn();
    });

    after(() => {
        login.logOutViaUI();

        login.assertUserIsLoggedOut();
    });

    it("Create organization - no organization name", () => {
        org.createOrgInvalidTry(data.strings.empty);

        org.assertNextBtnIsDisabled();
    });

    it("Create organization - name with all spaces", () => {
        org.createOrgInvalidTry(data.strings.multipleSpaces);

        org.assertNextBtnIsDisabled();
    });

    it("Create organization - valid organization name", () => {
       org.createOrganization(data.strings.organizationName);

       org.assertOrganizationIsCreated(data.strings.organizationName);
    });

    it("Update organization name - empty name field", () => {
        org.editOrgNameInvalidTry(data.strings.empty);

        org.assertOrgNameIsNotUpdated(0, data.validationMessages.requiredNameField);
    });

    it("Update organization name - all spaces", () => {
        org.editOrgNameInvalidTry(data.strings.multipleSpaces);

        org.assertOrgNameIsNotUpdated(0, data.validationMessages.requiredNameField);
    });

    it("Update organization name - positive", () => {
        org.updateOrgName(data.strings.editedOrgName);

        org.assertOrgNameIsUpdated(data.strings.editedOrgName);
    });

    it("Delete organization - wrong password", () => {
        org.deleteOrganization(data.invalidPassword.wrongPassword);

        org.assertOrgIsNotDeleted();
    });

    it("Delete organization", () => {
        org.deleteOrganization(data.user.password);
        
        org.assertOrgIsDeleted();
    });

});
