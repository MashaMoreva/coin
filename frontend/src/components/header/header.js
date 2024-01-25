import { el } from "redom";
import logo from "../../assets/images/logo.svg";
import "./header.scss";
import "../../styles/colors.scss";
import { createButton } from "../button/button";

export function createHeader(isAuthorized, router, currentPath) {
  const buttons = isAuthorized
    ? [
        createButton({
          text: "Банкоматы",
          onClick: () => router.navigate("/map"),
          reversedColors: true,
          isActive: currentPath === "/map",
        }),
        createButton({
          text: "Счета",
          onClick: () => router.navigate("/accounts"),
          reversedColors: true,
          isActive: currentPath === "/accounts",
        }),
        createButton({
          text: "Валюта",
          onClick: () => router.navigate("/currency"),
          reversedColors: true,
          isActive: currentPath === "/currency",
        }),
        createButton({
          text: "Выйти",
          reversedColors: true,
          onClick: handleLogout,
        }),
      ]
    : [];

  const buttonsWrapper = el("div.header-wrapper", buttons);

  function handleLogout() {
    localStorage.removeItem("token");
    router.navigate("/");
  }

  return el("header.header", [
    el("img.header-logo", { src: logo }),
    buttonsWrapper,
  ]);
}
