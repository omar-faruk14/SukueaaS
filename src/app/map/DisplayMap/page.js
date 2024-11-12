"use client";
import React from "react";
import dynamic from "next/dynamic";

// Import the new custom loading component
import CustomLoading from "@Om/components/CustomLoading/CustomLoading";

const MapView = dynamic(
  () => import("@Om/app/map/DisplayMap/Map"),
  {
    loading: () => <CustomLoading />,
    ssr: false,
  }
);

const MapPage = () => {
  return (
    <div>
      <MapView />
    </div>
  );
};

export default MapPage;
