import { el, setChildren } from "redom";
import Navigo from "navigo";
import "./styles/styles.scss";
import { createLoginForm } from "./components/login/login.js";
import { createMap } from "./components/map/map.js";
import { createAccounts } from "./components/accounts/accounts.js";
import { createAccount } from "./components/account/account.js";
import { createCurrency } from "./components/currency/currency.js";

const router = new Navigo(null, true, "#");
let isAuthorized = false;

function checkAuthorization() {
  const token = localStorage.getItem("token");
  isAuthorized = !!token;

  router
    .on("/login", () => {
      if (!isAuthorized) {
        createLoginForm(router);
      } else {
        router.navigate("/accounts");
      }
    })
    .on("/accounts", () => {
      if (isAuthorized) {
        createAccounts(router);
      } else {
        router.navigate("/login");
      }
    })
    .on("/account/:id", (params) => {
      if (isAuthorized) {
        createAccount(params.data.id, router);
      } else {
        router.navigate("/login");
      }
    })
    .on("/currency", () => {
      if (isAuthorized) {
        createCurrency(router);
      } else {
        router.navigate("/login");
      }
    })
    .on("/map", () => {
      if (isAuthorized) {
        createMap(router);
      } else {
        router.navigate("/login");
      }
    })
    .resolve();
}

checkAuthorization();
