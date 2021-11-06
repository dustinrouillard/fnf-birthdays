import { getAge } from "../utils/birthday";
import { assignBirthdayRole, removeBirthdayRole, sendBirthdayMessage } from "../utils/discord";
import { ackUserBirthday, getBirthdaysToday, getBirthdaysYesterday, isBirthdayAckd } from "../utils/storage";

export async function RunDaily() {
  return new Promise(async (resolve) => {
    console.log('Running daily tasks');

    const birthdays = await getBirthdaysToday();
    for (const birthday of birthdays) {
      if (!await isBirthdayAckd(birthday.discord_id)) {
        await ackUserBirthday(birthday.discord_id);
        await assignBirthdayRole(birthday.discord_id);
        await sendBirthdayMessage(birthday.discord_id, birthday.has_year ? getAge(new Date(birthday.birthdate)) : undefined);
      }
    }

    const previousBirthdays = await getBirthdaysYesterday();
    for (const birthday of previousBirthdays) {
      await removeBirthdayRole(birthday.discord_id);
    }

    return resolve(true);
  });
}