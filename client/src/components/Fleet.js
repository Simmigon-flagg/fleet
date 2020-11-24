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
// MONGODB_URI
// mongodb+srv://kaipherDev:owfz4FJMVS9oIehs@kaiphercluster-cb79m.mongodb.net/boxy_burgers?retryWrites=true&w=majority
export default Fleet;
