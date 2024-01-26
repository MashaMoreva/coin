import "./accounts.scss";
import { el, mount } from "redom";
import { createAccountCard } from "./accountCard/accountCard";
import { createButton } from "../button/button";
import { createNewAccount, getAccounts } from "../../helpers/api";
import { createDropdownSelect } from "../dropdownSelect/dropdownSelect";
import { createHeader } from "../header/header";

export function createAccounts(router) {
  const bodyContainer = document.body;
  const header = createHeader(true, router, "/accounts");
  const mainContainer = el("main");

  let currentSortOrder = "По номеру";

  const sortOptions = ["По номеру", "По балансу", "По последней транзакции"];
  const sortSelect = createDropdownSelect(
    sortOptions,
    "",
    true,
    "Выберите тип сортировки",
    "sortSelect",
    "sortSelect"
  );

  const accountsContainer = el("div.accounts", [
    el("div.accounts-controls", [
      el("h1.accounts-controls-title", "Ваши счета"),
      sortSelect,
      createButton({
        text: "Создать новый счёт",
        hasIcon: true,
        iconClass: "accounts-controls-button-icon",
        extraClass: "accounts-controls-button",
        onClick: () => createNewAccount(accountCardsContainer, router),
      }),
    ]),
    el("div.accounts-container"),
  ]);

  const accountCardsContainer = accountsContainer.querySelector(
    ".accounts-container"
  );

  const inputElement = sortSelect.querySelector(".dropdown-input");

  console.log("Input Element:", inputElement);
  inputElement.addEventListener("input", () => {
    console.log("Input event:", inputElement.value);
    currentSortOrder = inputElement.value;
    sortAndRenderAccounts(currentSortOrder);
  });

  getAccounts().then((userAccounts) => {
    sortAndRenderAccounts(currentSortOrder, userAccounts);
  });

  bodyContainer.innerHTML = "";
  mount(bodyContainer, header);
  mount(mainContainer, accountsContainer);
  mount(bodyContainer, mainContainer);

  function sortAndRenderAccounts(sortOrder) {
    console.log("Сортировка и отрисовка счетов:", sortOrder);
    getAccounts().then((userAccounts) => {
      const sortedAccounts = sortAccounts(userAccounts, sortOrder);
      console.log("Отсортированные счета:", sortedAccounts);
      renderAccounts(sortedAccounts);
    });
  }

  function sortAccounts(accounts, sortOrder) {
    switch (sortOrder) {
      case "По номеру":
        return accounts.sort((a, b) => a.account.localeCompare(b.account));
      case "По балансу":
        return accounts.sort((a, b) => a.balance - b.balance);
      case "По последней транзакции":
        return accounts;
      default:
        return accounts;
    }
  }

  function renderAccounts(accounts) {
    accountCardsContainer.innerHTML = "";
    accounts.forEach((account) => {
      const accountCard = createAccountCard(account, router);
      mount(accountCardsContainer, accountCard);
    });
  }

  return bodyContainer;
}
