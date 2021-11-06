import { BirthdayEntry } from "../types/Birthday";
import { getLaTime } from "./time";

export async function getDateForUser(user_id: string): Promise<BirthdayEntry | null> {
  const entry = await BIRTHDAY_FNF.get<BirthdayEntry | null>(`birthday/${user_id}`, { type: 'json' });
  return entry;
}

export async function storeDateForUser(user_id: string, birthday: Date, has_year = false): Promise<BirthdayEntry> {
  const existing = await getDateForUser(user_id);
  if (existing && new Date(existing.birthdate).getTime() != birthday.getTime())
    await removeBirthdayForUser(user_id);

  const laTime = getLaTime(birthday);

  await BIRTHDAY_FNF.put(`birthday/${user_id}`, JSON.stringify({
    discord_id: user_id,
    birthdate: birthday.getTime(),
    has_year
  }));

  const keys = await BIRTHDAY_FNF.get<string[]>(`birthdays/${laTime.getMonth() + 1}-${laTime.getDate()}`, { type: 'json' }) || [];
  if (!keys.includes(user_id)) keys.push(user_id);
  await BIRTHDAY_FNF.put(`birthdays/${laTime.getMonth() + 1}-${laTime.getDate()}`, JSON.stringify(keys));

  return {
    discord_id: user_id,
    birthdate: birthday.getTime(),
    has_year
  };
}

export async function getBirthdaysToday(): Promise<BirthdayEntry[]> {
  const dayToCheck = getLaTime(new Date());

  const entries: BirthdayEntry[] = [];
  const keys = await BIRTHDAY_FNF.get<string[]>(`birthdays/${dayToCheck.getMonth() + 1}-${dayToCheck.getDate()}`, { type: 'json' }) || [];
  for await (const key of keys) {
    const entry = await getDateForUser(key);
    if (!entry) continue;
    entries.push(entry);
  }

  return entries;
}

export async function getBirthdaysYesterday(): Promise<BirthdayEntry[]> {
  const dayToCheck = getLaTime(new Date());
  dayToCheck.setDate(dayToCheck.getDate() - 1);

  const entries: BirthdayEntry[] = [];
  const keys = await BIRTHDAY_FNF.get<string[]>(`birthdays/${dayToCheck.getMonth() + 1}-${dayToCheck.getDate()}`, { type: 'json' }) || [];
  for await (const key of keys) {
    const entry = await getDateForUser(key);
    if (!entry) continue;
    entries.push(entry);
  }

  return entries;
}

export async function isBirthdayAckd(user_id: string): Promise<boolean> {
  return !!(await BIRTHDAY_FNF.get(`birthday/${user_id}/ack`));
}

export async function ackUserBirthday(user_id: string): Promise<void> {
  await BIRTHDAY_FNF.put(`birthday/${user_id}/ack`, 'true', { expirationTtl: 86400 });
  return;
}

export async function removeBirthdayForUser(user_id: string): Promise<void> {
  const existing = await getDateForUser(user_id);
  if (!existing) throw { code: 'does_not_exist' };

  await BIRTHDAY_FNF.delete(`birthday/${user_id}`);
  let keys = await BIRTHDAY_FNF.get<string[]>(`birthdays/${new Date(existing?.birthdate).getMonth() + 1}-${new Date(existing?.birthdate).getDate()}`, { type: 'json' }) || [];
  keys = keys.filter(key => key != user_id);
  await BIRTHDAY_FNF.put(`birthdays/${new Date(existing?.birthdate).getMonth() + 1}-${new Date(existing?.birthdate).getDate()}`, JSON.stringify(keys));
  return;
}