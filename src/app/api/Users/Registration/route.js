import axios from "axios";
import { NextResponse } from "next/server";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "2y1jtdTXfHArGgdAzKlHiPFTf0IluCplHFDZOF8x";
const appId = 30;

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
        Registration_Driver_Volunteer: { value: data.Registration_Driver_Volunteer},
        Registration_Watch_Volunteer: {value: data.Registration_Watch_Volunteer},
        Line_User_ID: {value: data.Line_User_ID},
      },
    };

    const createRecordResponse = await axios.post(
      `${kintoneUrl}/record.json`,
      recordData,
      {
        headers: {
          "Content-Type": "application/json",
          "X-Cybozu-API-Token": apiToken,
        },
      }
    );

    console.log("Received coordinates:", data);
    return NextResponse.json({
      message: "Data uploaded successfully to Kintone.",
      coordinates: {
        latitude: data.latitude,
        longitude: data.longitude,
      },
      kintoneResponse: createRecordResponse.data,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Internal Server Error" });
  }
}
