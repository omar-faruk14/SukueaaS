// Import dependencies
import axios from "axios";

import client from "../../Line/y/utils/connection/clientConnect";
import { NextResponse } from "next/server";


// Kintone configuration
const kintoneConfig = {
  baseUrl: "https://emi-lab-osaka.cybozu.com",
  appId: "48",
  apiToken: "8x9GPZtE6VaTDjeMiY9SNWvjERFQy3wuv1OLxuC7",
};

// Function to handle POST requests
export async function POST(request) {
  try {
    const {
      Number_of_Participants,
      Additional_Comments,
      Line_User_ID,
      Name,
      Date_Time,
      Location,
      Use_of_mobile_services,
      Boarding_and_alighting_place,
      Event_Name,
      
      event_id,
      Desired_meeting_place,
      Application_Type,
      Preferred_Time,
      Preferred_Date,
      Destination,
      Participant_Method,
    } = await request.json();

    // Conditional field modifications based on Application_Type
    let location = Location;
    let dateTime = Date_Time;
    if (Application_Type === "移動のみ申込（自宅登録）") {
      location = "";
      dateTime = "";
    }

    // Construct Kintone record data
    const recordData = {
      app: kintoneConfig.appId,
      record: {
        Number_of_Participants: { value: Number_of_Participants },
        Additional_Comments: { value: Additional_Comments },
        Line_User_ID: { value: Line_User_ID },
        Name: { value: Name },
        Date_Time: { value: dateTime },
        Location: { value: location },
        Use_of_mobile_services: { value: Use_of_mobile_services },
        Boarding_and_alighting_place: { value: Boarding_and_alighting_place },
        Event_Name: { value: Event_Name },
        
        Desired_meeting_place: { value: Desired_meeting_place },
        Application_Type: { value: Application_Type },
        Preferred_Time: { value: Preferred_Time },
        Preferred_Date: { value: Preferred_Date },
        Destination: { value: Destination },
        Participant_Method: { value: Participant_Method },
      },
    };

    // Send the record data to Kintone
    const kintoneResponse = await axios.post(
      `${kintoneConfig.baseUrl}/k/v1/record.json`,
      recordData,
      {
        headers: {
          "X-Cybozu-API-Token": kintoneConfig.apiToken,
          "Content-Type": "application/json",
        },
      }
    );

    // Prepare the dynamic LINE message
    let replyMessageText =
      "イベントへのお申込み、ありがとうございました。\n以下内容で受け付けました。";
    if (Event_Name) replyMessageText += `\n\nイベント名：${Event_Name}`;
    if (Name) replyMessageText += `\n申込者名: ${Name}`;
    if (Number_of_Participants)
      replyMessageText += `\n参加人数：${Number_of_Participants}`;
    if (Use_of_mobile_services)
      replyMessageText += `\n移動サービスのご利用：${Use_of_mobile_services}`;
    if (Boarding_and_alighting_place)
      replyMessageText += `\n住所（乗降場所）：${Boarding_and_alighting_place}`;
    if (Desired_meeting_place)
      replyMessageText += `\n希望集合場所：${Desired_meeting_place}`;
    if (Participant_Method)
      replyMessageText += `\n当日の参加方法：${Participant_Method}`;
    if (Destination) replyMessageText += `\n目的地：${Destination}`;
    if (Preferred_Date) replyMessageText += `\n希望日：${Preferred_Date}`;
    if (Preferred_Time) replyMessageText += `\n希望時：${Preferred_Time}`;
    if (Additional_Comments)
      replyMessageText += `\n追加コメント：${Additional_Comments}`;
    replyMessageText +=
      `\n\nお問合せ、キャンセル等については以下、イベント主催者様までご連絡いただくか、` +
      `このメッセージへのリプライとしてご連絡をお願いします。\n\nURL：https://d2yd11npfr0aab.cloudfront.net/facilities/${event_id}`;

   
    const replyMessage = { type: "text", text: replyMessageText };

    // Send the message to LINE
    await client.pushMessage(Line_User_ID, replyMessage);

    // Respond with success message
    return NextResponse.json({
      message: "Record inserted successfully into the target Kintone instance",
      data: kintoneResponse.data,
    });
  } catch (error) {
    console.error("Error inserting record:", error);
    return NextResponse.json(
      { error: "Error inserting record into the target instance" },
      { status: 500 }
    );
  }
}

// const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
// const apiToken = "8x9GPZtE6VaTDjeMiY9SNWvjERFQy3wuv1OLxuC7";
// const appId = 48;

// export async function GET(request) {
//   try {
//     const getRecordsResponse = await axios.get(
//       `${kintoneUrl}/records.json?app=${appId}`,
//       {
//         headers: {
//           "X-Cybozu-API-Token": apiToken,
//         },
//       }
//     );

//     const records = getRecordsResponse.data.records.map((record) => ({
//       id: record.$id.value,
//       Number_of_Participants: record.Number_of_Participants.value,
//       Additional_Comments: record.Additional_Comments.value,
//       Name: record.Name.value,
//       Line_User_ID: record.Line_User_ID.value,
//       Date_Time: record.Date_Time.value,
//       Location: record.Location.value,
//       Use_of_mobile_services: record.Use_of_mobile_services.value,
//       Boarding_and_alighting_place: record.Boarding_and_alighting_place.value,
//       Event_Name: record.Event_Name.value,
//       Desired_meeting_place: record.Desired_meeting_place.value,
//       Application_Type: record.Application_Type.value,
//       Preferred_Time: record.Preferred_Time.value,
//       Preferred_Date: record.Preferred_Date.value,
//       Destination: record.Destination.value,
//       Participant_Method: record.Participant_Method.value,
//     }));
//     return NextResponse.json(records);
//   } catch (error) {
//     console.error(error);
//     return NextResponse.json({ error: "Error retrieving records" });
//   }
// }