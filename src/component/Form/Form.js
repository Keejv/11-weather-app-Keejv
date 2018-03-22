import React, { Component } from 'react';

class Form extends Component {
  constructor() {
    super();
    this.state = {
      weather: [],
      latitude:0,
      longitude:0,
      posWeather:{}
    }
  }

  onSubmit(e) {
    e.preventDefault();

    const cityname = e.nativeEvent.target.elements[0].value;
    
    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityname}&APPID=7254d050ae7bb47c60b4718eac4b2132
    `)
      .then(res => res.json())
      .then(res => {
        this.setState({
          weather: res.weather,
          temp: res.main.temp,
          wind: res.wind,
          main: res.main,
          sys: res.sys
        }, function() {
          console.log('Hopefully we have some weather', this.state);
        })
      });
      if((this.state.longitude && this.state.latitude) !==0){
        fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${this.state.latitude}&lon=${this.state.longitude}&APPID=5434f1c129e1ac657b10a23c1ac6a1e9`)
                .then(res => res.json())
                .then(res => {
                    this.setState({
                        posWeather: res
                });
            });
      }
  }

  render() {
    return (
      <div>

        <form onSubmit={this.onSubmit.bind(this)}>
          <input type="text" placeholder="Type the city name here" name="city" />
          <button type="submit">Get weather</button>
          <button onClick={this.degree} type="submit">Knapp</button>
        </form>
        { this.state.weather.length > 0 ? 
          <div className="App-weather">
            <img src={`http://openweathermap.org/img/w/${this.state.weather[0].icon}.png`} title="Title goes here" alt="A weather icon, describing the... weather" />
            <p>
              {this.state.weather[0].description}
              <br />
             temp? {this.state.main.temp}
              <br />
              Wind direction {this.state.wind.deg}
              <br />
              Windspeed {this.state.wind.speed}
              <br />
              Sunrise: {this.calculateTime(this.state.sys.sunrise)}
              <br />
              Sunset: {this.calculateTime(this.state.sys.sunset)}
              <br />

            </p>
          </div>
          : <p>No results yet</p>
        }
        {this.state.posWeather ?(
          <div className="App-weather">
          <p>
          {this.state.posWeather.name}
          </p>
          </div>
        ):("")}
      </div>
    );
  }
  calculateTime(time) {
    return new Date(time * 1e3).toISOString().slice(-13, -5);
}
componentDidMount(){
  navigator.geolocation.getCurrentPosition((pos)=>{
    this.setState({
      longitude: pos.coords.longitude.toFixed(5),
      latitude: pos.coords.latitude.toFixed(5),
    })
  });
}
}

export default Form;
