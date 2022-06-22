import data from "../fixtures/data.json";
import Login from "../support/classes/login";
import Organization from "../support/classes/organization";

const login = new Login();
const org = new Organization();

describe("Organization CRUD", () => {
    beforeEach(() => {
        cy.loginViaApi(data.user.email, data.user.password);

        cy.visit("/my-organizations");
    });

    after(() => {
        cy.logout();

        login.assertUserIsLoggedOut();
    });

    it("ORGCR-01 Create organization - no organization name", () => {
        org.createOrgInvalidTry(data.strings.empty);

        org.assertNextBtnIsDisabled();
    });

    it("ORGCR-02 Create organization - name with all spaces", () => {
        org.createOrgInvalidTry(data.strings.multipleSpaces);

        org.assertNextBtnIsDisabled();
    });

    it("ORGCR-03 Create organization - valid organization name", () => {
       org.createOrganization(data.strings.organizationName);

       org.assertOrganizationIsCreated(data.strings.organizationName);
    });

    it("ORGCR-04 Update organization name - empty name field", () => {
        org.editOrgNameInvalidTry(data.strings.empty);

        org.assertOrgNameIsNotUpdated(0, data.validationMessages.requiredNameField);
    });

    it("ORGCR-05 Update organization name - all spaces", () => {
        org.editOrgNameInvalidTry(data.strings.multipleSpaces);

        org.assertOrgNameIsNotUpdated(0, data.validationMessages.requiredNameField);
    });

    it("ORGCR-06 Update organization name - positive", () => {
        org.updateOrgName(data.strings.editedOrgName);

        org.assertOrgNameIsUpdated(data.strings.editedOrgName);
    });

    it("ORGCR-07 Delete organization - wrong password", () => {
        org.deleteOrganization(data.invalidPassword.wrongPassword, 403);

        org.assertOrgIsNotDeleted();
    });

    it("ORGCR-08 Delete organization", () => {
        org.deleteOrganization(data.user.password, 201);
        
        org.assertOrgIsDeleted();
    });

    it("ORGCR-09 Create and update organization via api", () => {
        cy.createOrgViaApi(data.strings.organizationName);

        cy.updateOrgViaApi(data.strings.editedOrgName);
    });

});
