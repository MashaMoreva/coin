import { createAccountCard } from "../components/accounts/accountCard/accountCard";

export function updateAccounts(userAccounts, accountCardsContainer) {
  accountCardsContainer.innerHTML = userAccounts
    .map((account) => createAccountCard(account).outerHTML)
    .join("");
}
