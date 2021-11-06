import { CraftedResponse, ParsedRequest } from "../types/Routes";

export async function Health(request: ParsedRequest, response: CraftedResponse) {
  return response.status(200).send({ working: true });
}
