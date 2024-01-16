import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import WelcomePage from "./pages/WelcomePage.jsx";
import { getUserProfile } from "./redux/userProfileSlice.js";

function App() {
  const isLogged = useSelector(state => state.login.isLogged);
  const token = useSelector(state => state.login.token);
  const dispatch = useDispatch();

  // Userprofile fetch after login
  useEffect(() => {
    if (isLogged) {
      dispatch(getUserProfile({ token: token }))
    }
  }, [isLogged])

  return (

    <Router>
      <Navbar />
      <Routes>
        <Route exac path="/" element={isLogged ? <Homepage /> : <WelcomePage />} />
      </Routes>
    </Router>

  );
}

export default App;
