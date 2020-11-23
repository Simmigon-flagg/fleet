import React, { useState, useMemo } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";

import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import FleetPage from "./pages/FleetPage";
import NotFound from "./pages/NotFoundPage";
import { UserContext } from "./contexts/UserContext";

function App({ history }) {
  const [user, setUser] = useState(null);
  const providerValue = useMemo(() => ({ user, setUser }), [user, setUser]);

  if (user) {
    localStorage.setItem("accessToken", user.accessToken);
    localStorage.setItem("refreshToken", user.refreshToken);
    localStorage.setItem("id", user.id);
    localStorage.setItem("name", user.name);
    localStorage.setItem("isAdmin", user.isAdmin);
  } else {
    const name = localStorage.getItem("name");

    if (name !== null && name !== "undefined") {
      const userData = {
        accessToken: localStorage.getItem("accessToken"),
        refreshToken: localStorage.getItem("refreshToken"),
        id: localStorage.getItem("id"),
        name: localStorage.getItem("name"),
        isAdmin: localStorage.getItem("isAdmin"),
      };
      setUser(userData);
    } else {
      localStorage.clear();
    }
  }

  return (
    <Router>
      <UserContext.Provider value={providerValue}>
        <Navbar />
        <div className="App">
          <Switch>
            <Route exact path="/" component={HomePage} />

            {user && user.IsAdmin == true ? (
              <>
                <Route path="/fleet" component={FleetPage} />
              </>
            ) : null}

            {/* <Route path="/itemlist" component={ItemsListPage} /> */}
            <Route component={NotFound} />
          </Switch>
        </div>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
