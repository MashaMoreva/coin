describe("Веб-приложение Coin.", () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit("http://localhost:8080/");
  });

  it("должно отобразить форму входа при отсутствии токена", () => {
    cy.get(".login-title").should("contain", "Вход в аккаунт");
  });

  it("должно перенаправить на страницу счетов при наличии токена", () => {
    cy.get("#username").type("developer");
    cy.get("#password").type("skillbox");
    cy.get(".login-button").click();
    cy.url().should("include", "/accounts");
  });
  it("должно отобразить список счетов после входа", () => {
    cy.get("#username").type("developer");
    cy.get("#password").type("skillbox");
    cy.get(".login-button").click();

    cy.url().should("include", "/accounts");

    cy.get(".accounts-controls-title").should("contain", "Ваши счета");

    cy.get(".card").should("exist");
  });
});
