import { el, setChildren } from "redom";
import Navigo from "navigo";
import "./styles/styles.scss";
import { createHeader } from "./components/header/header.js";
import { createLoginForm } from "./components/login/login.js";
import { createMap } from "./components/map/map.js";

const router = new Navigo(null, true, "#");

function checkAuthorization() {
  const token = localStorage.getItem("token");
  const isAuthorized = !!token;
  const route = isAuthorized ? "/accounts" : "/login";
  router.navigate(route);

  const mainContainer = el("main");
  const headerContainer = createHeader(isAuthorized, router);
  setChildren(document.body, [headerContainer, mainContainer]);

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
      setChildren(mainContainer, [createMap()]);
    })
    .resolve();
}

checkAuthorization();
