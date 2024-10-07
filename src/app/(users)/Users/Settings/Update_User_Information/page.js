
"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import liff from "@line/liff";

export default function Pages() {
  const [lineData, setLineData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userId, setUserId] = useState(null);

  // LIFF initialization and fetching user profile
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2006381311-2LAgdN1y" });

        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setUserId(userProfile.userId);

          const response = await axios.get(
            `/api/Users/Registration/ID/${userProfile.userId}`
          );

          const userExists = response.data.find(
            (item) => item.Line_User_ID === userProfile.userId
          );

          if (userExists) {
            setIsUserRegistered(true);
            setLineData(userExists);
          }
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Initialization failed:", error);
      }
    };

    initLiff();
  }, []);

  return <div>
    <h1> hello</h1>
  </div>;
}

