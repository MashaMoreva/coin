export function formatDate(dateString) {
  const options = { day: "numeric", month: "long", year: "numeric" };
  const date = new Date(dateString);
  return date.toLocaleDateString("ru-RU", options);
}
