"use client";
import React, { useState, useEffect } from "react";

import Header from "@Om/components/HeaderandFooter/Header";
import Footer from "@Om/components/HeaderandFooter/Footer";


const OptimizeRoute = () => {
  const [mapData, setMapData] = useState([]);
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [waypoints, setWaypoints] = useState([""]);
  const [results, setResults] = useState(null);
  const [currentLocation, setCurrentLocation] = useState(null);

  const fetchData = async () => {
    try {
      const response = await fetch(
        "https://d1uqrcsprcjbp.cloudfront.net/api/map"
      );
      const data = await response.json();
      setMapData(data);
    } catch (error) {
      console.error("Error fetching location data:", error);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            name: "Current Location",
            coordinates: [position.coords.longitude, position.coords.latitude],
          });
        },
        (error) => {
          console.error("Error fetching current location:", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    fetchData();
    getCurrentLocation();
  }, []);

  const handleWaypointChange = (index, value) => {
    const newWaypoints = [...waypoints];
    newWaypoints[index] = value;
    setWaypoints(newWaypoints);
  };

  const addWaypoint = () => {
    setWaypoints([...waypoints, ""]);
  };

  const removeWaypoint = (index) => {
    const newWaypoints = waypoints.filter((_, i) => i !== index);
    setWaypoints(newWaypoints);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const findCoordinates = (placeName) => {
      if (placeName === "Current Location" && currentLocation) {
        return currentLocation;
      }
      const location = mapData.find((location) => location.title === placeName);
      return location
        ? {
            name: location.title,
            coordinates: [parseFloat(location.lon), parseFloat(location.lat)],
          }
        : { name: placeName, coordinates: [0, 0] };
    };

    const startLocation = findCoordinates(start);
    const endLocation = findCoordinates(end);
    const waypointLocations = waypoints.map((waypoint) =>
      findCoordinates(waypoint)
    );

    const payload = {
      start_point: startLocation,
      waypoints: waypointLocations,
      end_point: endLocation,
    };
    console.log(JSON.stringify(payload));

    try {
      const response = await fetch("https://d1uqrcsprcjbp.cloudfront.net/Optimal/optimize_route",
        //"http://127.0.0.1:5000/optimize_route",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching the optimized route:", error);
    }
  };

  const generateGoogleMapsLink = (results) => {
    if (!results || results.length === 0) return "#";

    const coordinates = results.map(
      (route) => `${route.from_coordinates[1]},${route.from_coordinates[0]}`
    );

    // Add the end point's coordinates
    const lastRoute = results[results.length - 1];
    coordinates.push(
      `${lastRoute.to_coordinates[1]},${lastRoute.to_coordinates[0]}`
    );

    return `https://www.google.com/maps/dir/${coordinates.join("/")}`;
  };

  return (
    <div>
        <Header/>
      <div className="container pt-5">
        <h2 className="bg-light">最適順序</h2>
        <div className="row">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">出発地</label>
                <select
                  className="form-select"
                  value={start}
                  onChange={(e) => setStart(e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  {currentLocation && (
                    <option value="Current Location">現在地</option>
                  )}
                  {mapData.map((location) => (
                    <option key={location.id} value={location.title}>
                      {location.title}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">経由</label>
                {waypoints.map((waypoint, index) => (
                  <div key={index} className="input-group mb-2">
                    <select
                      className="form-select"
                      value={waypoint}
                      onChange={(e) =>
                        handleWaypointChange(index, e.target.value)
                      }
                      required
                    >
                      <option value="">選択してください</option>
                      {mapData.map((location) => (
                        <option key={location.id} value={location.title}>
                          {location.title}
                        </option>
                      ))}
                    </select>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => removeWaypoint(index)}
                    >
                      削除(-)
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-light"
                  onClick={addWaypoint}
                >
                  追加(+) 経由
                </button>
              </div>
              <div className="mb-3">
                <label className="form-label">目的地</label>
                <select
                  className="form-select"
                  value={end}
                  onChange={(e) => setEnd(e.target.value)}
                  required
                >
                  <option value="">選択してください</option>
                  {mapData.map((location) => (
                    <option key={location.id} value={location.title}>
                      {location.title}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="btn btn-primary">
                最適順序を探す
              </button>
            </form>
          </div>
          <div className="col-md-6">
            {results && (
              <div>
                <h3>最適化されたルート</h3>
                <ul className="list-group">
                  {results.map((route, index) => (
                    <li key={index} className="list-group-item">
                      <strong>
                        {index + 1}. {route.from}{" "}
                        <span className="display-6 text-danger">→</span>{" "}
                        {route.to}
                      </strong>
                      <br />
                      距離: {route.distance_km.toFixed(2)} km
                      <br />
                      時間: {route.duration_min.toFixed(2)} 分
                      <br />
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&origin=${route.from_coordinates[1]},${route.from_coordinates[0]}&destination=${route.to_coordinates[1]},${route.to_coordinates[0]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Google マップで表示
                      </a>
                    </li>
                  ))}
                </ul>
                <button
                  type="button"
                  className="btn btn-primary mt-3"
                  onClick={() =>
                    window.open(generateGoogleMapsLink(results), "_blank")
                  }
                >
                  すべてのポイントをGoogle マップで表示
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default OptimizeRoute;
