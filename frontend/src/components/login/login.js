import { el } from "redom";
import * as yup from "yup";
import "./login.scss";
import { createButton } from "../button/button";

export function createLoginForm(router) {
  const validationState = {
    username: false,
    password: false,
  };

  const loginContainer = el("div.login", [
    el("h1.login-title", "Вход в аккаунт"),
    el("form.login-form", { id: "loginForm" }, [
      el("fieldset.login-fieldset", [
        el("label.login-label", { for: "username" }, "Логин:"),
        el("input.login-input", {
          type: "text",
          id: "username",
          name: "username",
          placeholder: "Введите логин",
          oninput: handleInputFactory("username", validationState),
        }),
        el("span.login-error-message", { id: "usernameError" }),
      ]),

      el("fieldset.login-fieldset", [
        el("label.login-label", { for: "password" }, "Пароль:"),
        el("input.login-input", {
          type: "password",
          id: "password",
          name: "password",
          placeholder: "Введите пароль",
          oninput: handleInputFactory("password", validationState),
        }),
        el("span.login-error-message", { id: "passwordError" }),
      ]),

      createButton("Войти", handleLoginFormSubmit, true),
    ]),
  ]);

  const loginForm = loginContainer.querySelector("#loginForm");
  loginForm.addEventListener("submit", handleLoginFormSubmit);

  function handleLoginFormSubmit(event) {
    event.preventDefault();
    localStorage.setItem("isAuthorized", "true");
    router.navigate("/accounts");
  }

  return loginContainer;
}

function handleInputFactory(fieldName, validationState) {
  return function handleInput() {
    const inputValue = document.getElementById(fieldName).value;
    const errorMessageElement = document.getElementById(`${fieldName}Error`);

    const validationSchema = yup.object().shape({
      username: yup
        .string()
        .required("Поле не может быть пустым")
        .min(6, "Не менее 6 символов")
        .matches(/^\S*$/, "Пробелы недопустимы"),
      password: yup
        .string()
        .required("Поле не может быть пустым")
        .min(6, "Не менее 6 символов")
        .matches(/^\S*$/, "Пробелы недопустимы"),
    });

    try {
      validationSchema.validateSyncAt(fieldName, { [fieldName]: inputValue });
      errorMessageElement.textContent = "";
      validationState[fieldName] = true;

      const loginButton = document.querySelector(".button");
      loginButton.disabled = !Object.values(validationState).every(
        (state) => state
      );
    } catch (error) {
      errorMessageElement.textContent = error.message;
      validationState[fieldName] = false;
      const loginButton = document.querySelector(".button");
      loginButton.disabled = true;
    }
  };
}
