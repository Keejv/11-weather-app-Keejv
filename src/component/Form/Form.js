import React, { Component } from "react";

import Day from "../Day/Day";
import "./Form.css";

class Form extends Component {
  constructor() {
    super();
    this.state = {
      weather: {},
      latitude: 0,
      longitude: 0,
      posWeather: {
        main: {},
        temp: {},
        wind: {},
        weather: [],
        sys: {},
        sunrise: {},
        sunset: {},
        description: {},
        id: {}
      },
      forecast: [],
      selectedOption: "Celcius",
      newTemp: "",
      isToggleOn: true
    };

    this.success = this.success.bind(this);
    this.error = this.error.bind(this);

    this.handleOptionChange = this.handleOptionChange.bind(this);
  }

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(this.success, this.error);
  }

  success(pos) {
    this.setState(
      {
        longitude: pos.coords.longitude,
        latitude: pos.coords.latitude
      },
      function() {
        this.getWeather();
      }
    );
  }

  error() {
    alert(
      "Can not get your current location, you will be placed in stockholm. Dont worry about it!"
    );

    this.setState(
      {
        longitude: 18.0685808000000063,
        latitude: 59.32932349999999
      },
      function() {
        this.getWeather();
      }
    );
  }

  handleOptionChange() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }

  getWeather() {
    fetch(
      `http://api.openweathermap.org/data/2.5/weather?lat=${
        this.state.latitude
      }&lon=${
        this.state.longitude
      }&APPID=5434f1c129e1ac657b10a23c1ac6a1e9&units=metric`
    )
      .then(res => res.json())
      .then(res => {
        this.setState({
          posWeather: res
        });
      });
  }

  //F = 9/5 (K - 273) + 32
  calculateTime(time) {
    if (time !== undefined) {
      return new Date(time * 1e3).toISOString().slice(-13, -5);
    }
  }

  onSubmit(e) {
    e.preventDefault();
    const cityname = e.nativeEvent.target.elements[0].value;

    if (cityname) {
      fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&APPID=7254d050ae7bb47c60b4718eac4b2132&units=metric`
      )
        .then(function(response) {
          if (!response.ok) {
              alert('Something went wrong, make sure the city name is correct');
          }
          return response;
        })
        .then(res => res.json())
        .then(res => {
          this.setState({
            posWeather: {
              name : res.city.name,
              main: res.list[0].main,
              wind: res.list[0].wind,
              weather: res.list[0].weather,
              sys: {}
            },
            forecast: res.list
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
  }

  render() {
    return (
      <div>
        <form onSubmit={this.onSubmit.bind(this)}>
          <input
            type="text"
            placeholder="Type the city name here"
            name="city"
          />
          <button type="submit">Get weather</button>
        </form>

        <div className="form-group ">
          <button onClick={this.handleOptionChange} type="submit">
            {this.state.isToggleOn ? "Fahrenheit" : "Celcius"}
          </button>
        </div>
        {this.state.posWeather ? (
          <div className="App-weather">
            <ul>
              <li>
                <ul>
                  <li>
                    <strong>My Location: </strong>
                    {this.state.posWeather.name
                      ? this.state.posWeather.name
                      : "Retreiving your position"}
                  </li>
                  <li>
                    <strong>Temperature: </strong>
                    {this.state.isToggleOn
                      ? this.state.posWeather.main.temp
                      : (this.state.posWeather.main.temp * 9 / 5 + 32).toFixed(
                          2
                        )}
                    {this.state.isToggleOn ? (
                      <span>&deg;C</span>
                    ) : (
                      <span>&deg;F</span>
                    )}
                  </li>
                  <li>
                    <strong>Windspeed: </strong>
                    {this.state.posWeather.wind.speed} m/s
                  </li>
                  <li>
                    <strong>Humidity: </strong>
                    {this.state.posWeather.main.humidity} %
                  </li>
                  { this.state.posWeather.sys.sunrise ?
                  (<li>
                      <strong>Sunrise: </strong>
                      {this.calculateTime(this.state.posWeather.sys.sunrise)}
                  </li>) : ''
                  }
                  { this.state.posWeather.sys.sunrise ?
                  (<li>
                    <strong>Sunset: </strong>
                    {this.calculateTime(this.state.posWeather.sys.sunset)}
                  </li>) : ''
                  }
                </ul>
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}

        {this.state.forecast && this.state.forecast.length > 0 ? (
          <div>
            {this.state.forecast.map((forecastInterval, Index) => {
              return <Day key={Index} forecastInterval={forecastInterval} />;
            })}
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}

export default Form;
