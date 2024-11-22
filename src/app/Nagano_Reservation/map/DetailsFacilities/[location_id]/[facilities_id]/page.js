"use client";

import React, { useState, useEffect } from "react";
import "@Om/app/globals.css";
import Header from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Header";
import Footer from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Footer";
import Image from "next/image";
import styles from "./FacilitiesDetails.module.css"; // Import CSS module


export default function FacilitiesDetails({ params }) {
  const { location_id, facilities_id } = params;
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [imageLoading, setImageLoading] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `/api/Yoyaku_Nagano/map/facilities/locationID/${location_id}`
        );
        const data = await response.json();
        setFacilitiesData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [location_id]);

  const filteredFacilitiesWithId = facilitiesData.filter(
    (facility) =>
      facility.location_id === location_id &&
      (facilities_id ? facility.id === facilities_id : true)
  );

  const filteredFacilitiesWithoutId = facilitiesData.filter(
    (facility) =>
      facility.location_id === location_id &&
      (facilities_id ? facility.id !== facilities_id : true)
  );

  const combinedFacilities = [
    ...filteredFacilitiesWithId,
    ...filteredFacilitiesWithoutId,
  ];

  const handleImageLoad = (facilityId) => {
    setImageLoading((prev) => ({ ...prev, [facilityId]: false }));
  };

  const handleImageError = (facilityId) => {
    setImageLoading((prev) => ({ ...prev, [facilityId]: false }));
  };

  return (
    <div
      className="d-flex flex-column"
      style={{ backgroundColor: "lightblue" }}
    >
      <Header />
      <div className="container-fluid mt-5 p-0 overflow-hidden">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card bg-light border mb-3 rounded-5 p-4">
              <h1 className="card-title text-center mb-4">施設詳細画面</h1>

              {combinedFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="card bg-light border mb-3 rounded-5"
                >
                  <div className="card-body">
                    <div className="text-center">
                      <h3 className="card-title" style={{ color: "green" }}>
                        {facility.Facilities_detail_title}
                      </h3>
                      <br />
                      {facility.Facilities_detail_image.map((image, index) => (
                        <div key={index} className={styles.imageContainer}>
                          {imageLoading[`${facility.id}_${index}`] !==
                            false && (
                            <div className={styles.skeleton}></div> // Skeleton loader
                          )}
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/Yoyaku_Nagano/map/facilities/${image.fileKey}`}
                            alt={image.name || "Facility Image"}
                            fill
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            className={`img-thumbnail ${
                              imageLoading[`${facility.id}_${index}`] === false
                                ? ""
                                : styles.hidden
                            }`}
                            onLoad={() =>
                              handleImageLoad(`${facility.id}_${index}`)
                            }
                            onError={() =>
                              handleImageError(`${facility.id}_${index}`)
                            }
                          />
                        </div>
                      ))}
                      <br /> <br />
                    </div>
                    <p className="card-text">
                      {facility.Facilities_detail_description.split("\n").map(
                        (line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            <br />
                          </React.Fragment>
                        )
                      )}

                      {facility.Facilities_Details_Link && (
                        <p>
                          URL:{" "}
                          <a
                            href={facility.Facilities_Details_Link}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {facility.Facilities_Details_Link}
                          </a>
                        </p>
                      )}
                    </p>
                  </div>
                </div>
              ))}
              {!combinedFacilities.length && <p>Loading...</p>}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
