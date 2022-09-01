import "./css/App.css";
import { useState, useEffect } from "react";
import {
  MenuItem,
  FormControl,
  Select,
  Card,
  CardContent,
} from "@mui/material";
import InfoBox from "./InfoBox";
import Map from "./Map";
import Table from "./Table";
import { sortData } from "./util";
import LineGraph from "./LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState(["USA", "UK", "INDIA"]); //this state is for drop down menu
  const [country, setCountry] = useState("worldwide"); // state keeping track of present value in dropdown menu
  const [countryInfo, setCountryInfo] = useState({}); // present country info for InfoBoxes
  const [tableData, setTableData] = useState([]); // all countries data for table
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]); //lat and lng for map
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]); //for drawing circles
  const [casesType, setCasesType] = useState("cases");

  const onCountryChange = async (e) => {
    const countryCode = e.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode === "worldwide") {
          setMapCenter([34.80746, -40.4796]);
          setMapZoom(3);
        } else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        }
      });
  };

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((res) => res.json())
      .then((data) => setCountryInfo(data));
  }, []);

  useEffect(() => {
    const getCountries = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const allCountries = data.map((country) => {
            return {
              name: country.country,
              value: country.countryInfo.iso2,
            };
          });
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(allCountries);
        })
        .catch((err) => console.log(err));
    };

    getCountries();
  }, []);

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              style={{
                color: "white",
                border: "2px solid white",
                textAlign: "center",
              }}
              variant="outlined"
              onChange={onCountryChange}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country, idx) => {
                return (
                  <MenuItem key={idx} value={country.value}>
                    {country.name}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            active={casesType === "cases"}
            title="Coronavirus Cases"
            type="cases"
            onClick={(e) => setCasesType("cases")}
            cases={countryInfo.todayCases}
            total={countryInfo.cases}
          ></InfoBox>
          <InfoBox
            active={casesType === "recovered"}
            title="Recovered"
            onClick={(e) => setCasesType("recovered")}
            type="recovered"
            cases={countryInfo.todayRecovered}
            total={countryInfo.recovered}
          ></InfoBox>
          <InfoBox
            active={casesType === "deaths"}
            title="Deaths"
            onClick={(e) => setCasesType("deaths")}
            type="deaths"
            cases={countryInfo.todayDeaths}
            total={countryInfo.deaths}
          ></InfoBox>
        </div>
        <Map
          casesType={casesType}
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live Cases By Country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
