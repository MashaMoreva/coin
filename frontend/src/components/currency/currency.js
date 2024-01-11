import { el, mount } from "redom";
import "./currency.scss";
import {
  getUserCurrencies,
  getAllCurrencies,
  buyCurrency,
} from "../../helpers/api";

export function createCurrency() {
  const userCurrenciesContainer = el("div.user-currencies");
  const exchangeRateContainer = el("div.rate-exchanges");

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
        el("p.currency-subtitle", "Ваши валюты"),
        userCurrenciesContainer,
      ]),
      el("div.rate", [
        el("p.currency-subtitle", "Изменение курсов в реальном времени"),
        exchangeRateContainer,
      ]),
    ]),
  ]);

  const currencyFeedSocket = new WebSocket("ws://localhost:3000/currency-feed");

  currencyFeedSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "EXCHANGE_RATE_CHANGE") {
      const { from, to, rate, change } = data;
      const arrowIcon =
        change === 1 ? el("img.arrow-green") : el("img.arrow-red");

      const exchangeRateElement = el("div.rate-exchange", [
        el("span.rate-currency", `${from}/${to}`),
        el("span.rate-pass", { class: change === 1 ? "green" : "red" }),
        el("span.rate-value", `${rate} `),
        arrowIcon,
      ]);

      exchangeRateContainer.prepend(exchangeRateElement);
    }
  };

  return currencyContainer;
}
