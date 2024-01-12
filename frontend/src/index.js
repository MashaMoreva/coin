import { el, setChildren } from "redom";
import Navigo from "navigo";
import "./styles/styles.scss";
import { createHeader } from "./components/header/header.js";
import { createLoginForm } from "./components/login/login.js";
import { createMap } from "./components/map/map.js";
import { createAccounts } from "./components/accounts/accounts.js";
import { createAccount } from "./components/account/account.js";
import { createCurrency } from "./components/currency/currency.js";

const router = new Navigo(null, true, "#");

function checkAuthorization() {
  const token = localStorage.getItem("token");
  const isAuthorized = !!token;
  const route = isAuthorized ? "/accounts" : "/login";
  router.navigate(route);

  router
    .on("/login", () => {
      createLoginForm(router);
    })
    .on("/accounts", () => {
      createAccounts(router);
    })
    .on("/account/:id", (params) => {
      createAccount(params.data.id, router);
    })
    .on("/currency", () => {
      createCurrency(router);
    })
    .on("/map", () => {
      createMap(router);
    })
    .resolve();
}

checkAuthorization();
