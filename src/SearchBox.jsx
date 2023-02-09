import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import moment from "moment";
import "moment/locale/it";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";

function SearchBox({ setData, setError }) {
  const [titolo, setTitolo] = useState("");
  const [areaTecnica, setAreaTecnica] = useState("");
  const [dataFrom, setDataFrom] = useState("");
  const [dataTo, setDataTo] = useState("");
  const [testo, setTesto] = useState("");
  const [selectedOption, setSelectedOption] = useState("titolo");
  const [includeDates, setIncludeDates] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    let queryString = "";

    if (includeDates && dataFrom && dataTo) {
      queryString +=
        "?pdfrom=" +
        moment(dataFrom).format("YYYYMMDD") +
        "&pdto=" +
        moment(dataTo).format("YYYYMMDD");
    }

    if (selectedOption === "titolo" && titolo) queryString += "&ti=" + titolo;
    if (testo) queryString += "&txt=" + testo;
    if (selectedOption === "area-tecnica" && areaTecnica) {
      switch (areaTecnica) {
        case "freno":
          queryString += "&tecarea=A91";
          break;
        case "motore":
          queryString += "&tecarea=A55";
          break;
        case "trasmissione":
          queryString += "&tecarea=F91";
          break;
        default:
          break;
      }
    }

    // Send the GET request to the API backend
    fetch("https://quaestio-be.azurewebsites.net/api/v1/search" + queryString)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error(response.statusText);
      })
      .then((data) => {
        console.log(data);
        setData(data);
      })
      .catch((error) => {
        setError(error.message);
      });
  };
  const handleChange = (e) => {
    if (e.target.value === "titolo") {
      setSelectedOption("titolo");
    } else if (e.target.value === "area-tecnica") {
      setSelectedOption("area-tecnica");
    }
  };

  return (
    <div className="search-container">
      <div className="container">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-group row">
            <div>
              <input
                type="radio"
                className="radio-btn"
                name="search-option"
                value="titolo"
                checked={selectedOption === "titolo"}
                onChange={handleChange}
              />
              <label>Titolo:</label>
            </div>
            <div className="col-sm-11">
              <div className="control-container">
                <select
                  className="form-control"
                  value={titolo}
                  onChange={(e) => setTitolo(e.target.value)}
                >
                  <option value="null">Nome</option>
                  <option value="Ferrari">Ferrari</option>
                  <option value="Lamborghini">Lamborghini</option>
                  <option value="Porsche">Porsche</option>
                  <option value="Quantum">Quantum</option>
                </select>
              </div>
            </div>
          </div>
          <div className="form-group row">
            <div>
              <input
                type="radio"
                className="radio-btn"
                name="search-option"
                value="area-tecnica"
                checked={selectedOption === "area-tecnica"}
                onChange={handleChange}
              />
              <label>Area:</label>
            </div>
            <div className="col-sm-11">
              <div className="control-container">
                <select
                  className="form-control"
                  value={areaTecnica}
                  onChange={(e) => setAreaTecnica(e.target.value)}
                >
                  <option value="null">Nome</option>
                  <option value="freno">Freno</option>
                  <option value="motore">Motore</option>
                  <option value="trasmissione">Trasmissione</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-group row">
            <div className="col-sm-6">
              <div className="data-check-row">
                <input
                  type="checkbox"
                  className="form-check-input"
                  value={includeDates}
                  onChange={(e) => setIncludeDates(!includeDates)}
                />
                <label className="form-check-label-data">Data: </label>
              </div>
              <div className="form-group row">
                <div className="dal-row">
                  <label className="dal">Dal:</label>
                  <DatePicker
                    className="datepicker-textbox-one"
                    selected={dataFrom}
                    onChange={(date) => setDataFrom(date)}
                  />
                </div>
                <div className="form-group row">
                  <div className="al-row">
                    <label className="al">Al:</label>
                    <DatePicker
                      className="datepicker-textbox-two"
                      selected={dataTo}
                      onChange={(date) => setDataTo(date)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group">
            <div className="form-check">
              <input type="checkbox" className="form-check-input" />
              <label className="form-check-label-testo">Testo:</label>
              <div className="form-group row">
                <input
                  type="text"
                  className="testo-text"
                  value={testo}
                  onChange={(e) => setTesto(e.target.value)}
                />
              </div>
            </div>
            <div className="ricerca">
              <div className="form-group text-center search-button-container">
                <button className="btn btn-primary search-button">
                  Ricerca
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SearchBox;
