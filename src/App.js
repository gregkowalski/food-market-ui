//import React from 'react'
// import Footer from 'components/Footer'
// import AddTodo from 'containers/AddTodo'
// import VisibleTodoList from 'containers/VisibleTodoList'
import React, { Component } from 'react'
import './App.css'
import { MapContainer } from './MapContainer'
import Food from './Food'
import Map from './Map'
import AppHeader from './components/AppHeader'

class App extends Component {

    isDebug = false;

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
        if (this.isDebug) {
            console.log('handleFoodItemEnter id=' + itemId);
        }
        this.setState({
            hoveredFoodItemId: itemId
        });
    }

    handleFoodItemLeave(itemId) {
        if (this.isDebug) {
            console.log('handleFoodItemLeave id=' + itemId);
        }
        this.setState({
            hoveredFoodItemId: -1
        });
    }

    render() {
        return (
            <div className='wrap'>

                <AppHeader fixed />

                <div className='bodywrap'>
                    <div className='center'>
                        <Food
                            onFoodItemEnter={(itemId) => this.handleFoodItemEnter(itemId)}
                            onFoodItemLeave={(itemId) => this.handleFoodItemLeave(itemId)}
                        />
                    </div>
                    <div className='app-right'>
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