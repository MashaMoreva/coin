import { el } from "redom";
import "./button.scss";

export function createButton({
  text,
  onClick,
  isDisabled = false,
  isActive = false,
  iconClass = "",
  hasIcon = false,
  reversedColors = false,
  extraClass = "",
}) {
  const buttonClasses = `button 
  ${isDisabled ? "disabled" : ""} 
  ${isActive ? "active" : ""} 
  ${hasIcon ? "icon" : ""} 
  ${reversedColors ? "reversed" : ""}
  ${extraClass}`;

  const buttonContent = [
    hasIcon && el("span.button-icon", { class: iconClass }),
    el("span.button-text", text),
  ];

  const button = el(
    "button",
    {
      class: buttonClasses,
      type: "button",
      disabled: isDisabled,
      onclick: onClick,
    },
    buttonContent
  );

  return button;
}
