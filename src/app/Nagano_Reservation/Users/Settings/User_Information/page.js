"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import liff from "@line/liff";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Link from "next/link";
import Header from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Header";
import Footer from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Footer";
import './User_information.css'
import "@Om/app/globals.css";

function LineUserInfo() {
  const [lineData, setLineData] = useState(null);
  const [profile, setProfile] = useState(null);
  const [isUserRegistered, setIsUserRegistered] = useState(false);
  const [userId, setUserId] = useState(null);
  useEffect(() => {
    const initLiff = async () => {
      try {
        await liff.init({ liffId: "2006583911-lzwnAZLM" });

        if (liff.isLoggedIn()) {
          const userProfile = await liff.getProfile();
          setProfile(userProfile);
          setUserId(userProfile.userId);

          const response = await axios.get(
            `/api/Yoyaku_Nagano/Users/Registration/ID/${userProfile.userId}`
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

  return (
    <div className="no-padding-container">
      <Header />
      <section className="py-3">
        <div className="container-fluid justify-content-center">
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-light p-2 rounded">
              <li className="breadcrumb-item">
                <Link href="/Nagano_Reservation/Users/Settings/User_Information">ホーム</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                登録情報を確認、変更する
              </li>
            </ol>
          </nav>

          <div className="card full-width bg-light p-1">
            <div className="row gx-5">
              <div className="col-lg-4 mb-5 mb-lg-0">
                <div className="col-md-12">
                  {lineData ? (
                    <div className="card">
                      <div className="card-body">
                        <h5 className="profile-title text-center">
                          {profile
                            ? `${profile.displayName}さん`
                            : "ユーザー名"}
                        </h5>

                        <p className="card-text">
                          <span className="fw-bold">名前: </span>
                          {lineData.Registration_Name}
                        </p>
                        <p className="card-text">
                          <span className="fw-bold">住所: </span>
                          {lineData.Registration_Address}
                        </p>
                        <p className="card-text">
                          <span className="fw-bold">電話: </span>
                          {lineData.Registration_Phone}
                        </p>
                        <p className="card-text">
                          <span className="fw-bold">年代:</span>{" "}
                          {lineData.Registration_Age}
                        </p>
                        <p className="card-text">
                          <span className="fw-bold">性別:</span>{" "}
                          {lineData.Registration_Gender}
                        </p>
                        
                        <div className="d-grid">
                          <a
                            className="btn btn-secondary rounded-pill"
                            href={`/Nagano_Reservation/Users/Settings/Update_User_Information/${userId}`}
                          >
                            編集
                          </a>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="skeleton">
                      <div className="skeleton-avatar"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                      <div className="skeleton-text"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right-side cards */}
              <div className="col-lg-8">
                <div className="row gx-5 row-cols-1 row-cols-md-2">
                  <div className="col mb-5 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link
                            href={`/Nagano_Reservation/Users/Moshikomi_List/SortList/${userId}`}
                            className="link-dark text-decoration-none"
                          >
                            <i className="fas fa-list text-center text-primary ms-2"></i>
                            イベント申し込みリスト
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </div>

                  <div className="col mb-5 mb-md-0 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link
                            href={`/Nagano_Reservation/Users/Settings/PrivacyPolicy`}
                            className="link-dark text-decoration-none"
                          >
                            <i className="fas fa-shield-alt text-center text-primary ms-2"></i>
                            プライバシーポリシー
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* <div className="col mb-5 mb-md-0 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link
                            href={`/Users/Settings/TermsOfService`}
                            className="link-dark text-decoration-none"
                          >
                            <i className="fas fa-info-circle text-center text-primary ms-2"></i>
                            利用にあたってのお願い
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </div> */}

                  <div className="col mb-md-0 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <Link
                            href={`/Nagano_Reservation/Admin/Settings/Login`}
                            className="link-dark text-decoration-none"
                          >
                            <i className="fas fa-cog text-center text-primary ms-2"></i>
                            イベント主催者管理用
                          </Link>
                        </h5>
                      </div>
                    </div>
                  </div>
                  <div className="col mt-5 mb-md-0 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <a
                            href={`https://liff.line.me/2006583911-prdr3wLD`}
                            className="link-dark text-decoration-none"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <i className="fas fa-location-arrow text-center text-primary ms-2"></i>
                            施設MAPの確認
                          </a>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default LineUserInfo;
