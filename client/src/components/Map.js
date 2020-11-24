import React, { Component } from "react";
import { Map, InfoWindow, Marker, GoogleApiWrapper } from "google-maps-react";

const  MapContainer = (props) => {
    const fleet = props.fleetData
    //  const [car, setCar] = useState([])
    console.log(fleet.location)
    return (
      <Map
        google={props.google}
        style={{ width: "100%", height: "100%", position: "relative" }}
        className={"map"}
        zoom={5}
        initialCenter={{
            lat: 33.753746,
            lng: -84.38633
        }}
      >
       {fleet.map((car, key) => (
        
     
        <Marker title={"Remaining car charge: " + String(car.charge)+ "%"} name={car.location} position={{ lat: car.latitude, lng: car.longitude }}/>
         
        
      ))}
      </Map>
    );
  
}

export default GoogleApiWrapper({
  apiKey: process.env.REACT_GOOGLE_API_KEY,
})(MapContainer);
