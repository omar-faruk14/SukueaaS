import { Client } from "@line/bot-sdk";
import axios from "axios";


const lineConfig = {
  channelAccessToken:
    "MIxODpLupR/q1JiD0p6Bqm2/R9L3v+SZxgyLr3CkKnZ4osC5iCAGeD5X/G4VRafltZsNoPvTDX/RwnfSGaVWCiqhqUyhoxQyy/icRsBvtMiUKVEPGrgSp18UTNKblEckBamOrR+FACLJ/PTGa3wS1gdB04t89/1O/w1cDnyilFU=",
  channelSecret: "6eff6ee34af287ead8444ece38e8eb74",
};

const client = new Client(lineConfig);


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
              text: `${userName} さん、このLINE公式つくえラボテスト用全機能を利用するには登録が必要です。さらなるイベント申し込みが便利になります。`,
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



async function showEventList(event) {
  let eventData;
  let eventManagementData;
  let eventManagementMonth;

  try {
    
    const managementResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Management`
    );
    eventManagementData = managementResponse.data;

    
    if (eventManagementData && eventManagementData.length > 0) {
      eventManagementMonth =
        eventManagementData[0].tsukuerabo_event_management_month;
    } else {
      throw new Error("Event management data is not available or empty.");
    }

    
    const eventResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information/Month/${eventManagementMonth}`
    );
    eventData = eventResponse.data;
  } catch (error) {
    console.error("Error fetching event data:", error.message);
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "イベントデータを取得できませんでした。",
    });
  }

  // If no events are found, send a message indicating no events
  if (eventData.length === 0) {
    const currentDate = new Date();
    const noEventMessage = {
      type: "text",
      text: `現在の期間に予定されているイベントはありません。 (${currentDate.toLocaleDateString()} から ${
        eventManagementMonth === "1month"
          ? "1ヶ月以内"
          : eventManagementMonth === "3months"
          ? "3ヶ月以内"
          : "すべて"
      })`,
    };

    return client.replyMessage(event.replyToken, noEventMessage);
  }

  // Generate event buttons based on filtered events
  const eventButtons = eventData.map((eventInfo) => {
    const eventDate = new Date(eventInfo.date);
    const formattedDate = `${eventDate.getMonth() + 1}/${eventDate.getDate()}`;
    const eventTitle = `${formattedDate} ${eventInfo.name}`;

    return {
      type: "box",
      layout: "horizontal",
      margin: "md",
      contents: [
        {
          type: "button",
          style: "primary",
          action: {
            type: "postback",
            label: eventTitle,
            data: `action=showDetails&record=${eventInfo.Record_number}`,
          },
        },
      ],
    };
  });

  const message = {
    type: "flex",
    altText: "イベント一覧",
    contents: {
      type: "bubble",
      body: {
        type: "box",
        layout: "vertical",
        contents: [
          {
            type: "text",
            text: "イベント一覧:",
            weight: "bold",
            size: "lg",
            margin: "md",
          },
          ...eventButtons,
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

//********************************this function for postback url sent********************** */

async function handlePostback(event) {
  const data = event.postback.data;

  if (data.startsWith("action=showDetails")) {
    const recordNumber = data.split("&record=")[1];
    let eventData;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Informatio`
      );
      eventData = response.data;
    } catch (error) {
      console.error("Error fetching event data:", error);
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "イベントデータを取得できませんでした。",
      });
    }

    const selectedEvent = eventData.find(
      (event) => event.Record_number === recordNumber
    );

    if (selectedEvent) {
      const fullEventDetails = `タイトル: ${selectedEvent.name}\n\n日時: ${selectedEvent.date} ${selectedEvent.End_Time}\n\n内容: ${selectedEvent.Event_Line_Details}`;

      // Extract image file key from the event data
      let imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information/${selectedEvent.Event_Image[0].fileKey}?width=240&height=160`; 

      await client.replyMessage(event.replyToken, {
        type: "flex",
        altText: "イベント詳細情報",
        contents: {
          type: "bubble",
          hero: {
            type: "box",
            layout: "vertical",
            backgroundColor: "#F4F4F4", 
            paddingAll: "10px",
            cornerRadius: "md", 
            contents: [
              {
                type: "image",
                url: imageUrl,
                size: "full",
                aspectRatio: "4:3", 
                aspectMode: "fit", 
                action: {
                  type: "uri",
                  uri: imageUrl,
                },
              },
            ],
          },
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: selectedEvent.name,
                wrap: true,
                weight: "bold",
                size: "lg",
                margin: "md",
              },
              {
                type: "text",
                text: fullEventDetails,
                wrap: true,
                size: "sm",
                margin: "md",
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
                  label: "フォームで予約する",
                  uri: "https://liff.line.me/2006381311-2LAgdN1y",
                },
                margin: "md",
              },
              {
                type: "button",
                style: "primary",
                action: {
                  type: "uri",
                  label: "電話で問い合わせる",
                  uri: "tel:+810709276385",
                },
                margin: "md",
              },
            ],
          },
        },
      });
    }
  }
}