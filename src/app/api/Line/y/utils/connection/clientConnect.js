// lineClient.js
import { Client } from "@line/bot-sdk";

const lineConfig = {
  channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET,
};

const client = new Client(lineConfig);

export default client;
