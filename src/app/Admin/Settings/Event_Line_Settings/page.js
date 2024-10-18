"use client";
import { useEffect, useState } from "react";
import Header from "@Om/components/HeaderandFooter/Header";
import Footer from "@Om/components/HeaderandFooter/Footer";
import axios from "axios";

export default function EventManager() {
  const [timeRange, setTimeRange] = useState("1month");
  const [phone, setPhone] = useState("");
  const [recordNumber, setRecordNumber] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [successMessage, setSuccessMessage] = useState(""); 

  useEffect(() => {
   
    async function fetchEventData() {
      try {
        const response = await axios.get("/api/Admin/Event_Management");
        const eventData = response.data[0]; 
        setRecordNumber(eventData.Record_number);
        setTimeRange(eventData.tsukuerabo_event_management_month);
        setPhone(eventData.tsukuerabo_event_management_phone);
      } catch (error) {
        console.error("Error fetching event data:", error);
      }
    }
    fetchEventData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true); 
    setSuccessMessage(""); 
    try {
      const updateData = {
        Record_number: recordNumber,
        tsukuerabo_event_management_phone: phone,
        tsukuerabo_event_management_month: timeRange,
      };

      await axios.put("/api/Admin/Event_Management", updateData);

      setSuccessMessage("データが正常に更新されました。"); 
    } catch (error) {
      console.error("Error updating event data:", error);
    } finally {
      setIsSubmitting(false); 
    }
  };

  return (
    <div>
      <Header />
      <div
        className="container mt-4 p-3 border rounded shadow-sm"
        style={{ maxWidth: "400px" }}
      >
        <h4 className="text-center mb-3">イベント主催者管理用</h4>
        <p className="text-muted">
          「イベントを確認・予約する」メニュー選択時にトーク画面に表示するイベント設定
        </p>
        <form onSubmit={handleSubmit}>
          <fieldset className="mb-3">
            <legend className="h6">開催が未来で、かつ</legend>
            <div className="form-check">
              <input
                type="radio"
                id="1month"
                className="form-check-input"
                value="1month"
                checked={timeRange === "1month"}
                onChange={() => setTimeRange("1month")}
              />
              <label htmlFor="1month" className="form-check-label">
                1ヶ月以内
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="3months"
                className="form-check-input"
                value="3months"
                checked={timeRange === "3months"}
                onChange={() => setTimeRange("3months")}
              />
              <label htmlFor="3months" className="form-check-label">
                3ヶ月以内
              </label>
            </div>
            <div className="form-check">
              <input
                type="radio"
                id="all"
                className="form-check-input"
                value="all"
                checked={timeRange === "all"}
                onChange={() => setTimeRange("all")}
              />
              <label htmlFor="all" className="form-check-label">
                全て
              </label>
            </div>
          </fieldset>

          <div className="mb-3">
            <label htmlFor="phone" className="form-label">
              電話連絡先
            </label>
            <input
              type="tel"
              id="phone"
              className="form-control"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="XXX-XXX-XXX"
              required
            />
          </div>

          <div className="d-flex justify-content-between">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? "送信中..." : "設定する"}{" "}
            </button>
            <button type="button" className="btn btn-secondary">
              キャンセル
            </button>
          </div>
        </form>

        {successMessage && (
          <div className="alert alert-success mt-3" role="alert">
            {successMessage} 
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
