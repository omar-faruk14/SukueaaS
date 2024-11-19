"use client";

import React, { useState, useEffect } from "react";
import Header from "@Om/components/HeaderandFooter/Header";
import Footer from "@Om/components/HeaderandFooter/Footer";
import CustomLoading from "@Om/components/CustomLoading/CustomLoading2";




export default function FacilitiesDetails({params}) {
  const { location_id } = params;
  
  const [facilitiesData, setFacilitiesData] = useState([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoadingData(true);
      try {
        const response = await fetch(
          `/api/Yoyaku_Nagano/map/facilities/locationID/${location_id}`
        );
        const data = await response.json();
        setFacilitiesData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false); // Hide loading overlay
      }
    };

    fetchData();
  }, []);

  const filteredFacilities = facilitiesData.filter(
    (facility) => facility.location_id === location_id
  );

  return (
    <div
      className="d-flex flex-column"
      style={{ backgroundColor: "lightblue" }}
    >
      <Header />
      <div className="container-fluid mt-5 p-0 overflow-hidden">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card bg-light border mb-3 rounded-5 p-0">
              {loadingData ? (
                <CustomLoading />
              ) : (
                <div>
                  <h1 className="card-title text-center mb-4">施設詳細画面</h1>

                  {filteredFacilities.map((facility) => (
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
                          {facility.Facilities_detail_image.map(
                            (image, index) => (
                              <img
                                key={index}
                                src={`/api/Yoyaku_Nagano/map/facilities/${image.fileKey}`}
                                className="img-thumbnail"
                                alt={image.name}
                                style={{ maxWidth: "100%", height: "auto" }}
                                loading="lazy"
                              />
                            )
                          )}
                          <br /> <br />
                        </div>
                        <div className="text-left">
                          <p className="card-text">
                            {facility.Facilities_detail_description.split(
                              "\n"
                            ).map((line, index) => (
                              <React.Fragment key={index}>
                                {line}
                                <br />
                              </React.Fragment>
                            ))}
                          </p>
                          {facility.Facilities_Details_Link && (
                            <div className="card-text">
                              🔗{" "}
                              <a
                                href={facility.Facilities_Details_Link}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {facility.Facilities_Details_Link}
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {!filteredFacilities.length && (
                    <p className="ms-3">詳細情報がありません...</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
