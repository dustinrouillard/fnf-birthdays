import nacl from "tweetnacl";
import { CraftedResponse, ParsedRequest } from "../types/Routes";
import { DiscordInteraction } from '../types/Discord';
import { removeBirthdayForUser, storeDateForUser } from "../utils/storage";

export async function DiscordInteraction(request: ParsedRequest<{ Body: DiscordInteraction }>, response: CraftedResponse) {
  const signature = request.headers['x-signature-ed25519'];
  const timestamp = request.headers['x-signature-timestamp'];
  const body = JSON.stringify(request.body);

  const isVerified = nacl.sign.detached.verify(
    Buffer.from(timestamp + body),
    Buffer.from(signature, 'hex'),
    Buffer.from(DISCORD_PUBLIC_KEY, 'hex')
  );

  if (!isVerified) return response.status(401).send('invalid request signature');

  switch (request.body.type) {
    case 1: {
      return response.status(200).send({ type: 1 });
    }
    case 2: {
      switch (request.body.data.name) {
        case 'birthday': {
          switch (request.body.data.options[0].name) {
            case 'set': {
              if (!request.body.data.options[0].options) break;
              const hasYear = !!request.body.data.options[0].options[2];
              const date = new Date(`${request.body.data.options[0].options[0].value}/${request.body.data.options[0].options[1].value}${hasYear ? `/${request.body.data.options[0].options[2].value}` : ''}`);
              await storeDateForUser(request.body.member.user.id, date, hasYear);

              return response.status(200).send({
                type: 4,
                data: {
                  flags: 64,
                  embeds: [{
                    title: 'Birthday set!', description: `Your birthday has been set as **${date.getMonth() + 1}/${date.getDate()}**\n\n${hasYear ? `You gave us the year as **${date.getFullYear()}** so we'll calcuate your age when the birthday message goes out in the birthdays channel, do this command again without the year if you would not like to have your age in the greeting.` : 'You didn\'t give us a year, so we won\t be able to calcuate your age when we wish you a happy birthday, do this command again if you\'d like to have your age in the greeting.'}`,
                    color: 12387127,
                    footer: { text: 'dstn.to - fnf birthdays' }
                  }]
                }
              })
            }
            case 'delete': {
              await removeBirthdayForUser(request.body.member.user.id);
              return response.status(200).send({
                type: 4,
                data: {
                  flags: 64,
                  embeds: [{
                    title: 'Birthday removed!', description: `Your birthday has been removed from fnf birthdays, you can always set it up again with \`/birthday set\` if you'd like to have a birthday greeting.'}`,
                    color: 2382872,
                    footer: { text: 'dstn.to - fnf birthdays' }
                  }]
                }
              })
            }
          }
        }
      }

      break;
    }
  }

  return response.status(200).send({ working: true });
}
