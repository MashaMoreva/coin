import { el } from "redom";
import "./dropdownSelect.scss";

export function createDropdownSelect(
  optionsData,
  labelText,
  readOnly = true,
  placeholder = "Введите счёт"
) {
  const defaultValue = optionsData.length > 0 ? optionsData[0] : "";

  const select = el("div.dropdown-select", [
    el("div.dropdown-label", labelText),
    el("input.dropdown-input", {
      value: defaultValue,
      placeholder: placeholder,
      readOnly,
    }),
    el("ul.dropdown-options"),
  ]);

  const selectOptions = select.querySelector(".dropdown-options");
  let selectedOption = null;

  function toggleOptions() {
    select.classList.toggle("open");
  }

  optionsData.forEach((option, index) => {
    const optionElement = el("li.dropdown-option", option);
    selectOptions.appendChild(optionElement);

    if (option === defaultValue) {
      optionElement.classList.add("checked");
      selectedOption = optionElement;
    }

    optionElement.addEventListener("click", () => {
      select.querySelector(".dropdown-input").value = option;
      if (selectedOption) {
        selectedOption.classList.remove("checked");
      }
      optionElement.classList.add("checked");
      selectedOption = optionElement;
    });
  });

  select.addEventListener("click", toggleOptions);

  return select;
}
