import { el } from "redom";

export function createLoginForm() {
  const loginContainer = el(".login", [
    el("h1.login-title", "Вход в аккаунт"),
    el("form.login-form", { id: "loginForm" }, [
      el("label.login-label", { for: "username" }, "Логин:"),
      el("input.login-input", {
        type: "text",
        id: "username",
        name: "username",
        required: true,
      }),

      el("label.login-label", { for: "password" }, "Пароль:"),
      el("input.login-input", {
        type: "password",
        id: "password",
        name: "password",
        required: true,
      }),

      el("button.login-button", { type: "submit" }, "Войти"),
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
