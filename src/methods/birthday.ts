import { BirthdayAddition } from "../types/Birthday";
import { CraftedResponse, ParsedRequest } from "../types/Routes";
import { removeBirthdayForUser, storeDateForUser } from "../utils/storage";

export async function AddBirthday(request: ParsedRequest<{ Body: BirthdayAddition }>, response: CraftedResponse) {
  const hasYear = request.body.date.split('/').length == 3;

  const entry = await storeDateForUser(request.body.discord, new Date(request.body.date), hasYear);

  return response.status(201).send(entry);
}

export async function RemoveBirthday(request: ParsedRequest<{ Params: { user_id: string } }>, response: CraftedResponse) {
  await removeBirthdayForUser(request.params.user_id);

  return response.status(204).send();
}
