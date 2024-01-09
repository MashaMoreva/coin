import "./accounts.scss";
import { el, mount } from "redom";
import { createAccountCard } from "./accountCard/accountCard";
import { createButton } from "../button/button";
import { createNewAccount, getAccounts } from "../../helpers/api";

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
        onClick: () => createNewAccount(accountCardsContainer),
      }),
    ]),
    el("div.accounts-container"),
  ]);

  const accountCardsContainer = accountsContainer.querySelector(
    ".accounts-container"
  );

  getAccounts().then((userAccounts) => {
    userAccounts.forEach((account) => {
      const accountCard = createAccountCard(account);
      mount(accountCardsContainer, accountCard);
    });
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
