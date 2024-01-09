import { createAccountCard } from "../components/accounts/accountCard/accountCard";
export async function getAccounts() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token not found");
  }

  try {
    const response = await fetch("http://localhost:3000/accounts", {
      method: "GET",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch user accounts: ${response.status}`);
    }
    const responseData = await response.json();
    if (!responseData.payload || !Array.isArray(responseData.payload)) {
      throw new Error(
        "Invalid response format: payload is missing or not an array"
      );
    }
    return responseData.payload;
  } catch (error) {
    console.error("Error fetching user accounts:", error.message);
  }
}

export async function createNewAccount(accountCardsContainer) {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Authorization token not found");
  }

  try {
    const response = await fetch("http://localhost:3000/create-account", {
      method: "POST",
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to create a new account: ${response.status}`);
    }
    const userAccounts = await getAccounts();

    updateAccountList(userAccounts, accountCardsContainer);
  } catch (error) {
    console.error("Error creating a new account:", error.message);
  }
}

function updateAccountList(userAccounts, accountCardsContainer) {
  accountCardsContainer.innerHTML = userAccounts
    .map((account) => createAccountCard(account).outerHTML)
    .join("");
}
