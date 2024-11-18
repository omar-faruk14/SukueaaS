"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import axios from "axios";
import { GeoAlt } from "react-bootstrap-icons";
import Header from "@Om/components/HeaderandFooter/Header";
import Footer from "@Om/components/HeaderandFooter/Footer";
const Event = ({params}) => {
  const [events, setEvents] = useState([]);
  const [Map_Data, SetMap_Data] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [nameFilter, setNameFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [uniqueDates, setUniqueDates] = useState([]);
  const { id } = params;

  useEffect(() => {
    fetchData();
    Map_FetchData();
  }, [id]);

  useEffect(() => {
    handleFilter();
  }, [nameFilter, dateFilter, events, id]);

  const Map_FetchData = async () => {
    try {
      const responseMap = await fetch("/api/map/mapData");
      const Map_D = await responseMap.json();
      SetMap_Data(Map_D);
    } catch (error) {
      console.error("Error fetching map data:", error);
    }
  };

  const fetchData = async () => {
    try {
      const response = await axios.get("/api/Admin/Event_Information"
      );
      const data = response.data;
      setEvents(data);
      setFilteredEvents(data);
      const filteredDates = [
        ...new Set(
          data
            .filter((event) => event.locations_id.toString() === id)
            .map((event) => formatDate(event.date))
        ),
      ];
      setUniqueDates(filteredDates);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const handleFilter = () => {
    if (nameFilter || dateFilter) {
      const updatedFilteredEvents = events.filter((event) => {
        const nameMatches =
          !nameFilter ||
          event.name.toLowerCase().includes(nameFilter.toLowerCase());
        const dateMatches =
          !dateFilter ||
          dateFilter === "All" ||
          formatDate(event.date).toLowerCase() === dateFilter.toLowerCase();
        const locationIdMatches =
          id === undefined || event.locations_id.toString() === id;
        const publishCheckMatches = event.Publish_Check === "Yes"; // Check if Publish_Check is "Yes"

        return (
          nameMatches && dateMatches && locationIdMatches && publishCheckMatches
        );
      });

      setFilteredEvents(updatedFilteredEvents);
    } else {
      const filteredByLocation = events.filter(
        (event) => id === undefined || event.locations_id.toString() === id
      );
      const publishCheckMatches = filteredByLocation.filter(
        (event) => event.Publish_Check === "Yes"
      );
      setFilteredEvents(publishCheckMatches);
    }
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

  const formatTime = (dateString) => {
    const options = {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone: "Asia/Tokyo",
    };
    return new Date(dateString).toLocaleTimeString("ja-JP", options);
  };

  const getLocationLatLon = (locationId) => {
    const location = Map_Data.find((loc) => loc.id === locationId);
    return location
      ? { lat: location.lat, lon: location.lon, Map_Location: location.title }
      : { lat: "", lon: "", Map_Location: "" };
  };

  const isUpcomingEvent = (date) => {
    const eventDate = new Date(date);
    const currentDate = new Date();
    return eventDate > currentDate;
  };

  const displayEvent = filteredEvents
    .filter((event) => event.locations_id.toString() === id)
    .sort((a, b) => {
      const upcomingComparison =
        isUpcomingEvent(a.date) - isUpcomingEvent(b.date);

      if (upcomingComparison !== 0) {
        return -upcomingComparison; // Display upcoming first
      }

      return new Date(a.date) - new Date(b.date);
    });

  return (
    <div>
      <Header />
      <div className="container-fluid mt-5 p-0 overflow-hidden">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="card bg-light border mb-3 rounded-5">
              <div className="text-center mb-4">
                <h1 className="display-4">イベント一覧</h1>
                <p className="lead">
                  以下のイベントを見つけてフィルタリングしてください。
                </p>
              </div>
              <div className="row justify-content-center">
                <div className="col-lg-8 col-xl-6">
                  <div className="mb-4">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="イベント名でフィルタ"
                        value={nameFilter}
                        onChange={(e) => setNameFilter(e.target.value)}
                      />
                      <select
                        className="form-select"
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                      >
                        <option value="">すべての日付</option>
                        {uniqueDates.map((date, index) => (
                          <option key={index} value={date}>
                            {date}
                          </option>
                        ))}
                      </select>
                      <div className="input-group-append">
                        <button
                          className="btn btn-primary"
                          onClick={handleFilter}
                        >
                          フィルタ
                        </button>
                      </div>
                    </div>
                  </div>
                  <ul className="list-unstyled">
                    {displayEvent.map((event, index) => (
                      <li key={index} className="mb-4 border p-3 rounded">
                        <h3>
                          <Link
                            className="text-decoration-none"
                            href={`/facilities/${event.id}`}
                          >
                            {event.name}
                          </Link>
                        </h3>
                        <p className=" mt-3">
                          <span className="badge bg-primary bg-gradient rounded-pill fw-bold mb-2">
                            {formatDate(event.date)}
                          </span>{" "}
                          <span className="badge bg-secondary bg-gradient rounded-pill fw-bold mb-2">
                            {formatTime(event.date)}
                            {" - "}
                            {event.End_Time}
                          </span>
                        </p>

                        <p className="card-text">
                          <small className="text-muted">
                            <a
                              className="link-secondary text-decoration-none"
                              href={`/MapView/${
                                getLocationLatLon(event.locations_id).lat
                              }/${getLocationLatLon(event.locations_id).lon}/${
                                event.locations_id
                              }`}
                            >
                              <GeoAlt className="me-2 text-primary" />
                              <span className="text-dark rounded-pill fw-bold mb-2">
                                {
                                  getLocationLatLon(event.locations_id)
                                    .Map_Location
                                }
                              </span>
                            </a>
                          </small>
                        </p>
                        <p>{event.details}</p>
                        <div className="container">
                          <div className="row">
                            <div className="col-sm-6 mb-2">
                              <a
                                href={`${process.env.REACT_APP_Line_Server}/line4/${event.id}/login_form`}
                                className="btn btn-primary w-100"
                              >
                                イベントに申し込む
                              </a>
                            </div>
                            <div className="col-sm-6">
                              <Link
                                href={`/facilities-details/${id}`}
                                className="btn btn-primary w-100"
                              >
                                施設詳細情報
                              </Link>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default Event;
