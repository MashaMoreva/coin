import "./accountHistory.scss";
import { el, mount } from "redom";
import { createHeader } from "../../header/header";
import { getAccountDetails } from "../../../helpers/api";
import { createButton } from "../../button/button";
import Chart from "chart.js/auto";
import { getMonthYear, getRecentMonths } from "../../../helpers/getMonths";

export function createAccountHistory(id, router) {
  const bodyContainer = document.body;
  const header = createHeader(true, router);
  const mainContainer = el("main");

  const accountContainer = el("div.account");
  const chartCanvas = el("canvas", {
    id: "balanceChart",
    width: "1000",
    height: "165",
  });

  const chartCanvas2 = el("canvas", {
    id: "transactionChart",
    width: "1000",
    height: "165",
  });

  getAccountDetails(id)
    .then((accountDetails) => {
      const detailsContainer = el("div.account", [
        el("div.account-controls", [
          el("h1.account-controls-title", "История баланса"),
          createButton({
            text: "Вернуться назад",
            hasIcon: true,
            iconClass: "account-controls-button-icon",
            extraClass: "account-controls-button",
            onClick: () => router.navigate(`/account/${id}`),
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
        el("div.history-wrapper", [
          el("div.history-wrapper-chart", [
            el("p.history-wrapper-title", "Динамика баланса"),
            chartCanvas,
          ]),
        ]),
        el("div.history-wrapper", [
          el("div.history-wrapper-chart", [
            el(
              "p.history-wrapper-title",
              "Соотношение входящих исходящих транзакций"
            ),
            chartCanvas2,
          ]),
        ]),
        el("div.account-table", [
          el("p.account-wrapper-title", "История переводов"),
          createTransactionTable(accountDetails.transactions, id),
        ]),
      ]);
      accountContainer.appendChild(detailsContainer);

      buildBalanceChart(chartCanvas, accountDetails.transactions);
      buildTransactionChart(chartCanvas2, accountDetails.transactions, id);
    })
    .catch((error) => {
      console.error("Ошибка при получении данных:", error);
    });

  bodyContainer.innerHTML = "";

  mount(bodyContainer, header);
  mount(mainContainer, accountContainer);
  mount(bodyContainer, mainContainer);

  return bodyContainer;
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
  const recentMonths = getRecentMonths(allMonths, 12);
  const balances = recentMonths.map((month) => monthlySums[month]);

  const ctx = canvas.getContext("2d");

  const maxBalance = Math.max(...balances);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: recentMonths,
      datasets: [
        {
          label: "Баланс",
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

function buildTransactionChart(canvas, transactions, id) {
  const monthlySums = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date);
    const yearMonth = getMonthYear(date);

    if (!acc[yearMonth]) {
      acc[yearMonth] = { income: 0, expense: 0 };
    }

    const amount = parseFloat(transaction.amount);

    if (transaction.to === id) {
      acc[yearMonth].income += amount;
    } else {
      acc[yearMonth].expense += amount;
    }

    return acc;
  }, {});

  const allMonths = Object.keys(monthlySums);
  const recentMonths = getRecentMonths(allMonths, 12);

  const data = recentMonths.map((month) => {
    const income = monthlySums[month].income;
    const expense = monthlySums[month].expense;

    return {
      month,
      income,
      expense,
    };
  });

  const ctx = canvas.getContext("2d");

  const maxIncome = Math.ceil(Math.max(...data.map((entry) => entry.income)));
  const maxExpense = Math.ceil(Math.max(...data.map((entry) => entry.expense)));
  const maxTotal = Math.max(maxIncome, maxExpense);
  const minTotal = Math.min(0, maxTotal);

  if (ctx) {
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: data.map((entry) => entry.month),
        datasets: [
          {
            label: "Доход",
            data: data.map((entry) => entry.income),
            backgroundColor: "rgba(118, 202, 102, 1)",
          },
          {
            label: "Расход",
            data: data.map((entry) => entry.expense),
            backgroundColor: "rgba(253, 78, 93, 1)",
          },
        ],
      },
      options: {
        scales: {
          x: {
            grid: {
              display: false,
            },
          },
          y: {
            position: "right",
            min: minTotal,
            max: maxTotal,
            beginAtZero: true,
            grid: {
              display: false,
            },
            ticks: {
              callback: function (value) {
                return Math.abs(value);
              },
              stepSize: (maxTotal - minTotal) / 2,
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
  } else {
    console.error("Не удалось получить контекст холста");
  }
}

function createTransactionTable(transactions, id) {
  const tableHeader = el("div.account-table-header", [
    el("div.account-table-cell", "Счёт отправителя"),
    el("div.account-table-cell", "Счёт получателя"),
    el("div.account-table-cell", "Сумма"),
    el("div.account-table-cell", "Дата"),
  ]);

  const tableRowsContainer = el("div.account-table-row-wrapper");
  const paginationControls = el("div.pagination-controls");

  function updateTableRows(pageNumber, pageSize) {
    tableRowsContainer.textContent = "";

    const startIndex = (pageNumber - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const displayedTransactions = transactions
      .slice(startIndex, endIndex)
      .reverse();

    displayedTransactions.forEach((transaction) => {
      const isIncoming = transaction.to === id;

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
            style: `color: ${color}`,
          },
          `${sign} ${transaction.amount} ₽`
        ),
        el(
          "div.account-table-cell",
          new Date(transaction.date).toLocaleDateString()
        ),
      ]);

      tableRowsContainer.prepend(row);
    });

    updatePaginationControls(pageNumber, pageSize);
  }

  function updatePaginationControls(pageNumber, pageSize) {
    paginationControls.textContent = "";

    const totalPages = Math.ceil(transactions.length / pageSize);

    for (let i = totalPages; i > 0; i--) {
      const pageButton = createButton({
        text: i.toString(),
        onClick: () => updateTableRows(i, pageSize),
        disabled: i === pageNumber,
      });

      paginationControls.prepend(pageButton);
    }
  }

  updateTableRows(1, 25);

  return el("div.account-table-wrapper", [
    tableHeader,
    tableRowsContainer,
    paginationControls,
  ]);
}
