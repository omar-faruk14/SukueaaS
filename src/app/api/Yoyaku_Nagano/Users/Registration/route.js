import { NextResponse } from "next/server";
import axios from "axios";
// Import LINE Client
const { Client } = require("@line/bot-sdk");

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "2y1jtdTXfHArGgdAzKlHiPFTf0IluCplHFDZOF8x";
const appId = 30;

const lineConfig = {
  channelAccessToken:
    "MIxODpLupR/q1JiD0p6Bqm2/R9L3v+SZxgyLr3CkKnZ4osC5iCAGeD5X/G4VRafltZsNoPvTDX/RwnfSGaVWCiqhqUyhoxQyy/icRsBvtMiUKVEPGrgSp18UTNKblEckBamOrR+FACLJ/PTGa3wS1gdB04t89/1O/w1cDnyilFU=",
  channelSecret: "6eff6ee34af287ead8444ece38e8eb74",
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
        Registration_Driver_Volunteer: {
          value: data.Registration_Driver_Volunteer,
        },
        Registration_Watch_Volunteer: {
          value: data.Registration_Watch_Volunteer,
        },
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
      text: `登録が完了しました。\n\n名前: ${data.Registration_Name}\n住所: ${data.Registration_Address}\n電話: ${data.Registration_Phone}\n年代: ${data.Registration_Age}\n性別: ${data.Registration_Gender}\n運転ボランティアとして参加 に興味ある: ${data.Registration_Driver_Volunteer}\n見守りボランティアとしての参加に興味ある: ${data.Registration_Watch_Volunteer}`,
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
        Registration_Driver_Volunteer: {
          value: data.Registration_Driver_Volunteer,
        },
        Registration_Watch_Volunteer: {
          value: data.Registration_Watch_Volunteer,
        },
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
