import { el } from "redom";
import "./currency.scss";
import {
  getAllCurrencies,
  getUserCurrencies,
  buyCurrency,
} from "../../helpers/api";

export function createCurrency() {
  const currencyContainer = el("div.currency", [
    el("h1.currency-title", "Валютный обмен"),
  ]);

  return currencyContainer;
}
