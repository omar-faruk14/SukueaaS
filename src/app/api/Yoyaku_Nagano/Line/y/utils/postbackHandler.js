
// import axios from "axios";
// import client from "./connection/clientConnect";


// export async function handlePostback(event) {
//   const data = event.postback.data;
//   const userId = event.source.userId;
//   console.log(userId);

//   if (data.startsWith("action=showDetails")) {
//     const recordNumber = data.split("&record=")[1];

//     let flexMessage;
//     try {
//       const response = await axios.post(
//         `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information/RecordID/${recordNumber}`,
//         {
//           userId: userId,  
          
//         }
//       );
//       flexMessage = response.data;
//     } catch (error) {
//       console.error(
//         "Error fetching event data or message from backend:",
//         error
//       );
//       return client.replyMessage(event.replyToken, {
//         type: "text",
//         text: "イベントデータを取得できませんでした。",
//       });
//     }
//     await client.replyMessage(event.replyToken, flexMessage);
//   }
// }


import axios from "axios";
import client from "./connection/clientConnect";

export async function handlePostback(event) {
  const data = event.postback.data;
  const userId = event.source.userId;
  // console.log(userId);

  if (data.startsWith("action=showDetails")) {
    const recordNumber = data.split("&record=")[1];

    try {
      // Fetch event data
      const eventResponse = await axios.get(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Yoyaku_Nagano/Admin/Event_Information/RecordID/${recordNumber}`
      );
      const eventData = eventResponse.data;


      // Formatting helpers
      const formatDate = (dateString) => {
        const options = { year: "numeric", month: "2-digit", day: "2-digit" };
        const formattedDate = new Date(dateString).toLocaleDateString(
          "ja-JP",
          options
        );
        const [year, month, day] = formattedDate.split("/");
        return `${year}年${month}月${day}日`;
      };

      const formatTime = (dateString) => {
        const options = {
          hour: "numeric",
          minute: "numeric",
          hour12: false,
          timeZone: "Asia/Tokyo",
        };
        return new Date(dateString).toLocaleTimeString("ja-JP", options);
      };

      // Format event data
      const formattedDate = formatDate(eventData.date);
      const formattedTime = formatTime(eventData.date);
      const dateAndTimeText = `📅 日付: ${formattedDate}\n⏰ 時間: ${formattedTime}-${eventData.End_Time}`;

      let fullEventDetails = `${eventData.Event_Line_Details}\n\n`;
      const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Yoyaku_Nagano/Admin/Event_Information/${eventData.Event_Image[0].fileKey}?width=240&height=160`;

      // Construct Flex message
      const flexMessage = {
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
                text: eventData.name,
                wrap: true,
                weight: "bold",
                size: "md",
                margin: "md",
              },
              {
                type: "text",
                text: dateAndTimeText, // Separate date and time text
                wrap: true,
                size: "sm",
                margin: "md",
              },

              {
                type: "text",
                text: `🏠 ${eventData.location}`, // Separate date and time text
                size: "sm",
                weight: "regular",
                // decoration: "underline",
                color: "#007AFF",
                action: {
                  type: "uri",
                  uri: `${process.env.NEXT_PUBLIC_API_BASE_URL}/Nagano_Reservation/map/mapInsideFacilities/${eventData.locations_id}`,
                },
                margin: "md",
                wrap: true,
              },
              {
                type: "text",
                text: fullEventDetails,
                wrap: true,
                size: "sm",
                margin: "md",
              },
              ...(eventData.Event_Link
                ? [
                    {
                      type: "text",
                      text: `🔗 ${eventData.Event_Link}`,
                      size: "sm",
                      weight: "regular",
                      decoration: "underline",
                      color: "#000000",
                      action: {
                        type: "uri",
                        uri: eventData.Event_Link,
                      },
                      margin: "md",
                      wrap: true,
                    },
                  ]
                : []),
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
                  uri: `${process.env.NEXT_PUBLIC_API_BASE_URL}/Users/Moshikomi?event_id=${recordNumber}&user_id=${userId}`,
                },
                margin: "md",
              },
            ],
            backgroundColor: "#abf7b1",
          },
        },
      };

      // Send the Flex message
      await client.replyMessage(event.replyToken, flexMessage);
    } catch (error) {
      console.error(
        "Error fetching event data or constructing flex message:",
        error
      );
      await client.replyMessage(event.replyToken, {
        type: "text",
        text: "イベントデータを取得できませんでした。",
      });
    }
  }
}

