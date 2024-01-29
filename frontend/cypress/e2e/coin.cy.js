describe("Веб-приложение Coin.", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.request({
      method: "POST",
      url: "http://localhost:3000/login",
      body: {
        login: "developer",
        password: "skillbox",
      },
    }).then((response) => {
      expect(response.status).to.eq(200);
      localStorage.setItem("token", response.body.payload.token);
    });
    cy.visit("http://localhost:8080/");
  });

  it("должно перенаправить на страницу счетов после успешной авторизации", () => {
    cy.url().should("include", "/accounts");
  });

  it("должно отобразить список счетов", () => {
    cy.get(".accounts-controls-title").should("contain", "Ваши счета");
    cy.get(".card").should("exist");
  });

  it("должно создать новый счёт", () => {
    cy.get(".card")
      .its("length")
      .then((initialCount) => {
        cy.contains(".accounts-controls-button", "Создать новый счёт").click();
        cy.get(".card").should("have.length", initialCount + 1);
      });
  });

  it("должно осуществить перевод", () => {
    cy.contains(".card", "74213041477477406320783754")
      .find(".card-button")
      .click();
    cy.get(".dropdown-select input").type("5555341244441115");
    cy.get('input[name="amount"]').type("11.11");
    cy.get(".account-wrapper-form-button").click();
    cy.get(".account-table-cell").contains("5555341244441115").should("exist");
    cy.get(".account-table-cell").contains("11.11").should("exist");
  });
});
