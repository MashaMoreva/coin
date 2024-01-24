import { createAccountCard } from "../components/accounts/accountCard/accountCard";
import { setChildren } from "redom";

export function updateAccounts(userAccounts, accountCardsContainer, router) {
  const newAccountCards = userAccounts.map((account) =>
    createAccountCard(account, router)
  );
  setChildren(accountCardsContainer, newAccountCards);
}
