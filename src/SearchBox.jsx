import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import moment from "moment";
import "moment/locale/it";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { showLoading, hideLoading } from "./LoadingUtils.jsx";

function SearchBox({ setData, setError }) {
  const [titolo, setTitolo] = useState("");
  const [areaTecnica, setAreaTecnica] = useState("");
  const [dataFrom, setDataFrom] = useState(null);
  const [dataTo, setDataTo] = useState(null);
  const [testo, setTesto] = useState("");
  const [selectedOption, setSelectedOption] = useState("titolo");
  const [includeDates, setIncludeDates] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    let queryString = "?";
    if (selectedOption === "titolo" && titolo) {
      queryString += "ti=" + titolo;
    } else if (selectedOption === "area-tecnica" && areaTecnica) {
      switch (areaTecnica) {
        case "freno":
          queryString += "tecarea=A91";
          break;
        case "motore":
          queryString += "tecarea=A55";
          break;
        case "trasmissione":
          queryString += "tecarea=F91";
          break;
        default:
          break;
      }
    }
    if (includeDates && dataFrom && dataTo) {
      queryString +=
        "&pdfrom=" +
        moment(dataFrom).format("YYYYMMDD") +
        "&pdto=" +
        moment(dataTo).format("YYYYMMDD");
    }
    if (testo) queryString += "&txt=" + testo;

    try {
      showLoading();

      // Send the GET request to the API backend
      const response = await fetch(
        "https://quaestio-be.azurewebsites.net/api/v1/search" + queryString
      );
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      const data = await response.json();
      console.log(data);
      setData(data);
    } catch (error) {
      setError(error.message);
    } finally {
      hideLoading();
    }
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
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="titolo"
                name="search-option"
                className="custom-control-input"
                value="titolo"
                checked={selectedOption === "titolo"}
                onChange={handleChange}
              />
              <label className="custom-control-label" htmlFor="titolo">
                Titolo
              </label>
            </div>
            <div className="col-sm-8">
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

          <div className="form-group row">
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="area-tecnica"
                name="search-option"
                className="custom-control-input"
                value="area-tecnica"
                checked={selectedOption === "area-tecnica"}
                onChange={handleChange}
              />
              <label className="custom-control-label" htmlFor="area-tecnica">
                Area
              </label>
            </div>
            <div className="col-sm-8">
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

          <div className="form-group row">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="include-dates"
                value={includeDates}
                onChange={(e) => setIncludeDates(!includeDates)}
              />
              <label className="custom-control-label" htmlFor="include-dates">
                Data:
              </label>
            </div>
            <div className="col-sm-4">
              <div className="date-picker-div">
                <label className="mr-2">Dal:</label>
                <DatePicker
                  className="form-control"
                  selected={dataFrom}
                  onChange={(date) => setDataFrom(date)}
                />
              </div>
            </div>
            <div className="col-sm-4">
              <div className="date-picker-div">
                <label className="mr-2">Al:</label>
                <DatePicker
                  className="form-control"
                  selected={dataTo}
                  onChange={(date) => setDataTo(date)}
                />
              </div>
            </div>
          </div>

          <div className="form-group row">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="testo-checkbox"
              />
              <label className="custom-control-label" htmlFor="testo-checkbox">
                Testo:
              </label>
            </div>
            <div className="col-sm-8">
              <input
                type="text"
                className="form-control"
                value={testo}
                onChange={(e) => setTesto(e.target.value)}
              />
            </div>
          </div>
          <div className="form-group text-center search-button-container">
            <button type="submit" className="btn btn-primary search-button">
              Ricerca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SearchBox;
