import React, { Component } from 'react';

import Day from '../Day/Day';
import './Form.css'

class Form extends Component {
  constructor() {
    super();
    this.state = {
      weather: {},
      latitude:0,
      longitude:0,
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
      
    }
    this.success = this.success.bind(this);
    this.error = this.error.bind(this);
  }

  componentDidMount(){
    navigator.geolocation.getCurrentPosition(this.success, this.error);
    }  
    
  success(pos) {
    this.setState({
      longitude: pos.coords.longitude,
      latitude: pos.coords.latitude
    })
    this.getWeather();
  }

  error() {
    alert('Can not get your current location, you will be placed in stockholm. Dont worry about it!')
    this.setState({
      longitude: 18.0685808000000063,
      latitude: 59.32932349999999
    })
    this.getWeather();
  }
  
  
  handleOptionChange() {
    this.setState(prevState => ({
      isToggleOn: !prevState.isToggleOn
    }));
  }
  
  getWeather() {
    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=5434f1c129e1ac657b10a23c1ac6a1e9&units=metric`)
    .then(res => res.json())
    .then(res => {
      this.setState({
        posWeather: res
      }, function() {
        console.log(res);
      })
    });
  }
  
  //F = 9/5 (K - 273) + 32
  calculateTime(time) {
    if(time !== undefined) {
      return new Date(time * 1e3).toISOString().slice(-13, -5);
    }
  }
  
  
  onSubmit(e) {
    e.preventDefault();
    
    const cityname = e.nativeEvent.target.elements[0].value;
    
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&APPID=7254d050ae7bb47c60b4718eac4b2132&units=metric`)
    .then(res => res.json())
    .then(res => {
      this.setState({
        forecast: res.list,
      }, function() {
        console.log('Hopefully we have some weather', res);
      })
    });
  }
  
  
  render() {
    
    return (
      <div>

        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" placeholder="Type the city name here" name="city" />
          <button type="submit">Get weather</button>

        </form>
          
        <div className="form-group ">
                <button onClick={this.handleOptionChange.bind(this)} type="submit">{this.state.isToggleOn ? 'Fahrenheit' : 'Celcius'}</button>
          </div>
          {this.state.posWeather ?(
            <div className="App-weather">
            <ul>
            <p>
            <li><strong>My Location: </strong>{this.state.posWeather.name}</li>

            <li><strong>Temperature: </strong>{this.state.posWeather.main.temp} &deg;C</li>
            <li><strong>Windspeed: </strong>{this.state.posWeather.wind.speed} m/s</li>
            <li><strong>Humidity: </strong>{this.state.posWeather.main.humidity} %</li>
            <li><strong>Sunrise: </strong>{this.calculateTime(this.state.posWeather.sys.sunrise)}</li>
            <li><strong>Sunset: </strong>{this.calculateTime(this.state.posWeather.sys.sunset)}</li>
            
            </p>
            </ul>
            </div>
          ):("")}
        
        { this.state.forecast && this.state.forecast.length > 0 ?
        <div>
          
          { this.state.forecast.map((forecastInterval, Index) => {
            return <Day key={Index} forecastInterval={forecastInterval} />
          })
        }
        </div>
        : ''
      }
      </div>
    );
  }
}

export default Form;
