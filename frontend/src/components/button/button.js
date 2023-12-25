import { el } from "redom";
import "./button.scss";

export function createButton(
  text,
  onClick,
  isDisabled = false,
  bgColor = "$primary",
  textColor = "$white",
  iconClass = ""
) {
  const buttonContent = [
    iconClass && el("span.button-icon", { class: iconClass }),
    text,
  ];

  return el(
    "button.button",
    {
      type: "submit",
      disabled: isDisabled,
      onclick: onClick,
      style: `background-color: ${bgColor}; color: ${textColor};`,
    },
    buttonContent
  );
}
