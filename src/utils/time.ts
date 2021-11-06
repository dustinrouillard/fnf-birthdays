export function getLaTime(dte: Date): Date {
  const date = new Date(dte);
  date.setTime(date.getTime() + date.getTimezoneOffset() * 60 * 1000 - (7) * 60 * 60 * 1000);
  return date;
}