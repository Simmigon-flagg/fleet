import React, { useState, useEffect } from "react";
import Fleet from "../components/Fleet";
import Map from "../components/Map";

const FleetPage = () => {
  const [GM_fleet, setGM_Fleet] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const fetchData = async () => {
      const result = await fetch(`/api/v1/fleet`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const body = await result.json();
      setGM_Fleet(body);
    };
    fetchData();
  }, []);
  return (
  
      <div className="container mt-5">
        <div className="row">
          <div className="col-sm-3"> <Fleet GM_fleet={GM_fleet} /></div>
          <div className="col-sm-9"><Map fleetData={GM_fleet} /></div>
        </div>

      </div>
  );
};

export default FleetPage;
