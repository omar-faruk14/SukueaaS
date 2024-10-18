import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "o2H8v4AGU1g54XWEIfJYvARvzfu3O0Gp9WckZN6N";
const appId = 31;
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
      tsukuerabo_event_management_phone: record.tsukuerabo_event_management_phone.value,
      tsukuerabo_event_management_month: record.tsukuerabo_event_management_month.value,

    }));
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}


export async function PUT(request) {
  try {
    const {
      Record_number,
      tsukuerabo_event_management_phone,
      tsukuerabo_event_management_month,
    } = await request.json();

    // Construct data payload for Kintone API
    const updateData = {
      app: appId,
      id: Record_number, // Use the record number to identify the record
      record: {
        tsukuerabo_event_management_phone: {
          value: tsukuerabo_event_management_phone,
        },
        tsukuerabo_event_management_month: {
          value: tsukuerabo_event_management_month,
        },
      },
    };

    // Make PUT request to update record in Kintone
    await axios.put(`${kintoneUrl}/record.json`, updateData, {
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Error updating record",
    });
  }
}