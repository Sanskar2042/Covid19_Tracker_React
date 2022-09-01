import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    hex: "#0047AB",
    multiplier: 100,
  },
  recovered: {
    hex: "#7dd71d",
    multiplier: 150,
  },
  deaths: {
    hex: "#fb4443",
    multiplier: 200,
  },
};

export const sortData = (data) => {
  const sortedData = [...data];

  sortedData.sort((a, b) => {
    return b.cases > a.cases;
  });

  return sortedData;
};

//draw circle on map along with interactive tooltip
export const showDataOnMap = (data, casesType = "cases") => {
  return data.map((country) => {
    return (
      <Circle
        center={[country.countryInfo.lat, country.countryInfo.long]}
        fillOpacity={0.4}
        pathOptions={{
          color: casesTypeColors[casesType].hex,
          fillColor: casesTypeColors[casesType].hex,
        }}
        radius={
          Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
        }
      >
        <Popup>
          <div className="popup">
            <div
              className="popup__flag"
              style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
            ></div>
            <div className="popup__name">{country.country}</div>
            <div className="popup__cases">
              Cases : {numeral(country.cases).format("0,0")}
            </div>
            <div className="popup__recovered">
              Recovered : {numeral(country.recovered).format("0,0")}
            </div>
            <div className="popup__deaths">
              Deaths : {numeral(country.deaths).format("0,0")}
            </div>
          </div>
        </Popup>
      </Circle>
    );
  });
};
