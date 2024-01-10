import "./account.scss";
import { el } from "redom";
import { getAccountDetails } from "../../helpers/api";
import { createButton } from "../button/button";
import { createFieldset } from "../fieldset/fieldset";
import Chart from "chart.js/auto";
import { getMonthYear, getRecentMonths } from "../../helpers/getMonths";

export function createAccount(id, router) {
  const accountContainer = el("div.account");
  const chartCanvas = el("canvas", {
    id: "balanceChart",
    width: "584",
    height: "200",
  });

  getAccountDetails(id)
    .then((accountDetails) => {
      console.log("Транзакции:", accountDetails.transactions);
      const detailsContainer = el("div.account", [
        el("div.account-controls", [
          el("h1.account-controls-title", "Простосмотр счёта"),
          createButton({
            text: "Вернуться назад",
            hasIcon: true,
            iconClass: "account-controls-button-icon",
            extraClass: "account-controls-button",
            onClick: () => router.navigate("/accounts"),
          }),
        ]),
        el("div.account-details", [
          el("p.account-details-number", `№ ${accountDetails.account}`),
          el("div.account-details-balance", [
            el("p.account-details-balance-subtitle", "Баланс"),
            el(
              "p.account-details-balance-digits",
              `${accountDetails.balance} ₽`
            ),
          ]),
        ]),
        el("div.account-wrapper", [
          el("div.account-wrapper-form", [
            el("p.account-wrapper-title", "Новый перевод"),
            createFieldset(
              "Номер счёта получателя",
              "account",
              "Введите номер счёта",
              "number"
            ),
            createFieldset(
              "Сумма перевода",
              "amount",
              "Введите сумму",
              "number"
            ),
            createButton({
              text: "Отправить",
              isDisabled: true,
              hasIcon: true,
              iconClass: "account-wrapper-form-button-icon",
              extraClass: "account-wrapper-form-button",
            }),
          ]),
          el("div.account-wrapper-chart", [
            el("p.account-wrapper-title", "Динамика баланса"),
            chartCanvas,
          ]),
        ]),
        el("div.account-table", [
          el("p.account-wrapper-title", "История переводов"),
          createTransactionTable(accountDetails.transactions, id),
        ]),
      ]);
      accountContainer.appendChild(detailsContainer);

      buildBalanceChart(chartCanvas, accountDetails.transactions);
    })

    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });

  return accountContainer;
}

function buildBalanceChart(canvas, transactions) {
  const monthlySums = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const yearMonth = getMonthYear(date);

    if (!acc[yearMonth]) {
      acc[yearMonth] = 0;
    }

    acc[yearMonth] += parseFloat(transaction.amount);

    return acc;
  }, {});

  const allMonths = Object.keys(monthlySums);
  const recentMonths = getRecentMonths(allMonths, 6);
  const balances = recentMonths.map((month) => monthlySums[month]);

  console.log("Months:", recentMonths);
  console.log("Balances:", balances);

  const ctx = canvas.getContext("2d");

  const maxBalance = Math.max(...balances);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: recentMonths,
      datasets: [
        {
          data: balances,
          backgroundColor: "rgba(17, 106, 204, 1)",
        },
      ],
    },
    options: {
      scales: {
        x: {
          grid: {
            display: false,
          },
          // ticks: {
          //   font: {
          //     size: 20,
          //     weight: "bold",
          //     letterSpacing: -0.4,
          //   },
          // },
        },
        y: {
          position: "right",
          min: 0,
          max: maxBalance,
          beginAtZero: true,
          grid: {
            display: false,
          },
          ticks: {
            stepSize: maxBalance,
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function createTransactionTable(transactions, id) {
  const tableHeader = el("div.account-table-header", [
    el("div.account-table-cell", "Счёт отправителя"),
    el("div.account-table-cell", "Счёт получателя"),
    el("div.account-table-cell", "Сумма"),
    el("div.account-table-cell", "Дата"),
  ]);

  const tableRowsContainer = el("div.account-table-row-wrapper");

  function updateTableRows() {
    tableRowsContainer.textContent = "";

    transactions.slice(-10).forEach((transaction) => {
      const isIncoming = transaction.to === id;

      // const typeClass = isIncoming ? "incoming" : "outgoing";
      const color = isIncoming
        ? "rgba(118, 202, 102, 1)"
        : "rgba(253, 78, 93, 1)";
      const sign = isIncoming ? "+" : "-";

      const row = el("div.account-table-row", [
        el("div.account-table-cell", transaction.from),
        el("div.account-table-cell", transaction.to),
        el(
          "div.account-table-cell",
          {
            //  class: typeClass,
            style: `color: ${color}`,
          },
          `${sign} ${transaction.amount} ₽`
        ),
        el(
          "div.account-table-cell",
          new Date(transaction.date).toLocaleDateString()
        ),
      ]);

      tableRowsContainer.insertBefore(row, tableRowsContainer.firstChild);
    });
  }

  updateTableRows();

  return el("div.account-table-wrapper", [tableHeader, tableRowsContainer]);
}
