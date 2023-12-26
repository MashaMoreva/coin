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
      createFieldset(
        "Логин:",
        "username",
        "Введите логин",
        handleInputFactory("username", validationState)
      ),
      createFieldset(
        "Пароль:",
        "password",
        "Введите пароль",
        handleInputFactory("password", validationState)
      ),

      el("div.login-wrapper", [
        createButton("Войти", handleLoginFormSubmit, true),
        el("span.login-error", { id: "authErrorMessage" }),
      ]),
    ]),
  ]);

  const loginForm = loginContainer.querySelector("#loginForm");
  loginForm.addEventListener("submit", handleLoginFormSubmit);

  async function handleLoginFormSubmit(e) {
    e.preventDefault();

    const login = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMessageElement = document.getElementById("authErrorMessage");

    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ login, password }),
      });

      if (response.ok) {
        const responseData = await response.json();

        if (responseData.error) {
          const errorMessageElement =
            document.getElementById("authErrorMessage");
          displayAuthorizationErrorMessage(
            responseData.error,
            errorMessageElement
          );
        } else {
          const { token } = responseData.payload;
          localStorage.setItem("token", token);
          router.navigate("/accounts");
        }
      } else {
        console.error("Ошибка авторизации:", response.statusText);
        displayAuthorizationErrorMessage(
          "Ошибка при авторизации. Попробуйте еще раз позже.",
          errorMessageElement
        );
      }
    } catch (error) {
      console.error("Ошибка сети:", error);
      displayAuthorizationErrorMessage(
        "Произошла ошибка сети. Пожалуйста, проверьте подключение.",
        errorMessageElement
      );
    }
  }

  return loginContainer;
}

function createFieldset(labelText, fieldName, placeholder, handleInput) {
  return el("fieldset.login-fieldset", [
    el("label.login-label", { for: fieldName }, labelText),
    el("input.login-input", {
      type: fieldName === "password" ? "password" : "text",
      id: fieldName,
      name: fieldName,
      placeholder: placeholder,
      oninput: handleInput,
    }),
    el("span.login-error-message", { id: `${fieldName}Error` }),
  ]);
}

function handleInputFactory(fieldName, validationState) {
  return function handleInput() {
    const inputValue = document.getElementById(fieldName).value;
    const errorMessageElement = document.getElementById(`${fieldName}Error`);
    const loginButton = document.querySelector(".button");
    const inputElement = document.getElementById(fieldName);

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

      inputElement.classList.remove("error");
      inputElement.classList.add("success");

      loginButton.disabled = !Object.values(validationState).every(
        (state) => state
      );
    } catch (error) {
      errorMessageElement.textContent = error.message;
      validationState[fieldName] = false;

      inputElement.classList.remove("success");
      inputElement.classList.add("error");

      loginButton.disabled = true;
    }
  };
}

function displayAuthorizationErrorMessage(message, errorMessageElement) {
  errorMessageElement.textContent = message;
}
