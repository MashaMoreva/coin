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


  sortSelect.addEventListener("click", () => {
    const selectedOption = sortSelect.querySelector(".checked");
    if (selectedOption) {
      currentSortOrder = selectedOption.textContent;
      getAccounts().then((userAccounts) => {
        const sortedAccounts = sortAccounts(userAccounts, currentSortOrder);
        renderAccounts(sortedAccounts);
      });
    }
  });

  getAccounts().then(() => {
    sortAndRenderAccounts(currentSortOrder);
  });

  bodyContainer.innerHTML = "";
  mount(bodyContainer, header);
  mount(mainContainer, accountsContainer);
  mount(bodyContainer, mainContainer);

  function sortAndRenderAccounts(sortOrder) {
    getAccounts().then((userAccounts) => {
      const sortedAccounts = sortAccounts(userAccounts, sortOrder);
      renderAccounts(sortedAccounts, sortOrder);
    });
  }

  function sortAccounts(accounts, sortOrder) {
    switch (sortOrder) {
      case "По номеру":
        return accounts.sort((a, b) => a.account.localeCompare(b.account));
      case "По балансу":
        return accounts.sort((a, b) => b.balance - a.balance);
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
