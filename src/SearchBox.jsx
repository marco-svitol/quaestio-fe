import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import moment from "moment";
import "moment/locale/it";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { showLoading, hideLoading } from "./LoadingUtils.jsx";

function isTokenExpired(token) {
  if (!token) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const tokenExp = decodedToken.exp;

  return currentTime >= tokenExp;
}

function SearchBox({ setData, setError, refreshToken }) {
  const [richiedente, setRichiedente] = useState("");
  const [areaTecnica, setAreaTecnica] = useState("");
  const [dataFrom, setDataFrom] = useState(null);
  const [dataTo, setDataTo] = useState(null);
  const [testo, setTesto] = useState("");
  const [selectedOption, setSelectedOption] = useState("richiedente");
  const [includeDates, setIncludeDates] = useState(false);

  const setQuickDate = (days) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    setDataFrom(fromDate);
    setDataTo(now);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      showLoading();
      const response = await withTokenRefresh(searchPatents)(
        selectedOption === "richiedente" ? richiedente : "",
        selectedOption === "area-tecnica" ? areaTecnica : "",
        includeDates && dataFrom ? moment(dataFrom).format("YYYYMMDD") : "",
        includeDates && dataTo ? moment(dataTo).format("YYYYMMDD") : "",
        testo
      );

      setData(response);
    } catch (error) {
      setError(error.message);
    } finally {
      hideLoading();
    }
  };

  async function searchPatents(pa, areaTecnica, pdfrom, pdto, txt, token) {
    console.log("searchPatents: token", token);

    const url = new URL("https://quaestio-be.azurewebsites.net/api/v1/search");

    const decodedToken = JSON.parse(atob(token.split(".")[1]));
    const uid = decodedToken.uid;

    const queryParams = new URLSearchParams({
      pa,
      tecarea: areaTecnica,
      pdfrom,
      pdto,
      txt,
      uid,
    });

    url.search = queryParams;

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept:
          "application/json, application/pdf, application/jpeg, application/gif",
      },
    };
    const response = await fetch(url, requestOptions);

    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  }

  function withTokenRefresh(func) {
    return async function (...args) {
      let token = sessionStorage.getItem("token");

      if (isTokenExpired(token)) {
        const refreshed = await refreshToken();
        if (refreshed) {
          token = sessionStorage.getItem("token");
        } else {
          throw new Error("Failed to refresh the token");
        }
      }

      return await func(...args, token);
    };
  }

  const handleChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div className="search-container">
      <div className="container">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-group row">
            <div className="custom-control custom-radio custom-control-inline">
              <input
                type="radio"
                id="richiedente"
                name="search-option"
                className="custom-control-input"
                value="richiedente"
                checked={selectedOption === "richiedente"}
                onChange={handleChange}
              />
              <label
                className="custom-control-label richiedente-label"
                htmlFor="richiedente"
              >
                Richiedente
              </label>
            </div>
            <div className="col-sm-8">
              <select
                className="form-control"
                value={richiedente}
                onChange={(e) => setRichiedente(e.target.value)}
              >
                <option value="null">Nome</option>
                <option value="Ferrari">Ferrari</option>
                <option value="Lamborghini">Lamborghini</option>
                <option value="Porsche">Porsche</option>
                <option value="Quantum">Quantum</option>
                <option value="Emmet Brown">Emmet Brown</option>
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
              <label
                className="custom-control-label area-label"
                htmlFor="area-tecnica"
              >
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
            <div className="col-auto">
              <div className="text-center date-button-container">
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mr-1"
                  onClick={() => setQuickDate(1)}
                >
                  ultime 24 ore
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mr-1"
                  onClick={() => setQuickDate(7)}
                >
                  ultima settimana
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setQuickDate(30)}
                >
                  ultimo mese
                </button>
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
              <label
                className="custom-control-label testo-label"
                htmlFor="testo-checkbox"
              >
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
