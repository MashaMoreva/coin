import { el, mount } from "redom";
import "./currency.scss";
import {
  getUserCurrencies,
  getAllCurrencies,
  buyCurrency,
} from "../../helpers/api";

export function createCurrency() {
  const userCurrenciesContainer = el("div.user-currencies");

  getUserCurrencies()
    .then((userCurrencies) => {
      for (const currencyCode in userCurrencies) {
        const currencyBalance = userCurrencies[currencyCode].amount;

        const currencyElement = el("div.user-currency", [
          el("span.currency-code", currencyCode),
          el("span.currency-pass"),
          el("span.currency-balance", currencyBalance),
        ]);

        mount(userCurrenciesContainer, currencyElement);
      }
    })
    .catch((error) => {
      console.error("Ошибка при получении данных о валютах:", error);
    });

  const currencyContainer = el("div.currency", [
    el("h1.currency-title", "Валютный обмен"),
    el("div.currency-wrapper", [
      el("div.user", [
        el("p.user-subtitle", "Ваши валюты"),
        userCurrenciesContainer,
      ]),
    ]),
  ]);

  return currencyContainer;
}
