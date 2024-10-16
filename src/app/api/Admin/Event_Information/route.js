import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "BoPld7DD61iclYtD9Gz4ljNi4Xp2sXXlSbrETcLr";
const appId = 32;
export const dynamic = "force-dynamic";
export async function GET(request) {
  try {
    const getRecordsResponse = await axios.get(
      `${kintoneUrl}/records.json?app=${appId}`,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );

    const records = getRecordsResponse.data.records.map((record) => ({
      Record_number: record.Record_number.value,
      tsukuerabo_Line_event_image: record.tsukuerabo_Line_event_image.value,
      tsukuerabo_Line_Description: record.tsukuerabo_Line_Description.value,
      tsukuerabo_Line_event_time: record.tsukuerabo_Line_event_time.value,
      tsukuerabo_Line_event_date: record.tsukuerabo_Line_event_date.value,
      tsukuerabo_Line_Title: record.tsukuerabo_Line_Title.value,
      
    }));
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
