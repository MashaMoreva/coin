import { el } from "redom";
import "./fieldset.scss";

export function createFieldset(
  labelText,
  fieldName,
  placeholder,
  fieldType,
  handleInput
) {
  const inputType = fieldType || "text";

  return el("fieldset.fieldset", [
    el("label.fieldset-label", { for: fieldName }, labelText),
    el("input.fieldset-input", {
      type: inputType,
      id: fieldName,
      name: fieldName,
      placeholder: placeholder,
      oninput: handleInput,
    }),
    el("span.fieldset-error-message", { id: `${fieldName}Error` }),
  ]);
}
