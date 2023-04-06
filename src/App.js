import React, { useState } from "react";
import SearchBox from "./SearchBox";
import LoginBox from "./LoginBox";
import NavBar from "./NavBar";
import ReactGrid from "./ReactGrid";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);
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
            <SearchBox setData={setData} setError={setError} />
            {data.length > 0 && <ReactGrid data={data} error={error} />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
