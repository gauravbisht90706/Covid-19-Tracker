import {
  Card,
  CardContent,
  FormControl, Menu, MenuItem,
  Select
} from '@material-ui/core';
import React from 'react';
import { useState, useEffect } from 'react';
import './App.css';
import './Table.css';
import Table from './Table';
import InfoBox from './InfoBox';
import Map from './Map';
import { sortData } from './util';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import { prettyPrintStat } from './util';
import numeral from 'numeral';


function App() {

  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCaseType] = useState("cases");
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: 40.4796 });
  // const [mapZoom, setMapZoom] = useState(3);
  const [mapZoom, setMapZoom] = useState(2);

  //useEffect() is used to run a piece of code based on some condition.
  //this code will run only once when the component loads and not again.

  useEffect(
    () => {
      fetch("https://disease.sh/v3/covid-19/all")
        .then((response) => response.json())
        .then((data)=> {
          setCountryInfo(data);
      });
    }, []);

 
  useEffect(
    () => {
      const getCountriesData = async () => {
        await fetch("https://disease.sh/v3/covid-19/countries")
          .then((response) => response.json())
          .then((data) => {
            const countries = data.map((country) => ({
              name: country.country,
              value: country.countryInfo.iso2,
            }
            ));
            
            let sortedData = sortData(data);
            setTableData(sortedData);
            setCountries(countries);
            setMapCountries(data);
       })
      };
      getCountriesData();
    }, []);
  
  console.log(casesType);
  
  const onCountryChange =  async(event) => {
    const countryCode = event.target.value;
    

    const url = countryCode === "worldwide"
      ? "https://disease.sh/v3/covid-19/all"
      : `https://disease.sh/v3/covid-19/countries/${countryCode}`;
    
    fetch(url)
      .then(response => response.json())
      .then((data) => {
        setCountry(countryCode);

        // all the data of specific country is stored 
        setCountryInfo(data);
        // setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        // setMapZoom(4);
        console.log("Country data ", data)

        if (countryCode === "Worldwide") {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(2);
        }

        else {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(3);
        }
      });
  };

  console.log("country Info-->>", countryInfo);
      
        
    return (
      <div className="app">
        
        {/* left side container*/}
        <div className ="app_left">

      
      
      {/*--------------------- start of header section------------------------- */}

      <div className="app_header">
        
      <h1>COVID-19 TRACKER</h1>
      <FormControl className="app_dropdown">
            <Select variant="outlined" onChange = {onCountryChange} value={country}>
              <MenuItem value = "worldwide"><h3 className="dropdownHeading">Worldwide</h3></MenuItem>
          
            {
              countries.map((country, i) => (
                <MenuItem key={i}value = {country.value}>{country.name}</MenuItem>
              ))
}          
        
        </Select>
      
      </FormControl>
        </div>  
                  {/*-----------------------header section ends here-----------------*/}

        {/*-------------------------------Stats in the form of cards---------------*/}
        
        <div className="app_stats">
            <InfoBox
              onClick = {(e)=> setCaseType("cases")}
              title="Corona Virus Cases"
              isRed
              active = {casesType === "cases"}
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={prettyPrintStat(countryInfo.cases)} />
            <InfoBox
              active = {casesType === "recovered"}
              title="Recoverd People"
              onClick={(e) => setCaseType("recovered")}
              cases = {prettyPrintStat(countryInfo.todayRecovered)}
              total={prettyPrintStat(countryInfo.recovered)} />
            <InfoBox
              active={casesType === "deaths"}
              isRed
              title="Deaths"
              onClick = {(e)=> setCaseType("deaths")}
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={prettyPrintStat(countryInfo.deaths)} />
        </div>
          
        {/*Map component starts here*/}

          <Map
          countries={mapCountries}
          casesType={casesType}
          center={mapCenter}
          zoom={mapZoom}
          />
          
          
        </div>
          
        {/*----------------End of left component---------------------*/}

        {/* start of right component*/}

        <div className="app_right">
          <Card>
            <CardContent>
              <h3 className = "tableHeading">Highest number of cases</h3>
               <Table countries = {tableData} />

              <h3 className = "graph_header">Worldwide new {casesType} </h3>

              <LineGraph
                className="app_graph"
                casesType={casesType} />
                
            </CardContent>
          
          </Card>
        
        </div>
      </div>
  );
}

export default App;
