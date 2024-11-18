import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "JO3jb3FJbac3Isi73n43HyTTkMvFGHedTx9PbDty";
const appId = 46;

export async function GET(request, { params }) {
  const { Record_number } = params;

  try {   
    const query = `Record_number = "${Record_number}"`;
    const getRecordsResponse = await axios.get(
      `${kintoneUrl}/records.json?app=${appId}&query=${encodeURIComponent(
        query
      )}`,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );
    const record = getRecordsResponse.data.records[0];

    if (!record) {
      return NextResponse.json({ error: "Record not found" });
    }
    const result = {
      Record_number: record.Record_number.value,
      id: record.id.value,
      name: record.name.value,
      date: record.date.value,
      End_Time: record.End_Time.value,
      locations_id: record.locations_id.value,
      location: record.location.value,
      details: record.details.value,
      Event_Line_Details: record.Event_Line_Details.value,
      Event_Image: record.Event_Image.value,
      Event_Link: record.Event_Link.value,
      Publish_Check: record.Publish_Check.value,
      Organizer_Comment: record.Organizer_Comment.value,
      Submit_End_Time: record.Submit_End_Time.value,
      Application_Type_Moshikomi: record.Application_Type_Moshikomi.value,
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error retrieving record:", error);
    return NextResponse.json({ error: "Error retrieving record" });
  }
}



export async function POST(request,{ params }) {
  try {
    const { Record_number } = params;
    const { userId } = await request.json();
    // console.log("Backend User_ID",userId);
    // Fetch event data for the specific record number
    const eventResponse = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information/RecordID/${Record_number}`
    );

    const eventData = eventResponse.data;

    const response2 = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Management`
    );

    const phoneData= response2.data;
    const phoneNumber=phoneData[0].tsukuerabo_event_management_phone;

    if (!eventData) {
      return new Response(JSON.stringify({ error: "Event not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const formatDate = (dateString) => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      };
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
    const formattedDate = formatDate(eventData.date);
    const formattedTime = formatTime(eventData.date);

    
    let fullEventDetails = `📅 日付: ${formattedDate}\n⏰ 時間: ${formattedTime}-${eventData.End_Time}\n\n${eventData.Event_Line_Details}\n\n`;

    // only if it exists
    if (eventData.Event_Link) {
      fullEventDetails += `URL: ${eventData.Event_Link}`;
    }
    const imageUrl = `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Admin/Event_Information/${eventData.Event_Image[0].fileKey}?width=240&height=160`;

    // Flex message template
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
              text: fullEventDetails,
              wrap: true,
              size: "sm",
              margin: "md",
              action: eventData.Event_Link
                ? { type: "uri", uri: eventData.Event_Link }
                : null, // Make it clickable if link exists
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
                uri: `${process.env.NEXT_PUBLIC_API_BASE_URL}/Users/Moshikomi?event_id=${Record_number}&user_id=${userId}`,
              },
              margin: "md",
            },
            {
              type: "button",
              style: "primary",
              action: {
                type: "uri",
                label: "電話で問い合わせる",
                uri: `tel:${phoneNumber}`,
              },
              margin: "md",
            },
          ],
          backgroundColor: "#abf7b1",
        },
      },
    };

    return new Response(JSON.stringify(flexMessage), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(
      "Error fetching event data or constructing flex message:",
      error
    );
    return new Response(
      JSON.stringify({
        error: "Failed to fetch event data or generate message",
      }),
      { status: 500 }
    );
  }
}


