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
    //  else if (event.postback.data === "action=乗りました") {
    //   return handleRideAction(event);
    // }
  } else if (event.type === "follow") {
    return handleFollowEvent(event);
  } else if (event.type === "message" && event.message.type === "text") {
    return handleTextMessage(event);
  }
}



// async function handleRideAction(event) {
//   const confirmMessage = {
//     type: "flex",
//     altText: "ご乗車ありがとうございます！",
//     contents: {
//       type: "bubble",
//       body: {
//         type: "box",
//         layout: "vertical",
//         contents: [
//           {
//             type: "text",
//             text: "ありがとうございました。",
//             margin: "md",
//             wrap: true,
//           },
//           {
//             type: "text",
//             text: "以下のボタンを押して、アンケートにも回答お願いします。",
//             margin: "md",
//             wrap: true,
//           },
//           {
//             type: "text",
//             text: "アンケートに回答頂いた方から、先着100名様に飲み物のプレゼントがございます。",
//             margin: "md",
//             wrap: true,
//           },
//           {
//             type: "text",
//             text: "★アンケート回答後に表示される画面をドライバーさんに提示してください。",
//             margin: "md",
//             wrap: true,
//           },
//           {
//             type: "text",
//             text: "先着100名（一人一回限り、なくなり次第終了となります）",
//             margin: "md",
//             wrap: true,
//           },
//         ],
//       },
//       footer: {
//         type: "box",
//         layout: "vertical",
//         contents: [
//           {
//             type: "button",
//             style: "primary",
//             action: {
//               type: "uri",
//               label: "アンケート表示",
//               uri: "https://liff.line.me/2003342118-0nJZWOZ8",
//             },
//           },
//         ],
//         backgroundColor: "#abf7b1",
//       },
//     },
//   };
//   await client.replyMessage(event.replyToken, confirmMessage);
// }

async function handlePostback(event) {
  const data = event.postback.data;

  
  if (data.startsWith("action=showDetails")) {
    const recordNumber = data.split("&record=")[1];
    let eventData;
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information`
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
      const fullEventDetails = `タイトル: ${selectedEvent.tsukuerabo_Line_Title}\n\n日時: ${selectedEvent.tsukuerabo_Line_event_date} ${selectedEvent.tsukuerabo_Line_event_time}\n\n内容: ${selectedEvent.tsukuerabo_Line_Description}`;

      
      await client.replyMessage(event.replyToken, {
        type: "flex",
        altText: "イベント詳細情報",
        contents: {
          type: "bubble",
          body: {
            type: "box",
            layout: "vertical",
            contents: [
              {
                type: "text",
                text: fullEventDetails,
                wrap: true,
                weight: "bold",
                size: "md",
              },

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
              text: `${userName} さん、このLINE公式ふじみMaaS全機能を利用するには登録が必要です。さらなるイベント申し込みが便利になります。`,
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



// Functions to show event list and prompt user registration
// async function showEventList(event) {
//   const message = {
//     type: "flex",
//     altText: "イベント一覧",
//     contents: {
//       type: "bubble",
//       body: {
//         type: "box",
//         layout: "vertical",
//         contents: [
//           {
//             type: "text",
//             text: "以下のボタンをクリックして、イベントリストをご覧ください。",
//             margin: "lg",
//             wrap: true,
//           },
//         ],
//       },
//       footer: {
//         type: "box",
//         layout: "vertical",
//         contents: [
//           {
//             type: "button",
//             style: "primary",
//             action: {
//               type: "uri",
//               label: "イベント一覧",
//               uri: "https://main.d21o7j09u1kv06.amplifyapp.com/all-event",
//             },
//           },
//         ],
//       },
//     },
//   };
//   await client.replyMessage(event.replyToken, message);
// }


async function showEventList(event) {
  let eventData;
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information`
    );
    eventData = response.data;
  } catch (error) {
    console.error("Error fetching event data:", error);
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "イベントデータを取得できませんでした。",
    });
  }


  const eventButtons = eventData.map((eventInfo) => {
    
    const eventDate = new Date(eventInfo.tsukuerabo_Line_event_date);
    const formattedDate = `${eventDate.getMonth() + 1}/${eventDate.getDate()}`; 

  
    const eventTitle = `${formattedDate} ${eventInfo.tsukuerabo_Line_Title}`;

  
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
            text: `${userName} さんはまだご登録されていないようです。\n\nイベントリストを見るにはご登録が必要です。`,
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
