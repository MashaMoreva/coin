import { el, setChildren } from "redom";
import Navigo from "navigo";
import "./styles/styles.scss";
import { createHeader } from "./components/header/header.js";
import { createLoginForm } from "./components/login/login.js";

const mainContainer = el("main");
const headerContainer = createHeader();
setChildren(document.body, [headerContainer, mainContainer]);

const router = new Navigo(null, true, "#");

function checkAuthorization() {
  const isAuthorized = localStorage.getItem("isAuthorized");
  const route = isAuthorized === "true" ? "/accounts" : "/login";
  router.navigate(route);
}

checkAuthorization();

router
  .on("/login", () => {
    setChildren(mainContainer, [createLoginForm(router)]);
  })
  .on("/accounts", () => {
    setChildren(mainContainer, [el("h1", "Страница счетов пользователя")]);
  })
  .on("/account/:id", (params) => {
    setChildren(mainContainer, [
      el("h1", `Страница деталей счета с id: ${params.id}`),
    ]);
  })
  .on("/currency", () => {
    setChildren(mainContainer, [el("h1", "Страница валюты")]);
  })
  .on("/atm-map", () => {
    setChildren(mainContainer, [el("h1", "Страница с картой банкоматов")]);
  })
  .resolve();
