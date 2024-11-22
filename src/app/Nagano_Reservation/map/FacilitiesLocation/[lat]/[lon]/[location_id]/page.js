"use client";
import React, { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { GeoAltFill } from "react-bootstrap-icons";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ReactDOMServer from "react-dom/server";
import Header from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Header";
import Footer from "@Om/app/Nagano_Reservation/components/HeaderandFooter/Footer";

// Utility function to convert React component to HTML string
const reactToHTMLString = (reactComponent) => {
  const htmlString = ReactDOMServer.renderToString(reactComponent);
  return htmlString;
};

const endpoint ="/api/map/mapData";

const MapViewFacilities = ({params}) => {
  const mapContainerRef = useRef(null);
  const { lat, lon, location_id } = params;
  const [Map_data, SetMap_data] = useState([]);
  const userMarkerRef = useRef(null);
  const mapRef = useRef(null);

  const FetchMap_data = async () => {
    try {
      const MapResponse = await fetch(endpoint);
      const data = await MapResponse.json();
      SetMap_data(data);
      console.log(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const showUserLocation = () => {
    if (userMarkerRef.current) {
      mapRef.current.removeLayer(userMarkerRef.current);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const userIcon = L.divIcon({
          html: '<i class="fas fa-location-dot fa-2lg text-primary"></i>',
          className: "custom-marker-icon",
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const userMarker = L.marker([lat, lon], { icon: userIcon }).addTo(
          mapRef.current
        );

        userMarkerRef.current = userMarker;

        userMarker.bindPopup("現在地").openPopup();
        mapRef.current.setView([lat, lon], 13);
      });
    }
  };

  useEffect(() => {
    FetchMap_data();
  }, []);

  useEffect(() => {
    if (Map_data.length > 0 && mapContainerRef.current === null) {
      const map = L.map("map").setView([lat, lon], 17);
      L.tileLayer("https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}").addTo(
        map
      );

      mapRef.current = map;

      // Add control for showing user location
      const ShowUserLocationControl = L.Control.extend({
        options: {
          position: "topleft",
        },
        onAdd: function (map) {
          const container = L.DomUtil.create(
            "div",
            "leaflet-bar leaflet-control"
          );
          container.innerHTML = `
            <a href="#" title="Show User Location" role="button" aria-label="Show User Location" class="leaflet-control-button" onclick="return false;">
              ${reactToHTMLString(<GeoAltFill size={20} color="green" />)}
            </a>`;
          container.addEventListener("click", showUserLocation);
          return container;
        },
      });

      map.addControl(new ShowUserLocationControl());

      mapContainerRef.current = true;
    }
  }, [Map_data, lat, lon]);

  useEffect(() => {
    if (Map_data.length > 0 && mapContainerRef.current) {
      const location = Map_data.find((item) => item.id === location_id);

      if (location) {
        const { lat, lon, title, description, id } = location;

        

        const locationIcon = L.divIcon({
          html: '<i class="fas fa-location-dot fa-2x text-danger"></i>',
          className: "custom-marker-icon",
          iconSize: [20, 20],
          iconAnchor: [10, 20],
        });

        const truncatedDescription =
          description.length > 50
            ? `${description.slice(0, 50)}...`
            : description;
        const popupContent = `
        <div class="card">
          <div class="card-body border shadow">
            <h5 class="card-title text-center bg-light border">${title}</h5>
            <p class="card-text">${truncatedDescription} <a href="/screen/${id}" style="text-decoration: none;">もっと</a></p>
            <p class="card-text">
              <small class="text-muted">Latitude: ${lat}, Longitude: ${lon}</small>
            </p>
            <a href="/about" class="btn btn-outline-primary">タクシー配</a>
            <a href="/event/${id}" class="btn btn-outline-primary ">イベント確認・申</a>
          </div>
        </div>`;

        const locationMarker = L.marker([lat, lon], {
          icon: locationIcon,
        }).addTo(mapRef.current);

        locationMarker.bindPopup(popupContent);

        locationMarker.on("click", () => {
          locationMarker.openPopup();
        });
      }
    }
  }, [Map_data, location_id]);

  return (
    <div
      className="d-flex flex-column"
      style={{ backgroundColor: "lightblue" }}
    >
      <Header />
      <section className="py-1">
        <div className="container px-2">
          <div className="bg-light rounded-3 py-1 px-0 px-md-1 mb-1">
            <div className="text-center mb-1"></div>
            <div className="row gx-0 justify-content-center">
              <div className="col-lg-8 col-xl-6"></div>

              <div
                className="map-container"
                style={{ width: "100%", height: "100vh" }}
              >
                <div
                  id="map"
                  className="map"
                  style={{ width: "100%", height: "100%" }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default MapViewFacilities;
