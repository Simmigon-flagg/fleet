import React, { useState, useEffect } from "react";
// import { UserContext } from "../contexts/UserContext";
import { useForm } from "react-hook-form";
import auth from "../services/auth";

const FleetPage = () => {
  const [fleet, setFleet] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    console.log(token)
    const fetchData = async () => {
      const result = await fetch(`/api/v1/fleet`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjU1M2YxNGFjLWQzODgtNGZjMC1hNGE2LTQ3MWQzOTU1OThlZiIsIm5hbWUiOiJhZG1pbiIsImlzQWRtaW4iOnRydWUsImlhdCI6MTYwNjEwNTMxNiwiZXhwIjoxNjA2MTkxNzE2fQ.yXhCrCKe069ya9W4I6OxfyU-EMAxPP0UYiNRbO0gnZk",
        },
      });
      console.log(result)
      const body = await result.json();
      console.log(body)
      setFleet(body);
    };
    fetchData();
  }, []);
  return (
    <>
      <h1> About the POS Home Screen</h1>
      <div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Optio totam
      </div>
      <div>
        Lorem ipsum dolor sit amet consectetur Lorem ipsum dolor sit amet
      </div>
    </>
  );
};

export default FleetPage;
