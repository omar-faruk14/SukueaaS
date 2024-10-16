import axios from "axios";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const kintoneUrl = "https://emi-lab-osaka.cybozu.com/k/v1";
const apiToken = "q44PSwj7ptYeGs8kaU0TzZnPhqiyTKVjBjvi1lJZ";
const appId = 33;
const jwtSecret =
  "0bb55743aa12e442013758d53c69085fa44200f8322a65d430dffb3371829a3cd3bc78aa0ebfc4c7e86375081850ea1016879c4a9a0e424a250671903d57aa9b";

export async function POST(request) {
  const { tsukuerabo_Admin_Login_User_Name, tsukuerabo_Admin_Password } =
    await request.json();

  try {
    const query = `tsukuerabo_Admin_Login_User_Name="${tsukuerabo_Admin_Login_User_Name}" and tsukuerabo_Admin_Password="${tsukuerabo_Admin_Password}"`;

    const response = await axios.get(`${kintoneUrl}/records.json`, {
      headers: {
        "X-Cybozu-API-Token": apiToken,
      },
      params: {
        app: appId,
        query,
      },
    });
  
    const records = response.data.records;

    if (records.length === 0) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }
    const user = records[0];

    // Generate JWT token
    const token = jwt.sign(
      { username: tsukuerabo_Admin_Login_User_Name, role: "admin" },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return NextResponse.json({
      token,
      user: {
        tsukuerabo_Admin_Login_User_Name:
          user.tsukuerabo_Admin_Login_User_Name.value,
      },
    });
  } catch (error) {
    console.error("Error retrieving records:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
