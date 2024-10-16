"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import liff from "@line/liff";
import { Gear, Info, Shield, List } from "react-bootstrap-icons";
import Link from "next/link";
import Header from "@Om/components/HeaderandFooter/Header";
import Footer from "@Om/components/HeaderandFooter/Footer";

function LineUserInfo() {
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

  return (
    <div>
      <Header />
      <section className="py-3">
        <div className="container justify-content-center">
          {/* Breadcrumb */}
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb bg-light p-2 rounded">
              <li className="breadcrumb-item">
                <Link href="/">Home</Link>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                設定とお問合せ
              </li>
            </ol>
          </nav>

          {/* Full-page card */}
          <div className="card bg-light p-1">
            <div className="row gx-5">
              <div className="col-lg-4 mb-5 mb-lg-0">
                <div className="col-md-12">
                  {lineData ? (
                    <div className="card bg-light py-5 rounded-5">
                      <div className="card">
                        <div className="card-body">
                          <h5 className="card-title text-center bg-light border">
                            {profile
                              ? `${profile.displayName}さん`
                              : "ユーザー名"}
                          </h5>

                          {/* <p className="card-text">
                          <span className="fw-bold">Line名:</span>{" "}
                          {lineData.Registration_Line_Name}
                        </p> */}
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
                          <p className="card-text">
                            <span className="fw-bold">
                              運転ボランティアとして参加 に興味ある:{" "}
                            </span>
                            {lineData.Registration_Driver_Volunteer}
                          </p>
                          <p className="card-text">
                            <span className="fw-bold">
                              見守りボランティアとしての参加に興味ある:{" "}
                            </span>
                            {lineData.Registration_Watch_Volunteer}
                          </p>
                          <div className="d-grid">
                            <a
                              className="btn btn-secondary rounded-pill"
                              href={`/Users/Settings/Update_User_Information/${userId}`}
                            >
                              編集
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p>データを読み込んでいます...</p>
                  )}
                </div>
              </div>

              <div className="col-lg-8">
                <div className="row gx-5 row-cols-1 row-cols-md-2">
                  {/* ふじみMaaSについて */}
                  <div className="col mb-5 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <a
                            className="link-dark text-decoration-none"
                            href={`/about_fujimimaas`}
                          >
                            <Info className="text-center text-primary ms-2" />
                            イベント申し込みリスト
                          </a>
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* プライバシーポリシーへ */}
                  <div className="col mb-5 mb-md-0 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <a
                            className="link-dark text-decoration-none"
                            href={`/Users/Settings/PrivacyPolicy`}
                          >
                            <Shield className="text-center text-primary ms-2" />
                            プライバシーポリシー
                          </a>
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* ふじみMaaSへのお問合せ */}
                  {/* <div className="col mb-5 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <a
                            className="link-dark text-decoration-none"
                            href={`/Inquery`}
                          >
                            <Info className="text-center text-primary ms-2" />
                            ふじみMaaSへのお問合せ
                          </a>
                        </h5>
                      </div>
                    </div>
                  </div> */}

                  {/* 利用にあたってのお願い */}
                  <div className="col mb-5 h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        {/* You can replace the placeholder icon with the appropriate one */}
                        <h5 className="card-title">
                          <a
                            className="link-dark text-decoration-none"
                            href={`/Request_use`}
                          >
                            <List className="text-center text-primary ms-2" />
                            利用にあたってのお願い
                          </a>
                        </h5>
                      </div>
                    </div>
                  </div>

                  {/* Self Settings */}
                  <div className="col h-100">
                    <div className="card bg-light">
                      <div className="card-body">
                        <h5 className="card-title">
                          <a
                            className="link-dark text-decoration-none"
                            href={`/Admin/Settings/Login`}
                          >
                            <Gear className="text-center text-primary ms-2" />{" "}
                            イベント主催者管理用
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
