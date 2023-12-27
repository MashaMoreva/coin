import { el } from "redom";
import logo from "../../assets/images/logo.svg";
import "./header.scss";
import "../../styles/colors.scss";
import { createButton } from "../button/button";

export function createHeader(isAuthorized, router) {
  const buttons = isAuthorized
    ? [
        createButton({
          text: "Банкоматы",
          onClick: () => router.navigate("/atm-map"),
          reversedColors: true,
        }),
        createButton({
          text: "Счета",
          onClick: () => router.navigate("/accounts"),
          reversedColors: true,
        }),
        createButton({
          text: "Валюта",
          onClick: () => router.navigate("/currency"),
          reversedColors: true,
        }),
        createButton({ text: "Выйти", reversedColors: true }),
      ]
    : [];

  const buttonsWrapper = el("div.header-wrapper", buttons);

  return el("header.header", [
    el("img.header-logo", { src: logo }),
    buttonsWrapper,
  ]);
}
