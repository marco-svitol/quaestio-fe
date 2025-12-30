import Navbar from "./components/Navbar.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage.jsx";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import WelcomePage from "./pages/WelcomePage.jsx";
import { getUserProfile } from "./redux/userProfileSlice.js";
import SettingsPage from "./pages/SettingsPage.jsx";
import PrintPage from "./pages/PrintPage.jsx";

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
    <div className="min-h-screen">
      <Router>
        <Navbar />
        <div className="transition-all duration-300 ease-in-out">
          <Routes>
            <Route exact path="/" element={isLogged ? <Homepage /> : <WelcomePage />} />
            <Route exact path="/settings" element={<SettingsPage />} />
            <Route exact path="/print-element" element={<PrintPage />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
