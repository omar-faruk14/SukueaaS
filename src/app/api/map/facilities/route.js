import { NextResponse } from "next/server";
import axios from "axios";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "e5wfAEa2iW2lrj9K6zkCUGxtTsZmCs9Ioj6lNbNM";
const appId = 59;
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
      Facilities_detail_title: record.Facilities_detail_title.value,
      Facilities_detail_description: record.Facilities_detail_description.value,
      location_id: record.location_id.value,
      Facilities_detail_image: record.Facilities_detail_image.value,
      Facilities_Details_Link: record.Facilities_Details_Link.value,
      location_title: record.location_title.value,
    }));
    return NextResponse.json(records);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Error retrieving records" });
  }
}

// export async function PUT(request) {
//   try {
//     const { Record_number, location_id_0, Facilities_detail_title } =
//       await request.json();

   

//     const updateData = {
//       app: appId,
//       id: Record_number,
//       record: {
//         location_id_0: {
//           value: location_id_0, 
//         },
//         Facilities_detail_title: {
       
//           value: Facilities_detail_title,
//         },
//         Facilities_detail_title: {
     
//           value: Facilities_detail_title, 
//         },
//       },
//     };

//     // Send the request to Kintone API to update the record
//     const response = await axios.put(`${kintoneUrl}/record.json`, updateData, {
//       headers: {
//         "X-Cybozu-API-Token": apiToken,
//       },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "Record updated successfully",
//     });
//   } catch (error) {
//     console.error("Error updating record:", error);
//     return NextResponse.json({
//       success: false,
//       message: `Error updating record: ${error.message}`,
//     });
//   }
// }
