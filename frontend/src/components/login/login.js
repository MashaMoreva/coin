import { el } from "redom";
import "./login.scss";

export function createLoginForm() {
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
        }),
        el("span.login-error-message", { id: "passwordError" }),
      ]),

      el("button.login-button", { type: "submit", disabled: true }, "Войти"),
    ]),
  ]);

  const loginForm = loginContainer.querySelector("#loginForm");
  loginForm.addEventListener("submit", handleLoginFormSubmit);

  return loginContainer;
}

function handleLoginFormSubmit(event) {
  event.preventDefault();
  localStorage.setItem("isAuthorized", "true");
  router.navigate("/accounts");
}
