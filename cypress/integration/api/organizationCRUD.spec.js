import data from "../../fixtures/dataTwo.json"
import user from "../../api/user"
import organization from "../../api/organization"


describe('APIO - Organization CRUD',() => {
    let token
    let organizationData
    let allOrganizations
    before(() => {
        user.login({testName: Cypress.currentTest.title}).then((response) => {
            token = response.token;
        });
    })

    it('APIO - 01 - positive', () => {
        organization.post({
            name: "new",
            token: token,
            statusCode: 201,
            testName: Cypress.currentTest.title
        }).then((response) => {
            organizationData = response
            console.log(organizationData)
        })
    })

    it('APIO - 001 - update', () => {
        organization.update({
            nameUpdate: "edit org",
            token: token,
            testName: Cypress.currentTest.title,
            orgId: organizationData.id
        })
    })
    

    it('APIO - 02 - empty name', () => {
        organization.post({
            name: "",
            token: token,
            statusCode: 400,
            testName: Cypress.currentTest.title
        })
    })

    it('APIO - 03 - object', () => {
        organization.post({
            name: {},
            token: token,
            statusCode: 400,
            testName: Cypress.currentTest.title
        })
    })

    it('APIO - 04 - array', () => {
        organization.post({
            name: [],
            token: token,
            statusCode: 400,
            testName: Cypress.currentTest.title
        })
    })

    it('APIO - 05 - sql inject', () => {
        organization.post({
            name: "{}$",
            token: token,
            statusCode: 400,
            testName: Cypress.currentTest.title
        })
    })

    it('APIO - 06 - sql inject 2', () => {
        organization.post({
            name: "````",
            token: token,
            statusCode: 400,
            testName: Cypress.currentTest.title
        })
    })

    it('APIO - 07 - white space', () => {
        organization.post({
            name: "     ",
            token: token,
            statusCode: 400,
            testName: Cypress.currentTest.title
        })
    })

    it('APIO - 00 - get organizations', () => {
        organization.get({
            token: token,
            statusCode: 200,
            testName: Cypress.currentTest.title
        }).then((response) => {
            allOrganizations = response
            console.log(allOrganizations)
        })
    })

    it('APIO - 08 - delete all orgs', () => {
        let counter = 0;
        allOrganizations.forEach((org) => {
            organization.delete({
                orgId : org.id,
                token: token,
                testName: `${Cypress.currentTest.title} --- ${counter} --- ${org.name}`
            });
            counter++;
        });
    })
})