import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "MMugrtttCZQpZiXZgD9ML20sV0LybUbK744qQNKZ";
const appId = 80;

export async function GET(request, { params }) {
  const Line_User_ID = params.LineID;
  try {
    // Adding a filter to the query based on Line_User_ID
    const getRecordsResponse = await axios.get(
      `${kintoneUrl}/records.json?app=${appId}&query=Line_User_ID="${Line_User_ID}"`,
      {
        headers: {
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );

    const records = getRecordsResponse.data.records.map((record) => ({
      Record_number: record.Record_number.value,
      Registration_Line_Name: record.Registration_Line_Name.value,
      Registration_Name: record.Registration_Name.value,
      Registration_Address: record.Registration_Address.value,
      Registration_Phone: record.Registration_Phone.value,
      Registration_Age: record.Registration_Age.value,
      Registration_Gender: record.Registration_Gender.value,
      Registration_Driver_Volunteer: record.Registration_Driver_Volunteer.value,
      Registration_Watch_Volunteer: record.Registration_Watch_Volunteer.value,
      Line_User_ID: record.Line_User_ID.value,
    }));
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}
