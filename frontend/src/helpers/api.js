import { updateAccounts } from "../helpers/updateAccounts";

const API_BASE_URL = "http://localhost:3000";

function getAuthorizationToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Токен авторизации не найден");
  }

  return token;
}

async function handleFetch(url, method, body) {
  const token = getAuthorizationToken();

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Запрос не выполнен: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Ошибка в ${method} при запросе к ${url}:`, error.message);
    throw error;
  }
}

export async function getAccounts() {
  try {
    const responseData = await handleFetch("/accounts", "GET");
    const { payload } = responseData;
    return payload;
  } catch (error) {
    throw error;
  }
}

export async function createNewAccount(accountCardsContainer, router) {
  try {
    await handleFetch("/create-account", "POST");
    const userAccounts = await getAccounts();
    updateAccounts(userAccounts, accountCardsContainer, router);
  } catch (error) {
    throw error;
  }
}

export async function getAccountDetails(accountId) {
  try {
    const responseData = await handleFetch(`/account/${accountId}`, "GET");
    const { payload } = responseData;
    return payload;
  } catch (error) {
    throw error;
  }
}

export async function handleTransfer(formData) {
  try {
    const response = await handleFetch("/transfer-funds", "POST", formData);
    return response;
  } catch (error) {
    throw error;
  }
}

export async function getAllCurrencies() {
  try {
    const response = await handleFetch("/all-currencies", "GET");
    return response.payload;
  } catch (error) {
    throw error;
  }
}

export async function getUserCurrencies() {
  try {
    const responseData = await handleFetch("/currencies", "GET");
    const { payload } = responseData;
    return payload;
  } catch (error) {
    throw error;
  }
}

export async function buyCurrency(formData) {
  try {
    const response = await handleFetch("/currency-buy", "POST", formData);
    console.log(formData);
    return response;
  } catch (error) {
    throw error;
  }
}
