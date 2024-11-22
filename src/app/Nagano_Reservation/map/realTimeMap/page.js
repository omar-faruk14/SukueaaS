"use client";
import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "bootstrap/dist/css/bootstrap.min.css";
import { GeoAltFill } from "react-bootstrap-icons";
import { renderToString } from "react-dom/server";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBus,
  faLocationArrow,
  faCompass,
  faTachometerAlt,
} from "@fortawesome/free-solid-svg-icons";
// import "./MapStyles.css";

const RealTime_with_new_KMZ = () => {
  const mapRef = useRef(null);
  const [bus1Location, setBus1Location] = useState(null);
  const [bus2Location, setBus2Location] = useState(null);
  const markerRefs = useRef({ bus1: null, bus2: null }); // Separate refs for bus markers
  // ******************* This function for Current Location Finding *********************
  const showUserLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        // Create a custom icon using a React Bootstrap icon
        const customIcon = L.divIcon({
          className: "leaflet-custom-icon",
          html: renderToString(<GeoAltFill size={20} color="blue" />),
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        });

        const userMarker = L.marker([latitude, longitude], {
          icon: customIcon,
        }).addTo(mapRef.current);
        //userMarker.bindPopup("Your Location").openPopup();
        mapRef.current.setView([latitude, longitude], 13);
      });
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView(
        [35.91486051291783, 138.24071853834855],
        17
      );

      // // Replace with Google Maps tile layer including API key
      // L.tileLayer(
      //   "https://maps.googleapis.com/maps/vt?lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyAODCV6_jS4tHV7CnTIiim1REGJNLBdoAU",
      //   {
      //     attribution:
      //       '&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a>',
      //     maxZoom: 22,
      //   }
      // ).addTo(map);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 22,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

    //   const map = L.map("map");

    //   // Coordinates for the default view and bounds
    //   const fujimichoYakuba = [35.91486051291783, 138.24071853834855];
    //   const iddojiriHistoricPark = [35.8788212551138, 138.27899477550716];

    //   // Create bounding box
    //   const bounds = L.latLngBounds(
    //     [
    //       Math.min(fujimichoYakuba[0], iddojiriHistoricPark[0]),
    //       Math.min(fujimichoYakuba[1], iddojiriHistoricPark[1]),
    //     ], // Southwest corner
    //     [
    //       Math.max(fujimichoYakuba[0], iddojiriHistoricPark[0]),
    //       Math.max(fujimichoYakuba[1], iddojiriHistoricPark[1]),
    //     ] // Northeast corner
    //   );

      // L.tileLayer(
      //   "https://maps.googleapis.com/maps/vt?lyrs=m&x={x}&y={y}&z={z}&key=AIzaSyAODCV6_jS4tHV7CnTIiim1REGJNLBdoAU",
      //   {
      //     attribution:
      //       '&copy; <a href="https://www.google.com/intl/en_us/help/terms_maps.html">Google Maps</a>',
      //     maxZoom: 22,
      //   }
      // ).addTo(map);

    //   L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    //     maxZoom: 22,
    //   }).addTo(map);

    //   map.fitBounds(bounds, {
    //     padding: [50, 50],
    //     maxZoom: 17,
    //   });

      const bus1Icon = L.divIcon({
        className: "custom-bus-icon", // Updated class name
        html: `<img src="/img/bus1.png" style="width: 20px; height: auto;" />`,
        iconSize: [20, 30],
        iconAnchor: [10, 30],
      });

      const bus2Icon = L.divIcon({
        className: "custom-bus-icon", // Updated class name
        html: `<img src="/img/bus2.png" style="width: 20px; height: auto;" />`,
        iconSize: [20, 30],
        iconAnchor: [10, 30],
      });

      markerRefs.current.bus1 = L.marker([0, 0], { icon: bus1Icon }).addTo(map);
      markerRefs.current.bus2 = L.marker([0, 0], { icon: bus2Icon }).addTo(map);

      mapRef.current = map;

      //this is start for show location
      const ShowUserLocationControl = L.Control.extend({
        options: { position: "topleft" },
        onAdd: function () {
          const container = L.DomUtil.create(
            "div",
            "leaflet-bar leaflet-control"
          );
          container.innerHTML = `<a href="#" title="Show User Location">${renderToString(
            <GeoAltFill size={20} color="green" />
          )}</a>`;
          container.onclick = showUserLocation;
          return container;
        },
      });

      map.addControl(new ShowUserLocationControl());
      // ************* This is  End Of function *********************
    }
  }, []);

  useEffect(() => {
    const socket = new WebSocket("ws://d3u6uikyqt96qk.cloudfront.net/");

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      const { bus_no } = data;

      if (bus_no === "1") {
        setBus1Location(data);
        updateMarkerPosition("bus1", [data.latitude, data.longitude]);
      } else if (bus_no === "2") {
        setBus2Location(data);
        updateMarkerPosition("bus2", [data.latitude, data.longitude]);
      }
    };

    return () => {
      socket.close();
    };
  }, []);

  const updateMarkerPosition = (busNo, newPosition) => {
    if (markerRefs.current[busNo]) {
      const marker = markerRefs.current[busNo];
      const currentPosition = marker.getLatLng();

      const totalSteps = 20; // Number of steps for the animation
      const latDiff = (newPosition[0] - currentPosition.lat) / totalSteps;
      const lngDiff = (newPosition[1] - currentPosition.lng) / totalSteps;

      let step = 0;

      const animateMarker = () => {
        if (step < totalSteps) {
          marker.setLatLng([
            currentPosition.lat + latDiff * step,
            currentPosition.lng + lngDiff * step,
          ]);
          step++;
          requestAnimationFrame(animateMarker); // Use requestAnimationFrame for smooth animation
        } else {
          marker.setLatLng(newPosition); // Ensure it ends at the final position
        }
      };

      animateMarker();
    }
  };

  return (
    <div className="position-relative">
      <div className="container-fluid">
        <div className="row">
          {/* Map Section */}
          <div className="col-12 col-md-8 px-0">
            <div
              id="map"
              style={{
                height: "80vh",
                border: "4px solid #ccc",
                padding: "20px",
                boxShadow: "0px 0px 5px 2px rgba(0,0,0,0.1)",
                borderRadius: "5px",
              }}
            ></div>
          </div>

          {/* Data View Section */}
          <div className="col-12 col-md-4 mt-2">
            <h3 className="mb-4 text-center text-secondary">
              シャトルバスの現在地
            </h3>

            {/* Card for Shuttle Bus 1 */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">シャトルバス 1</h5>
                <FontAwesomeIcon icon={faBus} />
              </div>
              {bus1Location ? (
                <div className="card-body">
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        className="me-2"
                      />
                    </div>
                    <div className="col">
                      <span className="text-muted">経度:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus1Location.longitude}
                      </strong>
                    </div>
                  </div>
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        className="me-2"
                      />
                    </div>
                    <div className="col">
                      <span className="text-muted">緯度:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus1Location.latitude}
                      </strong>
                    </div>
                  </div>
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon icon={faCompass} className="me-2" />
                    </div>
                    <div className="col">
                      <span className="text-muted">北/南:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus1Location.north_south}
                      </strong>
                    </div>
                  </div>
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon icon={faCompass} className="me-2" />
                    </div>
                    <div className="col">
                      <span className="text-muted">東/西:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus1Location.east_west}
                      </strong>
                    </div>
                  </div>
                  {/* <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon
                        icon={faTachometerAlt}
                        className="me-2"
                      />
                    </div>
                    <div className="col">
                      <span className="text-muted">速度:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus1Location.speed} km/h
                      </strong>
                    </div>
                  </div> */}
                </div>
              ) : (
                <div className="card-body text-center">
                  <p className="text-muted">データがありません</p>
                </div>
              )}
            </div>

            {/* Card for Shuttle Bus 2 */}
            <div className="card mb-4 shadow-sm">
              <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                <h5 className="mb-0">シャトルバス 2</h5>
                <FontAwesomeIcon icon={faBus} />
              </div>
              {bus2Location ? (
                <div className="card-body">
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        className="me-2"
                      />
                    </div>
                    <div className="col">
                      <span className="text-muted">経度:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus2Location.longitude}
                      </strong>
                    </div>
                  </div>
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon
                        icon={faLocationArrow}
                        className="me-2"
                      />
                    </div>
                    <div className="col">
                      <span className="text-muted">緯度:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus2Location.latitude}
                      </strong>
                    </div>
                  </div>
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon icon={faCompass} className="me-2" />
                    </div>
                    <div className="col">
                      <span className="text-muted">北/南:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus2Location.north_south}
                      </strong>
                    </div>
                  </div>
                  <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon icon={faCompass} className="me-2" />
                    </div>
                    <div className="col">
                      <span className="text-muted">東/西:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus2Location.east_west}
                      </strong>
                    </div>
                  </div>
                  {/* <div className="row mb-2 align-items-center">
                    <div className="col-auto">
                      <FontAwesomeIcon
                        icon={faTachometerAlt}
                        className="me-2"
                      />
                    </div>
                    <div className="col">
                      <span className="text-muted">速度:</span>
                    </div>
                    <div className="col-auto">
                      <strong className="text-dark">
                        {bus2Location.speed} km/h
                      </strong>
                    </div>
                  </div> */}
                </div>
              ) : (
                <div className="card-body text-center">
                  <p className="text-muted">データがありません</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTime_with_new_KMZ;
