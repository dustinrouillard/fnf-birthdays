import { User } from "../types/Discord";

export async function assignBirthdayRole(id: string): Promise<void> {
  const req = await fetch(`https://discord.com/api/v6/guilds/${GUILD_ID}/members/${id}/roles/${BIRTHDAY_ROLE_ID}`, {
    method: 'PUT',
    headers: {
      'X-Audit-Log-Reason': 'Added birthday role via automation',
      authorization: `Bot ${DISCORD_TOKEN}`
    }
  });

  if (req.status != 204) throw { code: 'failed_to_assign_role' };

  return;
}

export async function removeBirthdayRole(id: string): Promise<void> {
  const req = await fetch(`https://discord.com/api/v6/guilds/${GUILD_ID}/members/${id}/roles/${BIRTHDAY_ROLE_ID}`, {
    method: 'DELETE',
    headers: {
      'X-Audit-Log-Reason': 'Removed birthday role via automation',
      authorization: `Bot ${DISCORD_TOKEN}`
    }
  });

  if (req.status != 204) throw { code: 'failed_to_assign_role' };

  return;
}

export async function sendBirthdayMessage(user_id: string, age?: number) {
  const user: User = await fetch(`https://discord.com/api/v6/users/${user_id}`, { headers: { authorization: `Bot ${DISCORD_TOKEN}` } }).then(r => r.json());

  await fetch(BIRTHDAY_WEBHOOK, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      embeds: [{
        title: 'Birthday today!',
        description: `Today is ${user.username}'s birthday, hope you have a great day.${age ? `\n\nThey turn ${age.toLocaleString()} today.` : ''}`,
        footer: { text: 'dstn.to - fnf birthdays' },
        timestamp: new Date().toISOString()
      }]
    })
  });
}