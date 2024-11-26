"use client";
import React, { useState, useEffect, Suspense} from "react";

import { useSearchParams } from "next/navigation";
import './Moshikomi.css';


import axios from "axios";

const DefaultApp = () => {
  const formatTokyoTime = (date) => {
    if (!date || isNaN(new Date(date).getTime())) {
      return "";
    }

    const options = {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    };
    return new Intl.DateTimeFormat("ja-JP", options).format(new Date(date));
  };

  //   const { event_id, user_id } = router.query;

  const searchParams = useSearchParams();
  const event_id = searchParams.get("event_id"); 
  const userID = searchParams.get("user_id");

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [mapData, setMapData] = useState(null);
  const [formData, setFormData] = useState({
    Number_of_Participants: 0,
    Additional_Comments: "",
    Line_User_ID: userID,
    Name: "",
    Date_Time: "",
    Location: "",
    Use_of_mobile_services: "",
    Boarding_and_alighting_place: "",
    Event_Name: "",
    //TEL_contact_information: "",
    event_id: event_id,
    Application_Type: "",
    Desired_meeting_place: "",
    Preferred_Time: "",
    Preferred_Date: "",
    Destination: "",
    Participant_Method: "",
  });
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profile, setProfile] = useState(null);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const initializeData = async () => {
      try {
        // Initialize LIFF
        // await liff.init({ liffId: "2006381311-oxeKbr3Z" });
        // if (liff.isLoggedIn()) {
        //   const userProfile = await liff.getProfile();
        //   setProfile(userProfile);
        //   setUserId(userProfile.userId);
        //   setFormData((prevData) => ({
        //     ...prevData,
        //     Line_User_ID: userProfile.userId,
        //   }));
        // } else {
        //   liff.login();
        // }

        // Fetch event data
        const response = await axios.get(`/api/Yoyaku_Nagano/Admin/Event_Information/`);
        const data = response.data;
        const selectedEvent = data.find((event) => event.Record_number === event_id);
        
        setSelectedEvent(selectedEvent);
        setFormData((prevData) => ({
          ...prevData,
          Name: "",
          Number_of_Participants: 1,
          Additional_Comments: "",
          Date_Time: selectedEvent ? selectedEvent.date : "",
          Location: selectedEvent ? selectedEvent.location : "",
          Use_of_mobile_services: "",
          Boarding_and_alighting_place: "",
          Event_Name: selectedEvent ? selectedEvent.name : "",
          Desired_meeting_place: "",
          Application_Type: selectedEvent?.Application_Type_Moshikomi || "",
          Preferred_Time: "",
          Preferred_Date: "",
          Destination: "",
          Participant_Method: "",
        }));
         const response2 = await fetch(`/api/Yoyaku_Nagano/map/mapData`);
         const data2 = await response2.json();
         setMapData(data2);
      } catch (error) {
        console.error("Initialization failed:", error);
      }
    };

    initializeData();
  }, [event_id,userID]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);
    console.log("JSON Data:", JSON.stringify(formData, null, 2));
    try {
      const response = await axios.post("/api/Yoyaku_Nagano/Users/Moshikomi",
        formData
      );
      setSubmissionStatus("success");
      setIsSubmitted(true);
      console.log("Response:", response.data);
    } catch (error) {
      setSubmissionStatus("error");
      setIsSubmitted(true);
      console.error("Error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const Default_Type = selectedEvent
    ? selectedEvent.Application_Type_Moshikomi
    : "";
  console.log(Default_Type);

  const isRegistrationOpen = () => {
    if (!selectedEvent || !selectedEvent.Submit_End_Time) {
      return false;
    }

    const currentDate = new Date();
    const eventDate = new Date(selectedEvent.Submit_End_Time);

    return currentDate <= eventDate;
  };

  return (
    <div className="container mt-5 mb-2 p-0 overflow-hidden">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card rounded-5">
            <div className="card-body">
              <h2 className="card-title">
                {selectedEvent
                  ? isRegistrationOpen()
                    ? `${selectedEvent.name} - 申し込みフォーム`
                    : `申し込み期間が終了しました - ${selectedEvent.name}`
                  : "Loading..."}
              </h2>

              {!isRegistrationOpen() && (
                <div className="alert alert-warning" role="alert">
                  申し込み期間が終了しました。新しいイベントをお楽しみに！
                </div>
              )}
              {isSubmitted && submissionStatus === "success" && (
                <div className="alert alert-success" role="alert">
                  <p>イベントへのお申込み、ありがとうございました。</p>
                </div>
              )}
              {isSubmitted && submissionStatus === "error" && (
                <div className="alert alert-danger text-center" role="alert">
                  データの挿入中にエラーが発生しました。
                </div>
              )}
              {isRegistrationOpen() && !isSubmitted && (
                <form onSubmit={handleSubmit}>
                  {Default_Type !== "移動のみ申込（自宅登録）" && (
                    <>
                      <div className="mb-3 mt-3">
                        <label htmlFor="Date_Time" className="form-label">
                          日時<span className="text-danger">*</span>
                        </label>
                        <input
                          id="Date_Time"
                          name="Date_Time"
                          className="form-control"
                          defaultValue={formatTokyoTime(formData.Date_Time)}
                          type="text"
                          readOnly
                          style={{
                            backgroundColor: "#ccc",
                            border: "1px solid #ccc",
                            color: "#000",
                          }}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="Location" className="form-label">
                          場所
                        </label>
                        <input
                          id="Location"
                          name="Location"
                          className="form-control"
                          value={formData.Location}
                          type="text"
                          readOnly
                          style={{
                            backgroundColor: "#ccc",
                            border: "1px solid #ccc",
                            color: "#000",
                          }}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label htmlFor="Name" className="form-label">
                      名前(代表者名)<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="Name"
                      name="Name"
                      value={formData.Name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* Moshokomi c */}

                  {Default_Type === "移動のみ申込（自宅登録）" && (
                    <>
                      <div className="mb-3">
                        <label htmlFor="Preferred_Date" className="form-label">
                          希望日<span className="text-danger">*</span>
                        </label>
                        <input
                          type="date"
                          className="form-control"
                          id="Preferred_Date"
                          name="Preferred_Date"
                          value={formData.Preferred_Date}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="Preferred_Time" className="form-label">
                          希望時<span className="text-danger">*</span>
                        </label>
                        <input
                          type="time"
                          className="form-control"
                          id="Preferred_Time"
                          name="Preferred_Time"
                          value={formData.Preferred_Time}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="Destination" className="form-label">
                          目的地<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Destination"
                          name="Destination"
                          value={formData.Destination}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="mb-3">
                    <label
                      htmlFor="Number_of_Participants"
                      className="form-label"
                    >
                      参加人数<span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className="form-control"
                      id="Number_of_Participants"
                      name="Number_of_Participants"
                      value={formData.Number_of_Participants}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  {/* (Not Come) For MoshikomiD^ */}
                  {Default_Type !== "イベントのみ参加" && (
                    <>
                      <div className="mb-3">
                        <label
                          htmlFor="Use_of_mobile_services"
                          className="form-label"
                        >
                          移動サービスの利用：
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          type="text"
                          className="form-select"
                          id="Use_of_mobile_services"
                          name="Use_of_mobile_services"
                          value={formData.Use_of_mobile_services}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>
                            選択してください
                          </option>
                          <option value="利用しない">利用しない</option>
                          <option value="利用する（往復">利用する（往復</option>
                          <option value="行きのみ利用">行きのみ利用</option>
                          <option value="帰りのみ利用">帰りのみ利用</option>
                        </select>
                      </div>
                    </>
                  )}

                  {/* for First Moshikomi */}
                  {formData.Use_of_mobile_services !== "利用しない" &&
                    (Default_Type ===
                      "イベント参加＋移動申込（拠点から選択）" ||
                      Default_Type === "移動のみ申込（自宅登録）") && (
                      <div className="mb-3">
                        <label
                          htmlFor="Desired_meeting_place"
                          className="form-label"
                        >
                          乗降場所：
                          <span className="text-danger">*</span>
                        </label>
                        <select
                          type="text"
                          className="form-select"
                          id="Desired_meeting_place"
                          name="Desired_meeting_place"
                          value={formData.Desired_meeting_place}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>
                            選択してください
                          </option>
                          {mapData &&
                            mapData.map((item) => (
                              <option key={item.id} value={item.title}>
                                {item.title}
                              </option>
                            ))}
                          <option value="その他">その他</option>
                        </select>
                      </div>
                    )}

                  {Default_Type === "イベント参加＋移動申込（住所登録）" &&
                    formData.Use_of_mobile_services !== "利用しない" && (
                      <div className="mb-3">
                        <label
                          htmlFor="Boarding_and_alighting_place"
                          className="form-label"
                        >
                          住所（乗降場所）
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Boarding_and_alighting_place"
                          name="Boarding_and_alighting_place"
                          value={formData.Boarding_and_alighting_place}
                          onChange={handleInputChange}
                        />
                      </div>
                    )}

                  {/* For Moshikomi D */}
                  {Default_Type === "イベントのみ参加" && (
                    <div className="mb-3">
                      <label
                        htmlFor="Participant_Method"
                        className="form-label"
                      >
                        当日の参加方法：
                        <span className="text-danger">*</span>
                      </label>
                      <select
                        id="Participant_Method"
                        name="Participant_Method"
                        className="form-control"
                        value={formData.Participant_Method}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="" disabled>
                          選択してください
                        </option>
                        <option value="公共交通機関">公共交通機関</option>
                        <option value="自家用車">自家用車</option>
                        <option value="徒歩・自転車">徒歩・自転車</option>
                        <option value="乗合">乗合</option>
                        <option value="家族・知人送迎">家族・知人送迎</option>
                        <option value="その他">その他</option>
                      </select>
                    </div>
                  )}

                  {/* <div className="mb-3">
                    <label
                      htmlFor="TEL_contact_information"
                      className="form-label"
                    >
                      TEL（連絡先）<span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="TEL_contact_information"
                      name="TEL_contact_information"
                      value={formData.TEL_contact_information}
                      onChange={handleInputChange}
                      required
                    />
                  </div> */}

                  <div className="mb-3">
                    <label htmlFor="Additional_Comments" className="form-label">
                      連絡事項
                    </label>
                    <textarea rows={5}
                      className="form-control"
                      id="Additional_Comments"
                      name="Additional_Comments"
                      placeholder={`代表者以外の参加者がいれば、氏名と送迎要否をご記入ください\n山田花子　送迎必要、山田次郎　送迎必要（自宅）`}
                      value={formData.Additional_Comments}
                      onChange={handleInputChange}
                    ></textarea>
                  </div>
                  <div className="alert alert-info rounded-5">
                    {selectedEvent
                      ? selectedEvent.Organizer_Comment.split("\n").map(
                          (line, index) => (
                            <React.Fragment key={index}>
                              {line}
                              <br />
                            </React.Fragment>
                          )
                        )
                      : ""}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "送信中..." : "送信"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


const MoshikomiForm = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DefaultApp />
    </Suspense>
  );
};

export default MoshikomiForm;
