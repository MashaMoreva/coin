import { el } from "redom";
import "./button.scss";

export function createButton({
  text,
  onClick,
  isDisabled = false,
  hasIcon = false,
  reversedColors = false,
}) {
  const buttonClasses = `button ${isDisabled ? "disabled" : ""} ${
    hasIcon ? "icon" : ""
  } ${reversedColors ? "reversed" : ""}`;

  const button = el(
    "button",
    {
      class: buttonClasses,
      type: "button",
      disabled: isDisabled,
      onclick: onClick,
    },
    [hasIcon && el("span.button-icon"), el("span.button-text", text)]
  );

  return button;
}
