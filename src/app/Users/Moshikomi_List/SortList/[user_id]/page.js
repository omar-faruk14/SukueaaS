"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Person } from "react-bootstrap-icons";
import './MoshikomiPageList.css'
import Header from "@Om/components/HeaderandFooter/Header";
import Footer from "@Om/components/HeaderandFooter/Footer";

export default function MoshikomiPageList({ params }) {
  const [selectApplication, setSelectApplication] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const { user_id } = params;

  const fetchData = async () => {
    try {
      const response = await fetch(`/api/Users/Moshikomi/${user_id}`);
      const data = await response.json();

      
      const filteredApplications = data.filter(
        (application) => application.Line_User_ID === user_id
      );

      
      const sortedApplications = filteredApplications.sort((a, b) => {
        return b.id - a.id; 
      });

      // Update the state with the sorted applications
      setSelectApplication(sortedApplications);
    } catch (error) {
      console.error("データの取得エラー:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user_id]);

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
    const [year, month, day] = formattedDate.split("/");
    return `${year}年${month}月${day}日`;
  };

  const handleClick = (event) => {
    event.preventDefault(); // Prevent page reload
    const pageNumber = Number(event.target.id);
    setCurrentPage(pageNumber);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = selectApplication.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (
      let i = 1;
      i <= Math.ceil(selectApplication.length / itemsPerPage);
      i++
    ) {
      pageNumbers.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <a id={i} onClick={handleClick} className="page-link" href="#">
            {i}
          </a>
        </li>
      );
    }
    return pageNumbers;
  };

  return (
    <div>
      <Header/>
      <div className="container">
        <div className="py-5 bg-light">
          <div className="container px-5 my-5">
            <div className="row gx-5 justify-content-center">
              <div className="col-lg-10 col-xl-7">
                <div className="text-center">
                  <div className="fs-2 mb-2 fst-italic">
                    <h5 className="mb-2">イベント申込リスト</h5>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Person
                      size={20}
                      className="text-dark rounded-circle me-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row">
          {currentItems.length > 0 ? (
            currentItems.map((application) => (
              <div
                className="col-sm-12 col-md-6 col-lg-4 mb-4"
                key={`${application.Line_User_ID}-${application.id}`}
              >
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{application.Event_Name}</h5>
                    <h6 className="card-subtitle mb-2 text-muted">
                      {application.Name}
                    </h6>
                    {application.Date_Time && (
                      <p className="card-text">
                        日時: {formatDate(application.Date_Time)} -{" "}
                        {formatTime(application.Date_Time)}
                        <br />
                        場所: {application.Location}
                      </p>
                    )}
                    {application.Preferred_Date && (
                      <p className="card-text">
                        日時: {formatDate(application.Preferred_Date)} -{" "}
                        {application.Preferred_Time}
                      </p>
                    )}
                    <Link
                      href={`/Users/Moshikomi_List/Details_List/${application.Line_User_ID}/${application.id}`}
                      className="btn btn-primary btn-sm"
                    >
                      詳細を見る
                    </Link>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-12">
              <p className="text-center">
                イベント申込リストが見つかりませんでした
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {selectApplication.length > itemsPerPage && (
          <nav aria-label="Page navigation">
            <ul className="pagination justify-content-center">
              {renderPageNumbers()}
            </ul>
          </nav>
        )}
      </div>
      <Footer/>
    </div>
  );
}
