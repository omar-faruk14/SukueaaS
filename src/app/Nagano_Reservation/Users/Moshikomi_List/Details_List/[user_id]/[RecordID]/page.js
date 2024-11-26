"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Header";
import Footer from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Footer";

export default function ApplicationDetailsView({params}) {
  const [selectApplication, setSelectApplication] = useState(null);
  const { user_id, RecordID } = params;
  const FetchData = async () => {
    try {
      const response = await fetch(`/api/Yoyaku_Nagano/Users/Moshikomi/${user_id}`);
      const data = await response.json();
      console.log(JSON.stringify(data));
      const dataSave = data.find(
        (item) => item.Line_User_ID === user_id && item.id === RecordID
      );
      setSelectApplication(dataSave);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchData();
  }, [user_id, RecordID]);

  const formatTime = (dateString) => {
    const options = {
      hour: "numeric",
      minute: "numeric",
      hour12: false,
      timeZone: "Asia/Tokyo",
    };
    return new Date(dateString).toLocaleTimeString("ja-JP", options);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "ja-JP",
      options
    );
    // Extract year, month, and day
    const [year, month, day] = formattedDate.split("/");

    // Format as "YYYY年MM月DD日"
    return `${year}年${month}月${day}日`;
  };

  return (
    <div>
      <Header />
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb bg-light p-2 rounded">
          <li className="breadcrumb-item">
            <Link href="/Users/Settings/User_Information">ホーム</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            イベント申込の詳細
          </li>
        </ol>
      </nav>
      <div className="container py-1 p-1 overflow-hidden">
        <div className="row justify-content-center py-2 px-0">
          <div className="col-12 col-md-10 col-lg-10">
            <div className="card bg-light py-5 rounded-5">
              <div className="card">
                <h5 className="card-header text-center">イベント申込の詳細</h5>

                <div className="card-body">
                  {selectApplication ? (
                    <>
                      {selectApplication.Event_Name && (
                        <p className="card-text mb-3">
                          <strong>イベント名:</strong>{" "}
                          {selectApplication.Event_Name}
                        </p>
                      )}

                      {/* For Type C */}

                      {selectApplication.Preferred_Date && (
                        <p className="card-text mb-3">
                          <strong>希望日:</strong>{" "}
                          {selectApplication.Preferred_Date}
                        </p>
                      )}

                      {selectApplication.Preferred_Time && (
                        <p className="card-text mb-3">
                          <strong>希望時:</strong>{" "}
                          {selectApplication.Preferred_Time}
                        </p>
                      )}

                      {selectApplication.Destination && (
                        <p className="card-text mb-3">
                          <strong>目的地:</strong>{" "}
                          {selectApplication.Destination}
                        </p>
                      )}

                      {/* end type c */}

                      {selectApplication.Date_Time && (
                        <p className="card-text">
                          <strong>日時:</strong>{" "}
                          {formatDate(selectApplication.Date_Time)} -{" "}
                          {formatTime(selectApplication.Date_Time)}
                        </p>
                      )}
                      {selectApplication.Location && (
                        <p className="card-text">
                          <strong>場所:</strong> {selectApplication.Location}
                        </p>
                      )}
                      {selectApplication.Name && (
                        <p className="card-text">
                          <strong>申込者名:</strong> {selectApplication.Name}
                        </p>
                      )}

                      {selectApplication.Number_of_Participants && (
                        <p className="card-text">
                          <strong>参加人数:</strong>{" "}
                          {selectApplication.Number_of_Participants}
                        </p>
                      )}
                      {selectApplication.Boarding_and_alighting_place && (
                        <p className="card-text">
                          <strong>住所（乗降場所）:</strong>{" "}
                          {selectApplication.Boarding_and_alighting_place}
                        </p>
                      )}

                      {selectApplication.Use_of_mobile_services && (
                        <p className="card-text">
                          <strong>移動サービスのご利用:</strong>{" "}
                          {selectApplication.Use_of_mobile_services}
                        </p>
                      )}

                      {/* Start Moshikomi A */}
                      {selectApplication.Desired_meeting_place && (
                        <p className="card-text">
                          <strong>希望集合場所:</strong>{" "}
                          {selectApplication.Desired_meeting_place}
                        </p>
                      )}
                      {/* End Moshikomi A */}

                      {/* Start Moshikomi D */}
                      {selectApplication.Participant_Method && (
                        <p className="card-text">
                          <strong>当日の参加方法:</strong>{" "}
                          {selectApplication.Participant_Method}
                        </p>
                      )}

                      {/* End Moshikomi D */}

                      {selectApplication.TEL_contact_information && (
                        <p className="card-text">
                          <strong>TEL:</strong>{" "}
                          {selectApplication.TEL_contact_information}
                        </p>
                      )}
                      {selectApplication.Additional_Comments && (
                        <p className="card-text">
                          <strong>追加コメント:</strong>{" "}
                          {selectApplication.Additional_Comments}
                        </p>
                      )}
                    </>
                  ) : (
                    <p>Loading...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
