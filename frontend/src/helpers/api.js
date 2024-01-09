import { updateAccounts } from "../helpers/updateAccounts";

const API_BASE_URL = "http://localhost:3000";

function getAuthorizationToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Токен авторизации не найден");
  }

  return token;
}

async function handleFetch(url, method) {
  const token = getAuthorizationToken();

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      method,
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
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

    if (!payload || !Array.isArray(payload)) {
      throw new Error(
        "Недопустимый формат ответа: полезная нагрузка отсутствует или не является массивом"
      );
    }

    return payload;
  } catch (error) {
    throw error;
  }
}

export async function createNewAccount(accountCardsContainer) {
  try {
    await handleFetch("/create-account", "POST");

    const userAccounts = await getAccounts();
    updateAccounts(userAccounts, accountCardsContainer);
  } catch (error) {
    throw error;
  }
}
