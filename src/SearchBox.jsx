import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./App.css";
import moment from "moment";
import "moment/locale/it";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import { showLoading, hideLoading } from "./LoadingUtils.jsx";
import { API_BASE_URL } from "./constants";

function isTokenExpired(token) {
  if (!token) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  const decodedToken = JSON.parse(atob(token.split(".")[1]));
  const tokenExp = decodedToken.exp;

  return currentTime >= tokenExp;
}
function SearchBox({
  setData,
  setError,
  refreshToken,
  searchParams,
  setSearchParams,
}) {
  const [richiedente, setRichiedente] = useState(
    searchParams.richiedente || ""
  );
  const [areaTecnica, setAreaTecnica] = useState(
    searchParams.areaTecnica || ""
  );
  const [dataFrom, setDataFrom] = useState(searchParams.dataFrom || null);
  const [dataTo, setDataTo] = useState(searchParams.dataTo || null);
  const [testo, setTesto] = useState(searchParams.testo || "");
  const [testoCheckbox, setTestoCheckbox] = useState(false);
  const [includeRichiedente, setIncludeRichiedente] = useState(
    searchParams.includeRichiedente || false
  );
  const [includeAreaTecnica, setIncludeAreaTecnica] = useState(
    searchParams.includeAreaTecnica || false
  );
  const [includeDates, setIncludeDates] = useState(
    searchParams.includeDates || false
  );
  const [applicants, setApplicants] = useState([]);
  const [tecareas, setTecareas] = useState([]);
  const [applicantsLoading, setApplicantsLoading] = useState(true);
  const [tecareasLoading, setTecareasLoading] = useState(true);
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  useEffect(() => {
    (async function () {
      try {
        const token = sessionStorage.getItem("token");
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        const uid = decodedToken.uid;
        const userProfile = await getUserProfile(uid, token);

        const profile = userProfile[0];

        setApplicants(profile.searchvalues.applicants);
        setTecareas(profile.searchvalues.tecareas);
      } catch (error) {
        setError(error.message);
      } finally {
        setApplicantsLoading(false);
        setTecareasLoading(false);
      }
    })();
  }, [setError]);

  useEffect(() => {
    if (richiedente !== "" &&( (includeAreaTecnica && (areaTecnica !== "")) || !includeAreaTecnica ) ) { 
      setIsButtonDisabled(false); 
    } 
    else {
      setIsButtonDisabled(true);
    }
  },[richiedente, includeAreaTecnica, areaTecnica]);

  async function getUserProfile(uid, token) {
    const url = new URL(
      `${API_BASE_URL}/api/v2/userprofile`
    );

    url.search = new URLSearchParams({ uid });

    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    };
    const response = await fetch(url, requestOptions);
    if (!response.ok) {
      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
    const data = await response.json();

    // console.log("Response:", response);
    // console.log("Data:", data);

    return data;
  }

  const setQuickDate = (days) => {
    const now = new Date();
    const fromDate = new Date();
    fromDate.setDate(now.getDate() - days);
    setDataFrom(fromDate);
    setDataTo(now);
    setIncludeDates(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      showLoading();
      const response = await withTokenRefresh(searchPatents)(
        includeRichiedente ? richiedente : "",
        includeAreaTecnica ? areaTecnica : "",
        includeDates && dataFrom ? moment(dataFrom).format("YYYYMMDD") : "",
        includeDates && dataTo ? moment(dataTo).format("YYYYMMDD") : "",
        testo
      );

      setData(response);
      setSearchParams({
        richiedente,
        areaTecnica,
        dataFrom,
        dataTo,
        testo,
        includeRichiedente,
        includeAreaTecnica,
        includeDates,
      });
    } catch (error) {
      setError(error.message);
    } finally {
      hideLoading();
    }
  };

  async function searchPatents(pa, areaTecnica, pdfrom, pdto, txt, token) {
    const url = new URL(`${API_BASE_URL}/api/v2/search`);

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

    if (data.userinfo && data.userinfo["throttling-control"]) {
      const throttlingControl = data.userinfo["throttling-control"];
      const throttlingInfo = throttlingControl
        .map((item) => item.join(":"))
        .join(",");

      const individualQuota = data.userinfo["individualquotaperhour-used"];
      const registeredQuota = data.userinfo["registeredquotaperweek-used"];

      console.log(
        `${throttlingInfo},individualquotaperhour-used:${individualQuota},registeredquotaperweek-used:${registeredQuota}`
      );
    }

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

  const handleChangeRichiedente = (e) => {
    setIncludeRichiedente(e.target.checked);
    if (!e.target.checked) {
      setRichiedente("");
      setAreaTecnica("");
    }
  };

  const handleChangeAreaTecnica = (e) => {
    setIncludeAreaTecnica(e.target.checked);
    if (!e.target.checked) {
      setAreaTecnica("");
    }
  };

  return (
    <div className="search-container">
      <div className="container">
        <form className="search-form" onSubmit={handleSubmit}>
          <div className="form-group row">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                id="richiedente"
                name="search-option"
                className="custom-control-input"
                value="richiedente"
                checked={(richiedente !== "")}
                onChange={handleChangeRichiedente}
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
                onChange={(e) => { 
                    setRichiedente(e.target.value);
                    setIncludeRichiedente(e.target.value !== "");
                  }
                }
              >
                {applicantsLoading ? (
                  <option>Caricamento richiedente...</option>
                ) : (
                  <>
                    <option value="">Selezionare il richiedente</option>
                    {applicants.map((applicant) => (
                      <option key={applicant.id} value={applicant.id}>
                        {applicant.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                id="area-tecnica"
                name="search-option"
                className="custom-control-input"
                value="area-tecnica"
                checked={areaTecnica !== "" && richiedente !== ""}
                onChange={handleChangeAreaTecnica}
              />
              <label
                className="custom-control-label area-label"
                htmlFor="area-tecnica"
              >
                Area Tecnica
              </label>
            </div>
            <div className="col-sm-8">
              <select
                className="form-control"
                value={areaTecnica}
                onChange={(e) => {
                    setAreaTecnica(e.target.value);
                    setIncludeAreaTecnica(e.target.value !== "");
                  }
                }
              >
                {tecareasLoading ? (
                  <option>Caricamento aree tecniche...</option>
                ) : (
                  <>
                    <option value="">Selezionare l'area tecnica</option>
                    {tecareas.map((tecarea) => (
                      <option key={tecarea.id} value={tecarea.id}>
                        {tecarea.name}
                      </option>
                    ))}
                  </>
                )}
              </select>
            </div>
          </div>

          <div className="form-group row">
            <div className="custom-control custom-checkbox">
              <input
                type="checkbox"
                className="custom-control-input"
                id="include-dates"
                checked={includeDates}
                onChange={(e) => setIncludeDates(!includeDates)}
              />
              <label
                className="custom-control-label data"
                htmlFor="include-dates"
              >
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
                  onClick={() => setQuickDate(30)}
                >
                  ultimo mese
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm mr-1"
                  onClick={() => setQuickDate(90)}
                >
                  ultimo trimestre
                </button>
                <button
                  type="button"
                  className="btn btn-outline-primary btn-sm"
                  onClick={() => setQuickDate(365)}
                >
                  ultimo anno
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
                checked={testo !== "" || testoCheckbox}
                onChange={(e) => {
                  setTestoCheckbox(e.target.checked);
                  if (!e.target.checked && testo !== "") {
                    setTesto("");
                  }
                }}
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
            <button
              type="submit"
              className="btn btn-primary search-button"
              disabled={isButtonDisabled}
            >
              Ricerca
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
export default SearchBox;
