import { el, setChildren } from "redom";
import Navigo from "navigo";
import "./styles/styles.scss";
import { createLoginForm } from "./components/login/login.js";
import { createMap } from "./components/map/map.js";
import { createAccounts } from "./components/accounts/accounts.js";
import { createAccount } from "./components/account/account.js";
import { createCurrency } from "./components/currency/currency.js";

const router = new Navigo(null, true, "#");

function checkAuthorization() {
  router
    .on("/login", () => {
      if (!localStorage.getItem("token")) {
        createLoginForm(router);
      } else {
        router.navigate("/accounts");
      }
    })
    .on("/accounts", () => {
      if (!!localStorage.getItem("token")) {
        createAccounts(router);
      } else {
        router.navigate("/login");
      }
    })
    .on("/account/:id", (params) => {
      if (localStorage.getItem("token")) {
        createAccount(params.data.id, router);
      } else {
        router.navigate("/login");
      }
    })
    .on("/currency", () => {
      if (localStorage.getItem("token")) {
        createCurrency(router);
      } else {
        router.navigate("/login");
      }
    })
    .on("/map", () => {
      if (localStorage.getItem("token")) {
        createMap(router);
      } else {
        router.navigate("/login");
      }
    })
    .resolve();
}

checkAuthorization();
