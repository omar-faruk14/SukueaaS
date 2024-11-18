"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Header from "@Om/components/HeaderandFooter/Header";
import Footer from "@Om/components/HeaderandFooter/Footer";
import "../../../Line_User_Registration/registration.css"

const UpdateUser = ({ params }) => {
  const { LineID } = params;
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    Registration_Address: "",
    Registration_Name: "",
    Registration_Age: "",
    Registration_Phone: "",
    Line_User_ID: "",
    Registration_Gender: "",
    Registration_Line_Name: "",
  });

  
  const [submissionStatus, setSubmissionStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `/api/Yoyaku_Nagano/Users/Registration/ID/${LineID}`
        );
        if (response.data.length > 0) {
          const userData = response.data[0]; 
          setFormData({
            Registration_Address: userData.Registration_Address,
            Registration_Name: userData.Registration_Name,
            Registration_Age: userData.Registration_Age,
            Registration_Phone: userData.Registration_Phone,
            Line_User_ID: userData.Line_User_ID,
            Registration_Gender: userData.Registration_Gender,
            
            Registration_Line_Name: userData.Registration_Line_Name,
          });
          
        }
      } catch (error) {
        console.error("Error retrieving data:", error);
      }
    };

    fetchUserData();
  }, [LineID]);

  // Handle form field changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      
    }));
  };

 
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      
      await axios.put(`/api/Yoyaku_Nagano/Users/Registration`, formData);
      setSubmissionStatus("success");


      // liff.closeWindow();
    } catch (error) {
      setSubmissionStatus("error");
      console.error("Error:", error.response?.data || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

 

  return (
    <div>
      <div
      // className="d-flex flex-column"
      // style={{ backgroundColor: "lightblue" }}
      >
        <div className="container pt-2 pb-2 p-0 overflow-hidden">
          <div className="row justify-content-center">
            <div className="col-md-8">
              <div className="card rounded-5">
                <div className="card-body">
                  <div>
                    <h2 className="card-title border text-center rounded-circle">
                      更新
                    </h2>

                    {submissionStatus === "success" && (
                      <div className="alert alert-success" role="alert">
                        情報が正常に更新されました。
                      </div>
                    )}
                    {submissionStatus === "error" && (
                      <div
                        className="alert alert-danger text-center"
                        role="alert"
                      >
                        データの更新中にエラーが発生しました。
                      </div>
                    )}

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
                          value={formData.Registration_Line_Name}
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
                          お住いの地域<span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-control"
                          id="Registration_Address"
                          name="Registration_Address"
                          value={formData.Registration_Address}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="" disabled>
                            選択してください
                          </option>
                          <option value="長野市内">長野市内</option>
                          <option value="長野県内（長野市以外）">
                            長野県内（長野市以外）
                          </option>
                          <option value="県外">県外</option>
                          <option value="その他">その他</option>
                        </select>
                      </div>

                      <div className="mb-3">
                        <label
                          htmlFor="Registration_Phone"
                          className="form-label"
                        >
                          連絡先（イベントの際連絡の取れるもの）
                          <span className="text-danger">*</span>
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

                      <div className="text-center mt-3">
                        <button
                          type="submit"
                          className="btn btn-primary btn-lg w-100"
                        >
                          {isSubmitting ? (
                            <>
                              <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                              ></span>
                              更新中...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-edit me-2"></i>
                              更新
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateUser;
