import { Client, Partials, Collection, GatewayIntentBits, EmbedBuilder } from "discord.js";
import { Connection } from "mysql2/promise";

import {PreparedStatementInfo} from "mysql2/promise";

/* type DBStatementResult = Awaited<ReturnType<PreparedStatementInfo['execute']>>[0];

// if type is not an array, make it an array
type Arrayify<T> = T extends any[] ? T : [T]; */

export type Bot = Client & {
  db: Connection;
  prefix_commands: Collection;
  slash_commands: Collection;
  user_commands: Collection;
  message_commands: Collection;
  modals: Collection;
  events: Collection;
  /* dbStatement: (
    query: string,
    args: any[]
  ) => Promise<Arrayify<DBStatementResult>> */
};
