import { el, mount } from "redom";
import "./currency.scss";
import {
  getUserCurrencies,
  getAllCurrencies,
  buyCurrency,
} from "../../helpers/api";
import { createButton } from "../button/button";
import { createFieldset } from "../fieldset/fieldset";
import { createDropdownSelect } from "../dropdownSelect/dropdownSelect";

function createCurrencyWrapper() {
  const exchangeWrapper = el("div.exchange-wrapper");
  getAllCurrencies()
    .then((allCurrencies) => {
      const dropdownFrom = createDropdownSelect(allCurrencies, "Из");
      const dropdownTo = createDropdownSelect(allCurrencies, "в");

      mount(exchangeWrapper, dropdownFrom);
      mount(exchangeWrapper, dropdownTo);
    })
    .catch((error) => {
      console.error(
        "Ошибка при получении данных о валютах для обновления выпадающих списков:",
        error
      );
    });

  return exchangeWrapper;
}

export function createCurrency() {
  const userCurrenciesContainer = el("div.user-currencies");
  const rateContainer = el("div.rate-exchanges");

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
      el("div.currency-block", [
        el("div.user", [
          el("p.currency-subtitle", "Ваши валюты"),
          userCurrenciesContainer,
        ]),
        el("div.exchange", [
          el("p.currency-subtitle", "Обмен валюты"),
          el("div.exchange-form", [
            el("div.exchange-inputs", [
              createCurrencyWrapper(),
              createFieldset("Сумма", "amount", "Введите сумму"),
            ]),
            createButton({
              text: "Обменять",
              extraClass: "exchange-button",
            }),
          ]),
        ]),
      ]),
      el("div.rate", [
        el("p.currency-subtitle", "Изменение курсов в реальном времени"),
        rateContainer,
      ]),
    ]),
  ]);

  // getAllCurrencies()
  //   .then((allCurrencies) => {
  //     const exchangeWrapper = el("div.exchange-wrapper", [
  //       createDropdownSelect(allCurrencies, "Из"),
  //       createDropdownSelect(allCurrencies, "в"),
  //     ]);
  //     currencyContainer
  //       .querySelector(".exchange-inputs")
  //       .replaceChild(
  //         exchangeWrapper,
  //         currencyContainer.querySelector(".exchange-wrapper")
  //       );
  //   })
  //   .catch((error) => {
  //     console.error(
  //       "Ошибка при получении данных о валютах для обновления выпадающих списков:",
  //       error
  //     );
  //   });

  const currencyFeedSocket = new WebSocket("ws://localhost:3000/currency-feed");

  currencyFeedSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    if (data.type === "EXCHANGE_RATE_CHANGE") {
      const { from, to, rate, change } = data;
      const arrowIcon =
        change === 1 ? el("img.arrow-green") : el("img.arrow-red");

      const rateElement = el("div.rate-element", [
        el("span.rate-currency", `${from}/${to}`),
        el("span.rate-pass", { class: change === 1 ? "green" : "red" }),
        el("span.rate-value", `${rate} `),
        arrowIcon,
      ]);

      rateContainer.prepend(rateElement);
    }
  };

  return currencyContainer;
}
