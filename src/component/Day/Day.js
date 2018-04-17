import React, { Component } from 'react';
import './Day.css';

class Day extends Component {
    constructor(props) {
        super(props)
        console.log(this.props.forecastInterval);   
    }

    render () {
        return(
            <div className="card">
                <ul className="card-content">
                    <p className="card-footer-item">
                        <li><strong>Date/Time: </strong> {this.props.forecastInterval.dt_txt} </li>
                        <li><strong> Temperature: </strong>{this.props.forecastInterval.main.temp} &deg; C </li>
                        <li><strong> Windforce: </strong>{this.props.forecastInterval.wind.speed} &deg; m/s </li>
                        <li><strong> Humidity: </strong>{this.props.forecastInterval.main.humidity} % </li>
                        <li>
                            <img className="" src={`http://openweathermap.org/img/w/${this.props.forecastInterval.weather[0].icon}.png`} title="Title goes here" alt="A weather icon, describing the... weather" />
                            {this.props.forecastInterval.weather[0].description}
                        </li>
                    </p>
                </ul>
            </div>
        )
    }
}

export default Day;

        
          
            
                
                