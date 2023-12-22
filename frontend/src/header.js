import { el } from "redom";
import logo from "./assets/images/logo.svg";
import "./header.scss";

export const createHeader = () => {
  return el("header.header", [el("img.header-logo", { src: logo })]);
};
