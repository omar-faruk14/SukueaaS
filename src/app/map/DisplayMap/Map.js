"use client";
import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { renderToString } from "react-dom/server";
import StickyFooter from "@Om/components/HeaderandFooter/StickyFooter";
import './map.css'

export default function Map() {
  const mapRef = useRef(null);
  const layersControlRef = useRef(null);
  const mapContainerRef = useRef(null);
  const [userMarker, setUserMarker] = useState(null);

  const showUserLocation = () => {
    if (userMarker) {
      mapRef.current.removeLayer(userMarker);
    }

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;

        const userIcon = L.divIcon({
          html: '<i class="fas fa-location-dot fa-lg text-success"></i>',
          className: "custom-marker-icon",
          iconSize: [20, 20],
          iconAnchor: [10, 20],
        });

        const newUserMarker = L.marker([lat, lon], { icon: userIcon }).addTo(
          mapRef.current
        );
        mapRef.current.setView([lat, lon], 13);
        setUserMarker(newUserMarker);
      });
    }
  };

  const fetchMapData = async () => {
    if (!mapRef.current || layersControlRef.current) return;

    try {
      const endpoint = "/api/map/mapData";
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
          <div class="card">
            <div class="card-body border border-secondary">
              <h5 class="card-title text-center bg-light border">${title}</h5>
              <p class="card-text">
                <small class="text-muted">Latitude: ${lat}, Longitude: ${lon}</small>
              </p>
              <a href="/map/mapInsideFacilities/${id}" class="btn btn-secondary text-center text-white">施設詳細情報</a>
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
    }
  };

  useEffect(() => {
    if (!mapRef.current && mapContainerRef.current) {
      const mapInstance = L.map(mapContainerRef.current).setView(
        [35.9121, 138.2378],
        16,
      
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
