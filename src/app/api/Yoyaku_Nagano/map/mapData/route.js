import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "2it8SI8qMfE5H5rWwjC4wK7uRXW9gmM4EXP1LRJs";
const appId = 64;
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
