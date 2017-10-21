import React from 'react'
import { Map, Marker, InfoWindow } from './Map'
// import { Link } from 'react-router-dom'
// import { Container, Button } from 'semantic-ui-react'
import { Image, Card, Button, Rating } from 'semantic-ui-react'
// import {GoogleApiWrapper} from 'google-maps-react';
import { FoodItems } from './FoodItems'

// const __GAPI_KEY__ = 'AIzaSyBrqSxDb_BPNifobak3Ho02BuZwJ05RKHM';

export class MapContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      showingInfoWindow: false,
      activeMarker: {},
      selectedPlace: {},
      selectedItemId: props.selectedItemId
    };
  }

  onMarkerClick(props, marker, e) {
    this.setState({
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true,
      selectedItemId: props.id
    });
  }

  onMapClick() {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeMarker: null,
        selectedPlace: {},
        selectedItemId: -1
      });
    }
  }

  onInfoWindowClose() {
    this.setState({
      showingInfoWindow: false,
      activeMarker: null,
      selectedPlace: {},
      selectedItemId: -1
    })
  }

  getMarkerImage(foodItem, selectedItemId) {
    if (foodItem.id === selectedItemId) {
      return '/assets/images/food-icon-selected.png';
    }
    return '/assets/images/food-icon.png';
  }

  getZIndex(foodItem, selectedItemId) {
    return (foodItem.id === selectedItemId) ? 9999 : null;
  }

  render() {
    // const style = {
    //   width: '100vw',
    //   height: '100vh'
    // }

    let item = this.state.selectedPlace;
    let selectedItemId = this.props.selectedItemId;
    if (selectedItemId < 0) {
      selectedItemId = this.state.selectedItemId;
    }

    const markers = FoodItems.map((foodItem) =>
      <Marker
        id={foodItem.id}
        key={foodItem.id}
        onClick={(props, marker, e) => this.onMarkerClick(props, marker, e)}
        header={foodItem.header}
        icon={this.getMarkerImage(foodItem, selectedItemId)}
        zIndex={this.getZIndex(foodItem, selectedItemId)}
        image={foodItem.image}
        imageSmall={foodItem.imageSmall}
        rating={foodItem.rating}
        ratingCount={foodItem.ratingCount}
        price={foodItem.price}
        availability={foodItem.availability}
        meta={foodItem.meta}
        description={foodItem.description}
        position={foodItem.position} />
    );

    return (
      <Map
        google={window.google}
        zoomControl={true}
        zoomControlOptions={{ position: window.google.maps.ControlPosition.LEFT_TOP }}
        mapTypeControl={false}
        scaleControl={true}
        streetViewControl={false}
        rotateControl={false}
        fullscreenControl={false}
        clickableIcons={false}
        scrollwheel={true}
        centerAroundCurrentLocation={true}
        gestureHandling='greedy'
        onClick={() => this.onMapClick()}
        center={this.props.center}>

        {markers}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={() => this.onInfoWindowClose()}>

          <a style={{ cursor: 'pointer' }} target='_blank'
            href={'https://mojokitchn.wixsite.com/dumplings?src=' + item.header}>
            <Card>
              <Card.Content>
                <Image width='100%' shape='rounded' src={item.imageSmall} />
                <Card.Header className='FoodCardHeader'>
                  <div style={{ float: 'left' }}>{item.header}</div>
                  <div style={{ float: 'right' }}>${item.price}</div>
                  <div style={{ clear: 'both' }}></div>
                </Card.Header>
                <Card.Meta>
                  <div style={{ display: 'flex', marginTop: '2px', marginBottom: '10px' }}>
                    <Rating disabled={true} maxRating={5} rating={item.rating} size='large'
                      style={{ marginTop: '-1px', marginLeft: '-2px' }} />
                    <div>{item.ratingCount}</div>
                  </div>
                  <div><strong>Availability:</strong> {item.availability}</div>
                  <div><strong>Ingredients:</strong> {item.meta}</div>
                </Card.Meta>
                <Card.Description>
                  {item.description}
                </Card.Description>
              </Card.Content>
              <Card.Content extra>
                <Button basic fluid color='black'>Order</Button>
              </Card.Content>
            </Card>
          </a>

        </InfoWindow>
      </Map>
    )
  }
}

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)