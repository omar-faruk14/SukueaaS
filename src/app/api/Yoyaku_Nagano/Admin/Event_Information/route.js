import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "M0GkaBFNuv2j37Y3mRpeKaiEUHZcixMBJyEHupHf";
const appId = 67;
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
    }));
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
