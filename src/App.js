//import React from 'react'
// import Footer from './components/Footer'
// import AddTodo from './containers/AddTodo'
// import VisibleTodoList from './containers/VisibleTodoList'
import React, { Component } from 'react'
import './App.css'
import { Image } from 'semantic-ui-react'
import { MapContainer } from './MapContainer'
import Food from './Food'
import Map from './Map'
import { Constants } from './Constants'


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hoveredFoodItemId: -1
    };
  }

  handleDateChange(date) {
    this.setState({ date: date.toDate() });
  };

  handleTimeChange = (event, data) => {
    this.setState({ time: data.value });
  };

  handleAddressChange(place) {
    console.log(place);
    let mapZoom = Map.defaultProps.zoom;
    if (!mapZoom) {
      mapZoom = 13;
    }
    this.setState({
      address: place,
      mapLocation: place.geometry.location,
      mapZoom: mapZoom
    });
  };

  handleSearch(event, data) {
    console.log(this.state);
  }

  handleFoodItemEnter(itemId) {
    console.log('handleFoodItemEnter id=' + itemId);
    this.setState({
      hoveredFoodItemId: itemId
    });
  }

  handleFoodItemLeave(itemId) {
    console.log('handleFoodItemLeave id=' + itemId);
    this.setState({
      hoveredFoodItemId: -1
    });
  }


  
  render() {
    return (
      <div className='wrap'>

        <div className='head'>
          <div className='head-content'>
            <div className='head-logo'>
              <a href="/">
                <Image style={{ margin: '0 auto' }} height='20px' src='/assets/images/appicon5.png' />
              </a>
              <a href="/" className='link'>
                <div style={{ fontSize: '1.6em', fontWeight: 'bolder', fontFamily: 'Comfortaa', cursive }}>{Constants.AppName}</div>
              </a>
              <div id="content-desktop" style={{ fontSize: '1.1em', fontWeight: 'bold', marginLeft: '2px' }}>
                local. homemade. fresh.
              </div>
            </div>
          </div>
        </div>

        <div className='bodywrap'>
          <div className='center'>
            <Food
              onFoodItemEnter={(itemId) => this.handleFoodItemEnter(itemId)}
              onFoodItemLeave={(itemId) => this.handleFoodItemLeave(itemId)}
            />
          </div>
          <div className='right'>
            <MapContainer
              selectedItemId={this.state.hoveredFoodItemId}
              center={this.state.mapLocation}
              zoom={this.state.mapZoom} />
          </div>
        </div>


      </div>
    )
  }
}

export default App;