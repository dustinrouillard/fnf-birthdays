export interface User {
  accent_color: number;
  avatar: string;
  banner: string;
  banner_color: string;
  discriminator: string;
  id: string;
  public_flags: number;
  username: string;
}

export interface DiscordInteraction {
  application_id: string;
  channel_id: string;
  data: Data;
  guild_id: string;
  id: string;
  member: Member;
  token: string;
  type: number;
  version: number;
}

export interface Data {
  id: string;
  name: string;
  options: Option[];
  type: number;
}

export interface Option {
  name: string;
  type: number;
  value: number | string;
  options?: Option[];
}

export interface Member {
  avatar: null;
  communication_disabled_until: null;
  deaf: boolean;
  is_pending: boolean;
  joined_at: string;
  mute: boolean;
  nick: string;
  pending: boolean;
  permissions: string;
  premium_since: null;
  roles: string[];
  user: User;
}

export interface User {
  avatar: string;
  discriminator: string;
  id: string;
  public_flags: number;
  username: string;
}
