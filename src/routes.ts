import Route from 'route-parser';

import { Health } from './methods/health';
import { AddBirthday, RemoveBirthday } from './methods/birthday';
import { DiscordInteraction } from './methods/interactions';

import { RouteDefinition } from './types/Routes';
import { Management } from './utils/middleware';

export const routes: RouteDefinition[] = [
  { route: new Route('/health'), method: 'GET', handler: Health },
  { route: new Route('/add'), method: 'POST', handler: AddBirthday, middlewares: [Management] },
  { route: new Route('/del/:user_id'), method: 'DELETE', handler: RemoveBirthday, middlewares: [Management] },
  { route: new Route('/interactions'), method: 'POST', handler: DiscordInteraction },
];
