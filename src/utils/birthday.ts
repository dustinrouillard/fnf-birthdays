export function getAge(date: Date): number {
  const today = new Date();

  let age = today.getFullYear() - date.getFullYear();
  const month = today.getMonth() - date.getMonth();

  if (month < 0 || (month === 0 && today.getDate() < date.getDate())) age--;

  return age;
}