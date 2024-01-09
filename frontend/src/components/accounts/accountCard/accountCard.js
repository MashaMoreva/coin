import "./accountCard.scss";
import { el } from "redom";
import { createButton } from "../../button/button";
import { formatDate } from "../../../helpers/formatDate";

export function createAccountCard(account) {
  let lastTransactionDate = "Нет транзакций";

  if (account.transactions && account.transactions.length > 0) {
    lastTransactionDate = formatDate(account.transactions[0].date);
  }

  const card = el("div.card", [
    el("p.card-account", account.account),
    el("p.card-balance", `${account.balance} ₽`),
    el("div.card-info", [
      el("div.card-wrapper", [
        el("p.card-subtitle", "Последняя транзакция:"),
        el("p.card-date", lastTransactionDate),
      ]),
      createButton({
        text: "Открыть",
        extraClass: "card-button",
      }),
    ]),
  ]);
  return card;
}
