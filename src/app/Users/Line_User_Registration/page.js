"use client";
import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import axios from "axios";

import "bootstrap/dist/css/bootstrap.min.css";

const JomonRegistration = () => {
  //const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    Applicant_District: "",
    Applicant_User_Name: "",
    Birth_Year: "",
    Line_User_ID: "",
    Gender_type: "",
    Driver_Volunteer: "No",
    Watch_Volunteer: "NO",

    Line_Name: "",
  });

  const [driverVolunteer, setDriverVolunteer] = useState(false);
  const [WatchVolunteer, setWatchVolunteer] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({
          liffId: "2006381311-XDQEmkPw",
          redirectUri: window.location.href,
        });
        if (liff.isLoggedIn()) {
          const profile = await liff.getProfile();
          setProfile(profile);
          setFormData((prevData) => ({
            ...prevData,
            Line_User_ID: profile.userId,
            Line_Name: profile.displayName,
          }));

          const response = await axios.get(
            `${process.env.REACT_APP_API_URL}/Line_Infromation_Fetch`
          );
          const userExists = response.data.some(
            (item) => item.Line_User_ID === profile.userId
          );
          if (userExists) {
            setIsUserRegistered(true);
            setShowExistModal(true);
          }
        } else {
          liff.login();
        }
      } catch (error) {
        console.error("LIFF Initialization failed ", error);
      }
    };
    initLiff();
  }, []);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value,
      Driver_Volunteer: driverVolunteer ? "Yes" : "No",
      Watch_Volunteer: WatchVolunteer ? "Yes" : "No",
    });
  };

  const handleCheckboxChange = () => {
    setDriverVolunteer(!driverVolunteer);
  };

  const handleCheckboxChange2 = () => {
    setWatchVolunteer(!WatchVolunteer);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/Line_Login_Insert`,
        formData
      );
      setSubmissionStatus("success");
      setIsSubmitted(true);
      setShowSuccessModal(true);
      liff.closeWindow();
    } catch (error) {
      setSubmissionStatus("error");
      setIsSubmitted(true);
      console.error("Error:", error.response?.data || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  // if (!profile) return <div>Loading...</div>;

  return (
    <div>
      <div className="container pt-2 pb-2 p-0 overflow-hidden">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card rounded-5">
              <div className="card-body">
                <div>
                  <h2 className="card-title border text-center rounded-circle">
                    登録フォーム
                  </h2>

                  {isSubmitted && submissionStatus === "success" && (
                    <div className="alert alert-success" role="alert">
                      この度はイベントのご検討ありがとうございます。
                    </div>
                  )}
                  {isSubmitted && submissionStatus === "error" && (
                    <div
                      className="alert alert-danger text-center"
                      role="alert"
                    >
                      データの挿入中にエラーが発生しました。
                    </div>
                  )}
                  {!isSubmitted && !isUserRegistered && (
                    <form onSubmit={handleSubmit}>
                      <div className="mb-3">
                        <label htmlFor="Line_Name" className="form-label">
                          Line名<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          // value={profile.displayName}
                          value="Omar"
                          id="Line_Name"
                          name="Line_Name"
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
                        <label
                          htmlFor="Applicant_User_Name"
                          className="form-label"
                        >
                          名前<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Applicant_User_Name"
                          name="Applicant_User_Name"
                          value={formData.Applicant_User_Name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="Applicant_District"
                          className="form-label"
                        >
                          住所<span className="text-danger">*</span>
                        </label>
                        <select
                          type="text"
                          className="form-select"
                          id="Applicant_District"
                          name="Applicant_District"
                          value={formData.Applicant_District}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>
                            選択してください
                          </option>
                          <option value="富里">富里</option>
                          <option value="富士見">富士見</option>
                          <option value="とちの木">とちの木</option>
                          <option value="横吹">横吹</option>
                          <option value="花場">花場</option>
                          <option value="木の間">木の間</option>
                          <option value="若宮">若宮</option>
                          <option value="原の茶屋">原の茶屋</option>
                          <option value="松目">松目</option>
                          <option value="大平">大平</option>
                          <option value="栗生">栗生</option>
                          <option value="御射山神戸">御射山神戸</option>
                          <option value="富原">富原</option>
                          <option value="塚平">塚平</option>
                          <option value="南原山">南原山</option>
                          <option value="富士見ヶ丘">富士見ヶ丘</option>
                          <option value="富士見台">富士見台</option>
                          <option value="瀨沢新田">瀨沢新田</option>
                          <option value="立沢">立沢</option>
                          <option value="乙事">乙事</option>
                          <option value="桜ヶ丘">桜ヶ丘</option>
                          <option value="小六">小六</option>
                          <option value="高森">高森</option>
                          <option value="葛窪">葛窪</option>
                          <option value="田端">田端</option>
                          <option value="先達">先達</option>
                          <option value="池袋">池袋</option>
                          <option value="信濃境">信濃境</option>
                          <option value="下蔦木">下蔦木</option>
                          <option value="烏帽子">烏帽子</option>
                          <option value="上蔦木">上蔦木</option>
                          <option value="神代">神代</option>
                          <option value="平岡">平岡</option>
                          <option value="机">机</option>
                          <option value="先能">先能</option>
                          <option value="瀨沢">瀨沢</option>
                          <option value="富ヶ丘">富ヶ丘</option>
                          <option value="休戸">休戸</option>
                          <option value="その他・町外在住">
                            その他・町外在住
                          </option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="Applicant_User_Name"
                          className="form-label"
                        >
                          電話番号<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Applicant_User_Name"
                          name="Applicant_User_Name"
                          value={formData.Applicant_User_Name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label htmlFor="Birth_Year" className="form-label">
                          年代<span className="text-danger">*</span>
                        </label>
                        <select
                          type="text"
                          className="form-select"
                          id="Birth_Year"
                          name="Birth_Year"
                          value={formData.Birth_Year}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>
                            選択してください
                          </option>
                          <option value="〜20歳">〜20歳</option>
                          <option value="20−40歳">20−40歳</option>
                          <option value="40〜60歳">40〜60歳</option>
                          <option value="60歳〜">60歳〜</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label htmlFor="Gender_type" className="form-label">
                          性別<span className="text-danger">*</span>
                        </label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Gender_type"
                            id="male"
                            value="男性"
                            checked={formData.Gender_type === "男性"}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="male">
                            男性
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Gender_type"
                            id="female"
                            value="女性"
                            checked={formData.Gender_type === "女性"}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="female">
                            女性
                          </label>
                        </div>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Gender_type"
                            id="other"
                            value="その他"
                            checked={formData.Gender_type === "その他"}
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="other">
                            その他
                          </label>
                        </div>
                      </div>

                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="Driver_Volunteer"
                          checked={driverVolunteer}
                          onChange={handleCheckboxChange}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="Driver_Volunteer"
                        >
                          ドライバーボランティアをします。
                        </label>
                      </div>

                      <div className="mb-3 form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="Watch_Volunteer"
                          checked={WatchVolunteer}
                          onChange={handleCheckboxChange2}
                        />
                        <label
                          className="form-check-label"
                          htmlFor="Watch_Volunteer"
                        >
                          <span className="text-danger">
                            見守ボランティアとしての参加に興味ある
                          </span>
                        </label>
                      </div>

                      <p className="text-primary">
                        <a
                          href="/PrivacyPolicy"
                          className="link-primary fw-bold text-decoration-none"
                        >
                          アプリ利用にあたって プライバシーポリシー
                        </a>

                        <span className="bg-danger text-white rounded-3">
                          必須
                        </span>
                      </p>

                      <button
                        type="submit"
                        className="btn btn-primary w-100"
                        disabled={isSubmitting}
                      >
                        送信
                      </button>
                    </form>
                  )}

                  {isUserRegistered && (
                    <div
                      className="alert alert-info text-center mt-3"
                      role="alert"
                    >
                      あなたはすでに登録されています。
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JomonRegistration;
