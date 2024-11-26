"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { renderToString } from "react-dom/server";
import StickyFooter from "@Om/app/Nagano_Reservation/components/HeaderandFooter/StickyFooter";
import CustomLoading from "@Om/components/CustomLoading/CustomLoading";
import './map.css'

import "@Om/app/globals.css";


export default function Map() {
  const mapRef = useRef(null);
  const layersControlRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [userMarker, setUserMarker] = useState(null);
  const [loadingData, setLoadingData] = useState(true);

 const showUserLocation = () => {
   if ("geolocation" in navigator) {
     navigator.geolocation.getCurrentPosition((position) => {
       const { latitude, longitude } = position.coords;

       // Create a custom FontAwesome icon with a class name
       const customIcon = L.divIcon({
         html: `
    <div class="current-location-icon"></div>
  `,
         className: "", 
         iconSize: [20, 20], 
         iconAnchor: [10, 10], 
       });

       // Add the marker with popup
       const userMarker = L.marker([latitude, longitude], {
         icon: customIcon,
       }).addTo(mapRef.current);
       // .bindPopup("現在地")
       // .openPopup();

       // Center the map on the user's location
       mapRef.current.setView([latitude, longitude], 13);
     });
   }
 };

  const fetchMapData = async () => {
    if (!mapRef.current || layersControlRef.current) return;
     setLoadingData(true);

    try {
      const endpoint = "/api/Yoyaku_Nagano/map/mapData";
      const response = await axios.get(endpoint);
      const apiData = response.data;
      const groups = {};

      apiData.forEach((data) => {
        const { id, lat, lon, title, description, group } = data;

        if (!groups[group]) {
          groups[group] = L.layerGroup().addTo(mapRef.current);
        }

        const customIcon = L.divIcon({
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
  <div class="custom-popup">
    <div class="custom-card">
      <div class="custom-card-body">
        <h5 class="custom-card-title">${title}</h5>
        <p class="custom-card-text">
          <small>Latitude: ${lat}, Longitude: ${lon}</small>
        </p>
        <div class="custom-button-container">
          <a href="/Nagano_Reservation/map/mapInsideFacilities/${id}" class="custom-button">施設詳細情報</a>
        </div>
      </div>
    </div>
  </div>`;



        const newMarker = L.marker([lat, lon], { icon: customIcon }).bindPopup(
          popupContent
        );
        newMarker.on("click", () => newMarker.openPopup());

        groups[group].addLayer(newMarker);
      });

      layersControlRef.current = L.control
        .layers(null, groups, { position: "topright" })
        .addTo(mapRef.current);
    } catch (error) {
      console.error("Error fetching data from API:", error);
    } finally {
      setLoadingData(false); // Hide loading overlay
    }
  };

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const mapInstance = L.map(mapContainerRef.current).setView(
        [36.6436, 138.1878],
        12
      );
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(
        mapInstance
      );

      mapRef.current = mapInstance;

      const ShowUserLocationControl = L.Control.extend({
        options: { position: "topleft" },
        onAdd: function () {
          const container = L.DomUtil.create(
            "div",
            "leaflet-bar leaflet-control"
          );
          container.innerHTML = `<a href="#" title="Show User Location">${renderToString(
            <i className="fas fa-location-arrow text-success" />
          )}</a>`;
          container.onclick = showUserLocation;
          return container;
        },
      });

      mapInstance.addControl(new ShowUserLocationControl());
      fetchMapData();
    }
  }, []);

  return (
    <div>
      
      <section className="py-0">
        <div className="map-container" ref={mapContainerRef}></div>
      </section>
      

      <StickyFooter onShowLocation={showUserLocation} />
    </div>
  );
}
