import { NextResponse } from "next/server";
import axios from "axios";
// Import LINE Client
const { Client } = require("@line/bot-sdk");

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "MMugrtttCZQpZiXZgD9ML20sV0LybUbK744qQNKZ";
const appId = 80;

const lineConfig = {
  channelAccessToken: process.env.NEXT_PUBLIC_LINE_CHANNEL_ACCESS_TOKEN_2,
  channelSecret: process.env.NEXT_PUBLIC_LINE_CHANNEL_SECRET_2,
};





const lineClient = new Client(lineConfig);

export async function POST(request) {
  const data = await request.json();

  try {
    const recordData = {
      app: appId,
      record: {
        Registration_Line_Name: { value: data.Registration_Line_Name },
        Registration_Name: { value: data.Registration_Name },
        Registration_Address: { value: data.Registration_Address },
        Registration_Phone: { value: data.Registration_Phone },
        Registration_Age: { value: data.Registration_Age },
        Registration_Gender: { value: data.Registration_Gender },
        
        Line_User_ID: { value: data.Line_User_ID },
      },
    };

    const response = await fetch(`${kintoneUrl}/record.json`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Cybozu-API-Token": apiToken,
      },
      body: JSON.stringify(recordData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

 
    const replyMessage = {
      type: "text",
      text: `登録が完了しました。\n\n名前: ${data.Registration_Name}\nお住いの地域: ${data.Registration_Address}\n連絡先: ${data.Registration_Phone}\n年代: ${data.Registration_Age}\n性別: ${data.Registration_Gender}`,
    };

    await lineClient.pushMessage(data.Line_User_ID, replyMessage);

    return NextResponse.json({
      message: "Data uploaded successfully to Kintone and LINE message sent.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}

export async function PUT(request) {
  const data = await request.json();

  try {
    const query = `Line_User_ID = "${data.Line_User_ID}"`;
    const getRecordResponse = await axios.get(`${kintoneUrl}/records.json`, {
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
      params: {
        app: appId,
        query: query,
      },
    });

    const getRecordData = getRecordResponse.data;
    if (!getRecordData.records.length) {
      console.error("No records found for Line_User_ID:", data.Line_User_ID);
      return NextResponse.json(
        { error: "No record found to update." },
        { status: 404 }
      );
    }

    const recordId = getRecordData.records[0].$id.value;

    const recordData = {
      app: appId,
      id: recordId,
      record: {
        Registration_Line_Name: { value: data.Registration_Line_Name },
        Registration_Name: { value: data.Registration_Name },
        Registration_Address: { value: data.Registration_Address },
        Registration_Phone: { value: data.Registration_Phone },
        Registration_Age: { value: data.Registration_Age },
        Registration_Gender: { value: data.Registration_Gender },
        Line_User_ID: { value: data.Line_User_ID },
      },
    };

    const updateResponse = await axios.put(
      `${kintoneUrl}/record.json`,
      recordData,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
          "Content-Type": "application/json",
        },
      }
    );
    const replyMessage = {
      type: "text",
      text: `登録情報が更新されました。\n\n名前: ${data.Registration_Name}\n住所: ${data.Registration_Address}`,
    };

    await lineClient.pushMessage(data.Line_User_ID, replyMessage);

    return NextResponse.json({
      message: "Data updated successfully in Kintone and LINE message sent.",
      response: updateResponse.data,
    });
  } catch (error) {
    console.error("Error during PUT operation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
