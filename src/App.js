import React, { useState } from "react";
import SearchBox from "./SearchBox";
import LoginBox from "./LoginBox";
import NavBar from "./NavBar";
import ReactGrid from "./ReactGrid";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [data, setData] = useState([]);
  const [setError] = useState(null);
  const [isLoginDisplayed, setIsLoginDisplayed] = useState(true);

  const toggleDisplay = () => {
    setIsLoginDisplayed(!isLoginDisplayed);
  };

  return (
    <div className="App">
      <NavBar />
      <div className="big-div">
        {isLoginDisplayed ? (
          <LoginBox toggleDisplay={toggleDisplay} />
        ) : (
          <>
            <div className="app-container">
              <SearchBox setData={setData} setError={setError} />
              <ReactGrid data={data} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
