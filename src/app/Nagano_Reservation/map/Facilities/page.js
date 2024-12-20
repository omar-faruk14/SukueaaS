"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import "@Om/app/globals.css";
import styles from "./AllFacilities2.module.css"; // Import the CSS module for skeleton styles

import { GeoAlt } from "react-bootstrap-icons";
import Header from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Header";
import Footer from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Footer";

const itemsPerPage = 6;

export default function AllFacilities2() {
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [LocationData, setLocationData] = useState([]);
  const [filteredFacilities, setFilteredFacilities] = useState([]);
  const [titleFilter, setTitleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [imageLoading, setImageLoading] = useState({}); // State to track image loading

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/Yoyaku_Nagano/map/facilities");
        const data = await response.json();

        const firstFacilityMap = new Map();

        data.forEach((facility) => {
          const locationId = facility.location_id;
          if (!firstFacilityMap.has(locationId)) {
            firstFacilityMap.set(locationId, facility);
          }
        });

        const uniqueFacilities = Array.from(firstFacilityMap.values());
        setFacilitiesData(uniqueFacilities);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    handleFilter();
  }, [titleFilter, facilitiesData, currentPage]);

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const response = await fetch("/api/Yoyaku_Nagano/map/mapData");
        const data = await response.json();
        setLocationData(data);
      } catch (error) {
        console.error("Error fetching location data:", error);
      }
    };

    fetchLocationData();
  }, []);

  const truncateText = (text, limit) => {
    return text.length > limit ? text.substring(0, limit) + "..." : text;
  };

  const handleFilter = () => {
    if (Array.isArray(facilitiesData)) {
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;

      if (titleFilter) {
        const updatedFilteredFacilities = facilitiesData.filter((facility) =>
          facility.Facilities_detail_title.toLowerCase().includes(
            titleFilter.toLowerCase()
          )
        );
        setFilteredFacilities(
          updatedFilteredFacilities.slice(startIndex, endIndex)
        );
      } else {
        setFilteredFacilities(facilitiesData.slice(startIndex, endIndex));
      }
    }
  };

  const totalPages = Math.ceil(facilitiesData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const getLocationLatLon = (locationId) => {
    const location = LocationData.find((loc) => loc.id === locationId);
    return location
      ? { lat: location.lat, lon: location.lon, Map_Location: location.title }
      : { lat: "", lon: "", Map_Location: "" };
  };

  const handleImageLoad = (facilityId) => {
    setImageLoading((prev) => ({ ...prev, [facilityId]: false }));
  };

  const handleImageError = (facilityId) => {
    setImageLoading((prev) => ({ ...prev, [facilityId]: false }));
  };

  return (
    <div>
      <Header />
      <div className="container overflow-hidden">
        <div className="row gx-5 pt-5 mb-3 justify-content-center">
          <div className="col-lg-8 col-xl-6">
            <div className="text-center">
              <h2 className="fw-bolder">施設一覧</h2>
              <p className="lead fw-normal text-muted mb-5">施設の詳細</p>
              <input
                type="text"
                className="form-control mb-4"
                placeholder="名前で検索"
                value={titleFilter}
                onChange={(e) => setTitleFilter(e.target.value)}
              />
            </div>
          </div>
        </div>
        <div className="row gx-5">
          {filteredFacilities.map((facility) => (
            <div key={facility.id} className="col-lg-4 mb-5">
              <div className="card h-100 shadow border-0">
                <Link
                  href={`/Nagano_Reservation/map/DetailsFacilities/${facility.location_id}/${facility.id}`}
                >
                  <div
                    style={{
                      position: "relative",
                      width: "100%",
                      height: "250px",
                    }}
                  >
                    {imageLoading[facility.id] !== false && (
                      <div className={styles.skeleton}></div> // Show skeleton if image is loading
                    )}
                    <Image
                      className="card-img-top"
                      src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Yoyaku_Nagano/map/facilities/${facility.Facilities_detail_image[0]?.fileKey}`}
                      alt={facility.Facilities_detail_title}
                      style={{
                        objectFit: "cover",
                        display:
                          imageLoading[facility.id] === false
                            ? "block"
                            : "none",
                      }}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      priority
                      fill
                      onLoad={() => handleImageLoad(facility.id)}
                      onError={() => handleImageError(facility.id)}
                    />
                  </div>
                </Link>
                <div className="card-body p-4">
                  <p className="card-text">
                    <small className="text-muted">
                      <a
                        className="link-secondary text-decoration-none"
                        href={`/map/FacilitiesLocation/${
                          getLocationLatLon(facility.location_id).lat
                        }/${getLocationLatLon(facility.location_id).lon}/${
                          facility.location_id
                        }`}
                      >
                        <GeoAlt className="me-2 text-primary" />
                        <span className="badge bg-primary bg-gradient rounded-pill fw-bold mb-2">
                          {facility.location_title}
                        </span>
                      </a>
                    </small>
                  </p>

                  <Link
                    href={`/Nagano_Reservation/map/DetailsFacilities/${facility.location_id}/${facility.id}`}
                    className="text-decoration-none fw-bold link-dark"
                  >
                    <h5 className="card-title mb-3">
                      {facility.Facilities_detail_title}
                    </h5>
                  </Link>

                  <Link
                    href={`/Nagano_Reservation/map/DetailsFacilities/${facility.location_id}/${facility.id}`}
                    className="text-decoration-none link-dark"
                  >
                    <p className="card-text mb-0">
                      {truncateText(
                        facility.Facilities_detail_description,
                        100
                      )}
                    </p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        <nav>
          <ul className="pagination justify-content-center">
            {Array.from({ length: totalPages }).map((_, index) => (
              <li
                key={index}
                className={`page-item ${
                  currentPage === index + 1 ? "active" : ""
                }`}
              >
                <button
                  onClick={() => handlePageChange(index + 1)}
                  className="page-link"
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      <Footer />
    </div>
  );
}
