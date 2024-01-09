import "./account.scss";
import { el } from "redom";
import { getAccountDetails } from "../../helpers/api";
import { createButton } from "../button/button";
import { createFieldset } from "../../helpers/createFieldset";

export function createAccount(id) {
  const accountContainer = el("div.account");

  getAccountDetails(id)
    .then((accountDetails) => {
      const detailsContainer = el("div.account", [
        el("div.account-controls", [
          el("h1.account-controls-title", "Простосмотр счёта"),
          createButton({
            text: "Вернуться назад",
            hasIcon: true,
            iconClass: "account-controls-button-icon",
            extraClass: "account-controls-button",
          }),
        ]),
        el("div.account-details", [
          el("p.account-details-number", `№ ${id}`),
          el("div.account-details-balance", [
            el("p.account-details-balance-subtitle", "Баланс"),
            el(
              "p.account-details-balance-digits",
              `${accountDetails.balance} ₽`
            ),
          ]),
        ]),
        el("div.account-wrapper", [
          el("div.account-wrapper-form", [
            el("p.account-wrapper-form-title", "Новый перевод"),
            createFieldset(
              "Номер счёта получателя",
              "account",
              "Введите номер счёта",
              "number"
            ),
            createFieldset(
              "Сумма перевода",
              "amount",
              "Введите сумму",
              "number"
            ),
            createButton({
              text: "Отправить",
              hasIcon: true,
              iconClass: "account-wrapper-form-button-icon",
              extraClass: "account-wrapper-form-button",
            }),
          ]),
          el("div.account-wrapper-chart"),
        ]),
      ]);
      accountContainer.appendChild(detailsContainer);
    })

    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });

  return accountContainer;
}
