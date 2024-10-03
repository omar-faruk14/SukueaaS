"use client";
import React, { useEffect, useState } from "react";
import liff from "@line/liff";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";


const JomonRegistration = () => {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    Registration_Address: "",
    Registration_Name: "",
    Registration_Age: "",
    Registration_Phone: "",
    Line_User_ID: "", 
    Registration_Gender: "",
    Registration_Driver_Volunteer: "No",
    Registration_Watch_Volunteer: "No",
    Registration_Line_Name: "", 
  });

  const [driverVolunteer, setDriverVolunteer] = useState(false);
  const [WatchVolunteer, setWatchVolunteer] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const handleInfoClick = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const [isUserRegistered, setIsUserRegistered] = useState(false);

  useEffect(() => {
    const initLiff = async () => {
      try {
        
        await liff.init({ liffId: "2006381311-XDQEmkPw" });

       
        if (liff.isLoggedIn()) {
         
          const userProfile = await liff.getProfile();
          setProfile(userProfile); 

          
          setFormData((prevData) => ({
            ...prevData,
            Line_User_ID: userProfile.userId, 
            Registration_Line_Name: userProfile.displayName, 
          }));

          
          const response = await axios.get(`/api/Users/Line_User_Registration`);
          const userExists = response.data.some(
            (item) => item.Line_User_ID === userProfile.userId
          );

          if (userExists) {
            setIsUserRegistered(true);
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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      Registration_Driver_Volunteer: driverVolunteer ? "Yes" : "No",
      Registration_Watch_Volunteer: WatchVolunteer ? "Yes" : "No",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      await axios.post(`/api/Users/Registration`, formData);
      setSubmissionStatus("success");
      setIsSubmitted(true);
      
      
      // Automatically close the LIFF window
      liff.closeWindow();
    } catch (error) {
      setSubmissionStatus("error");
      setIsSubmitted(true);
      console.error("Error:", error.response?.data || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

const handleCheckboxChange = (event) => {
  const isChecked = event.target.checked;
  setDriverVolunteer(isChecked);
  setFormData((prevData) => ({
    ...prevData,
    Registration_Driver_Volunteer: isChecked ? "Yes" : "No",
  }));
};

const handleCheckboxChange2 = (event) => {
  const isChecked = event.target.checked;
  setWatchVolunteer(isChecked);
  setFormData((prevData) => ({
    ...prevData,
    Registration_Watch_Volunteer: isChecked ? "Yes" : "No",
  }));
};




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
                      ご登録いただきありがとうございます。
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
                        <label
                          htmlFor="Registration_Line_Name"
                          className="form-label"
                        >
                          Line名<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          value={formData.Registration_Line_Name || ""}
                          id="Registration_Line_Name"
                          name="Registration_Line_Name"
                          readOnly
                          style={{
                            backgroundColor: "#ccc",
                            border: "1px solid #ccc",
                            color: "#000",
                          }}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="Registration_Name"
                          className="form-label"
                        >
                          名前<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Registration_Name"
                          name="Registration_Name"
                          value={formData.Registration_Name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="Registration_Address"
                          className="form-label"
                        >
                          住所<span className="text-danger">*</span>
                        </label>
                        <select
                          type="text"
                          className="form-select"
                          id="Registration_Address"
                          name="Registration_Address"
                          value={formData.Registration_Address}
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
                          htmlFor="Registration_Phone"
                          className="form-label"
                        >
                          電話番号<span className="text-danger">*</span>
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="Registration_Phone"
                          name="Registration_Phone"
                          value={formData.Registration_Phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="Registration_Age"
                          className="form-label"
                        >
                          年代<span className="text-danger">*</span>
                        </label>
                        <select
                          type="text"
                          className="form-select"
                          id="Registration_Age"
                          name="Registration_Age"
                          value={formData.Registration_Age}
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
                        <label
                          htmlFor="Registration_Gender"
                          className="form-label"
                        >
                          性別<span className="text-danger">*</span>
                        </label>
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="Registration_Gender"
                            id="male"
                            value="男性"
                            checked={formData.Registration_Gender === "男性"}
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
                            name="Registration_Gender"
                            id="female"
                            value="女性"
                            checked={formData.Registration_Gender === "女性"}
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
                            name="Registration_Gender"
                            id="other"
                            value="その他・未回答"
                            checked={
                              formData.Registration_Gender === "その他・未回答"
                            }
                            onChange={handleInputChange}
                            required
                          />
                          <label className="form-check-label" htmlFor="other">
                            その他・未回答
                          </label>
                        </div>
                      </div>

                    
                      <div className="card mb-3 p-3 border-0 shadow-sm">
                        <h5
                          className="fw-bold mb-3 text-primary"
                          style={{ cursor: "pointer" }}
                          onClick={handleInfoClick}
                        >
                          <span>ボランティア活動</span>
                     
                          <i
                            className="ms-1 fa-solid fa-circle-info text-primary"
                            onClick={handleInfoClick} 
                            style={{
                              cursor: "pointer",
                              fontSize: "1rem", 
                            }}
                          ></i>
                        </h5>

                        <div className="form-check mb-2">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Registration_Driver_Volunteer"
                            name="Registration_Driver_Volunteer"
                            checked={driverVolunteer}
                            onChange={handleCheckboxChange}
                          />
                          <label
                            className="form-check-label"
                            htmlFor="Registration_Driver_Volunteer"
                          >
                            運転ボランティアとしての参加に興味ある
                          </label>
                        </div>

                        <div className="form-check d-flex align-items-center">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="Registration_Watch_Volunteer"
                            name="Registration_Watch_Volunteer"
                            checked={WatchVolunteer}
                            onChange={handleCheckboxChange2}
                          />
                          <label
                            className="form-check-label text-danger mb-0 me-2"
                            htmlFor="Registration_Watch_Volunteer"
                          >
                            見守りボランティアとしての参加に興味ある
                          </label>
                        </div>

                        {/* Modal for volunteer information */}
                        <div
                          className={`modal fade ${showModal ? "show" : ""}`}
                          style={{ display: showModal ? "block" : "none" }}
                          tabIndex="-1"
                          role="dialog"
                          aria-labelledby="volunteerInfoModalLabel"
                          aria-hidden={!showModal}
                        >
                          <div className="modal-dialog" role="document">
                            <div className="modal-content">
                              <div className="modal-header">
                                <h5
                                  className="modal-title"
                                  id="volunteerInfoModalLabel"
                                >
                                  ボランティアについて
                                </h5>
                                
                              </div>
                              <div className="modal-body">
                                <h6>運転ボランティアとは？</h6>
                                <ul>
                                  <li>
                                    イベントの際に送迎をお手伝いをしてくれる方
                                  </li>
                                  <li>送迎用の車両が貸し出し可能な方</li>
                                </ul>
                                <h6>見守りボランティアとは？</h6>
                                <ul>
                                  <li>
                                    イベント会場で介助が必要な方のお手伝いをしてくれる方。例.車の乗り降りを補助する、等
                                  </li>
                                </ul>
                              </div>
                              <div className="modal-footer">
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  onClick={handleCloseModal}
                                >
                                  閉じる
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
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

                      <div className="form-group">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="gridCheck"
                            required
                          />
                          <label
                            className="form-check-label"
                            htmlFor="gridCheck"
                          >
                            同意して登録します
                          </label>
                        </div>
                      </div>

                      {/* Submit Button */}
                      <div className="text-center">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg"
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              登録中...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-paper-plane me-2"></i>
                              登録
                            </>
                          )}
                        </button>
                      </div>
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
