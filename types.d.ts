import { ColorResolvable } from "discord.js";
import {
  Client,
  Partials,
  Collection,
  GatewayIntentBits,
  EmbedBuilder,
} from "discord.js";
import { Connection } from "mysql2/promise";

export type DbTableKey =
  | "usersSelect"
  | "usersUpdate"
  | "clientSelect"
  | "clientUpdate";

export type Bot = Client & {
  db: Connection;
  prefix_commands: Collection;
  slash_commands: Collection;
  user_commands: Collection;
  message_commands: Collection;
  modals: Collection;
  events: Collection;
  dbTables: Record<DbTableKey, string>;
  logger: (title: string, message?: string, color?: ColorResolvable) => Promise<void>;
};
