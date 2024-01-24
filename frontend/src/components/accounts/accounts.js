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

  const accountsContainer = el("div.accounts", [
    el("div.accounts-controls", [
      el("h1.accounts-controls-title", "Ваши счета"),
      createDropdownSelect([
        "По номеру",
        "По балансу",
        "По последней транзакции",
      ]),
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

  getAccounts().then((userAccounts) => {
    userAccounts.forEach((account) => {
      const accountCard = createAccountCard(account, router);
      mount(accountCardsContainer, accountCard);
    });
  });

  bodyContainer.innerHTML = "";

  mount(bodyContainer, header);
  mount(mainContainer, accountsContainer);
  mount(bodyContainer, mainContainer);

  return bodyContainer;
}
