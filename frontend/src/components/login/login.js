import { el } from "redom";
import * as yup from "yup";
import "./login.scss";
import { createButton } from "../button/button";
import { createFieldset } from "../fieldset/fieldset";

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
        "text",
        handleInputFactory("username", validationState)
      ),
      createFieldset(
        "Пароль:",
        "password",
        "Введите пароль",
        "password",
        handleInputFactory("password", validationState)
      ),

      el("div.login-wrapper", [
        createButton({
          text: "Войти",
          isDisabled: true,
          onClick: handleLoginFormSubmit,
          extraClass: "login-button",
        }),
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
        "Произошла ошибка сети. Проверьте подключение.",
        errorMessageElement
      );
    }
  }

  return loginContainer;
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

      errorMessageElement.classList.remove("error");
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
      errorMessageElement.classList.add("error");

      loginButton.disabled = true;
    }
  };
}

function displayAuthorizationErrorMessage(message, errorMessageElement) {
  errorMessageElement.textContent = message;
}
