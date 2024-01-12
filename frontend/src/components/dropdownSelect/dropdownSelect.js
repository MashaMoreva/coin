import { el } from "redom";
import "./dropdownSelect.scss";

export function createDropdownSelect(optionsData, onSelect) {
  const select = el("div.dropdown-select", [
    el("input.dropdown-input", {
      value: "Сортировка",
      readOnly: true,
    }),
    el("ul.dropdown-options"),
  ]);

  const selectOptions = select.querySelector(".dropdown-options");
  let selectedOption = null;

  function toggleOptions() {
    select.classList.toggle("open");
  }

  optionsData.forEach((option) => {
    const optionElement = el("li.dropdown-option", option);
    selectOptions.appendChild(optionElement);
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
