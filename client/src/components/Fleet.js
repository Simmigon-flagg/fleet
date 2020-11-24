import { Link } from "react-router-dom";
import React  from "react";
const Fleet = ({ GM_fleet }) => {
  return (
    <>
      {GM_fleet.map((fleet, key) => (
        <div key={fleet.id}>
          {/* <Link to={`/car/${fleet.carId}`}>View Map</Link> */}
          {<p>{fleet.location} <span>charge: {fleet.charge}</span></p>}
      <hr /> 
        </div>
      ))}
    </>
  );
};
export default Fleet;
