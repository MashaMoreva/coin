import "./accounts.scss";
import { el, mount } from "redom";
import { createAccountCard } from "./accountCard/accountCard";
import { createButton } from "../button/button";

export function createAccounts() {
  const accountsContainer = el("div.accounts", [
    el("div.accounts-controls", [
      el("h1.accounts-controls-title", "Ваши счета"),
      el("select.accounts-controls-select"),
      createButton({
        text: "Создать новый счёт",
        hasIcon: true,
        iconClass: "accounts-controls-button-icon",
        extraClass: "accounts-controls-button",
      }),
    ]),
  ]);

  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("Authorization token not found");
  }

  fetch("http://localhost:3000/accounts", {
    method: "GET",
    headers: {
      Authorization: `Basic ${token}`,
      "Content-Type": "application/json",
    },
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Failed to fetch user accounts: ${response.status}`);
      }
      return response.json();
    })
    .then((responseData) => {
      if (!responseData.payload || !Array.isArray(responseData.payload)) {
        throw new Error(
          "Invalid response format: payload is missing or not an array"
        );
      }

      const userAccounts = responseData.payload;
      userAccounts.forEach((account) => {
        const accountCard = createAccountCard(account);
        mount(accountsContainer, accountCard);
      });
    })
    .catch((error) => {
      console.error("Error creating accounts:", error.message);
    });

  return accountsContainer;
}
