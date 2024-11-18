import axios from "axios";
import client from "./connection/clientConnect";

export async function showEventList(event) {
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
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Yoyaku_Nagano/Admin/Event_Information/Month/${eventManagementMonth}`
    );
    eventData = eventResponse.data;
  } catch (error) {
    console.error("Error fetching event data:", error.message);
    return client.replyMessage(event.replyToken, {
      type: "text",
      text: "イベントデータを取得できませんでした。",
    });
  }

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

  // Sort eventData by date (upcoming events first)
  eventData.sort((a, b) => new Date(a.date) - new Date(b.date));

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

