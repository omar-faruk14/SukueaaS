
import axios from "axios";
import client from "./connection/clientConnect";


export async function handlePostback(event) {
  const data = event.postback.data;

  if (data.startsWith("action=showDetails")) {
    const recordNumber = data.split("&record=")[1];

    let flexMessage;
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information/RecordID/${recordNumber}`
      );
      flexMessage = response.data;
    } catch (error) {
      console.error(
        "Error fetching event data or message from backend:",
        error
      );
      return client.replyMessage(event.replyToken, {
        type: "text",
        text: "イベントデータを取得できませんでした。",
      });
    }
    await client.replyMessage(event.replyToken, flexMessage);
  }
}
