import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "M0GkaBFNuv2j37Y3mRpeKaiEUHZcixMBJyEHupHf";
const appId = 67;

export async function GET(request, { params }) {
  const { month } = params;
  const currentDate = new Date();
  const currentDateString = currentDate.toISOString().split("T")[0];
  let query = `date >= "${currentDateString}" and Publish_Check in ("Yes")`;



  if (month === "1month") {
    const oneMonthLater = new Date(currentDate);
    oneMonthLater.setMonth(currentDate.getMonth() + 1);
    const oneMonthLaterString = oneMonthLater.toISOString().split("T")[0];
    query += ` and date <= "${oneMonthLaterString}"`;
  } else if (month === "3months") {
    const threeMonthsLater = new Date(currentDate);
    threeMonthsLater.setMonth(currentDate.getMonth() + 3);
    const threeMonthsLaterString = threeMonthsLater.toISOString().split("T")[0];
    query += ` and date <= "${threeMonthsLaterString}"`;
  }

  try {
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

    const records = getRecordsResponse.data.records.map((record) => ({
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
    }));

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error retrieving records:", error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
