export const formatDateIST = (isoString) => {
  if (!isoString) return "";

  const date = new Date(isoString);
  if (Number.isNaN(date.getTime())) return "";
  const options = { timeZone: "Asia/Kolkata", day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true };
  return new Intl.DateTimeFormat("en-IN", options).format(date).replace(",", ",");
};