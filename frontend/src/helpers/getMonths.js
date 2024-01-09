export function getRecentMonths(allMonths, n) {
  return allMonths.slice(-n);
}

export function getMonthYear(date) {
  const monthNames = [
    "Янв",
    "Фев",
    "Март",
    "Апр",
    "Май",
    "Июнь",
    "Июль",
    "Авг",
    "Сент",
    "Окт",
    "Ноябрь",
    "Декабрь",
  ];

  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`;
}
