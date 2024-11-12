import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "8ojdjZ9PHAsV38lC5tKx6nc23ufwXAfLCr6l9TdS";
const appId = 44;
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
      id: record.id.value,
      lat: record.lat.value,
      lon: record.lon.value,
      title: record.title.value,
      description: record.description.value,
      group: record.group.value,
      Serial_Number: record.Serial_Number.value,
    }));
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}

export async function PUT(request) {
  try {
    const { Record_number, location_id_0, Facilities_detail_title } =
      await request.json();

    const updateData = {
      app: appId,
      id: Record_number,
      record: {
        location_id_0: {
          value: location_id_0,
        },
        Facilities_detail_title: {
          value: Facilities_detail_title,
        },
        Facilities_detail_title: {
          value: Facilities_detail_title,
        },
      },
    };

    // Send the request to Kintone API to update the record
    const response = await axios.put(`${kintoneUrl}/record.json`, updateData, {
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Record updated successfully",
    });
  } catch (error) {
    console.error("Error updating record:", error);
    return NextResponse.json({
      success: false,
      message: `Error updating record: ${error.message}`,
    });
  }
}
