import "./accounts.scss";
import { el, mount } from "redom";
import { createAccountCard } from "./accountCard/accountCard";
import { createButton } from "../button/button";

export function createAccounts() {
  const accountsContainer = el("div.accounts", [
    el("div.accounts-controls", [
      el("h1.accounts-controls-title", "Ваши счета"),
      el("div.accounts-controls-select", [
        el("input.accounts-controls-input", {
          value: "Сортировка",
          readOnly: true,
        }),
        el("ul.accounts-controls-options"),
      ]),
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

  const select = accountsContainer.querySelector(".accounts-controls-select");
  const selectOptions = accountsContainer.querySelector(
    ".accounts-controls-options"
  );
  const input = accountsContainer.querySelector(".accounts-controls-input");

  const optionsData = ["По номеру", "По балансу", "По последней транзакции"];
  let selectedOption = null;

  function toggleOptions() {
    select.classList.toggle("open");
  }

  optionsData.forEach((option) => {
    const optionElement = el("li.accounts-controls-option", option);
    selectOptions.appendChild(optionElement);
    optionElement.addEventListener("click", () => {
      input.value = option;
      if (selectedOption) {
        selectedOption.classList.remove("checked");
      }
      optionElement.classList.add("checked");
      selectedOption = optionElement;
    });
  });

  select.addEventListener("click", toggleOptions);

  return accountsContainer;
}
