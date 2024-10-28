import axios from "axios";
import { NextResponse } from "next/server";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "8x9GPZtE6VaTDjeMiY9SNWvjERFQy3wuv1OLxuC7";
const appId = 48;

export async function GET(request,{ params }) {
    const Line_User_ID = params.Line_User_ID;
  try {
      const getRecordsResponse = await axios.get(
        `${kintoneUrl}/records.json?app=${appId}&query=Line_User_ID="${Line_User_ID}"`,
        {
          headers: {
            "X-Cybozu-API-Token": apiToken,
          },
        }
      );


    const records = getRecordsResponse.data.records.map((record) => ({
      id: record.$id.value,
      Number_of_Participants: record.Number_of_Participants.value,
      Additional_Comments: record.Additional_Comments.value,
      Name: record.Name.value,
      Line_User_ID: record.Line_User_ID.value,
      Date_Time: record.Date_Time.value,
      Location: record.Location.value,
      Use_of_mobile_services: record.Use_of_mobile_services.value,
      Boarding_and_alighting_place: record.Boarding_and_alighting_place.value,
      Event_Name: record.Event_Name.value,
      Desired_meeting_place: record.Desired_meeting_place.value,
      Application_Type: record.Application_Type.value,
      Preferred_Time: record.Preferred_Time.value,
      Preferred_Date: record.Preferred_Date.value,
      Destination: record.Destination.value,
      Participant_Method: record.Participant_Method.value,
    }));
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
