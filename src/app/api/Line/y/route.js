
import axios from "axios";
import {handlePostback} from './utils/postbackHandler';
import {showEventList} from './utils/showDetails';
import client from "./utils/connection/clientConnect";

export async function POST(request) {
  try {
    const body = await request.json();
    const result = await Promise.all(body.events.map(handleEvent));
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}


async function handleEvent(event) {
  
  if (event.type === "postback" && event.postback && event.postback.data) {
    if (event.postback.data.startsWith("action=showDetails")) {
      return handlePostback(event); }
  } else if (event.type === "follow") {
    return handleFollowEvent(event);
  } else if (event.type === "message" && event.message.type === "text") {
    return handleTextMessage(event);
  }
}


async function handleFollowEvent(event) {
  try {
    const userName = await getUserName(event.source.userId);
    const welcomeMessage = {
      type: "flex",
      altText: "ようこそ！",
      contents: {
        type: "bubble",
        body: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "text",
              text: `${userName} さん、このアプリの全機能を利用するには登録が必要です。さらなるイベント申し込みが便利になります。`,
              margin: "lg",
              wrap: true,
            },
          ],
        },
        footer: {
          type: "box",
          layout: "vertical",
          contents: [
            {
              type: "button",
              style: "primary",
              action: {
                type: "uri",
                label: "こちらから登録",
                uri: "https://liff.line.me/2006381311-XDQEmkPw",
              },
            },
          ],
        },
      },
    };
    await client.replyMessage(event.replyToken, welcomeMessage);
  } catch (error) {
    console.error("Error fetching user profile:", error);
    await client.replyMessage(event.replyToken, {
      type: "text",
      text: "エラーが発生しました。",
    });
  }
}
async function handleTextMessage(event) {
  const receivedText = event.message.text.toLowerCase();
  const lineUserId = event.source.userId;

  let userData;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Users/Registration/ID/${lineUserId}`
    );
    userData = response.data;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "データを取得する際にエラーが発生しました。後でもう一度お試しください。",
    });
  }

  const userExists = userData.some((user) => user.Line_User_ID === lineUserId);

  if (receivedText === "イベントを確認・予約する") {
    return userExists ? showEventList(event) : promptUserRegistration(event);
  } else if (receivedText === "登録情報を確認、変更する") {
    return userExists ? showSettingsMenu(event) : promptUserRegistration(event);
  }
}


async function getUserName(userId) {
  try {
    const userProfile = await client.getProfile(userId);
    return userProfile.displayName;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return "ゲスト";
  }
}

async function showSettingsMenu(event) {
  const message = {
    type: "flex",
    altText: "設定メニュー",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "設定メニュー:",
            weight: "bold",
            size: "lg",
            margin: "md",
          },
          {
            type: "button",
            style: "primary",
            action: {
              type: "uri",
              label: "設定画面を開く",
              uri: `https://liff.line.me/2006381311-2LAgdN1y`,
            },
            margin: "md",
          },
        ],
      },
    },
  };

  await client.replyMessage(event.replyToken, message);
}




async function promptUserRegistration(event) {
  const userName = await getUserName(event.source.userId);
  const message = {
    type: "flex",
    altText: "notRegister!",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: `${userName} さんはまだご登録されていないようです。\n\nご利用には登録が必要です。\n\n次のステップに進むにはボタンを押してください。`,
            margin: "lg",
            wrap: true,
          },
        ],
      },
      footer: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "button",
            style: "primary",
            action: {
              type: "uri",
              label: "こちらから登録",
              uri: "https://liff.line.me/2006381311-XDQEmkPw",
            },
          },
        ],
        backgroundColor: "#abf7b1",
      },
    },
  };
  await client.replyMessage(event.replyToken, message);
}

