import { NextResponse } from "next/server";
import axios from "axios";

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

    return NextResponse.json({
      message: "Data uploaded successfully to Kintone.",
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

    return NextResponse.json({
      message: "Data updated successfully in Kintone.",
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
