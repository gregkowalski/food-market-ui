import React from 'react'
import { Map, Marker, InfoWindow } from './Map'
// import { Container, Button } from 'semantic-ui-react'
import { Image, Card, Rating, Divider } from 'semantic-ui-react'
// import {GoogleApiWrapper} from 'google-maps-react';
import FoodItems from './data/FoodItems'
import './MapContainer.css'

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
      return '/assets/images/food-icon-selected1.png';
    }
    return '/assets/images/food-icon1.png';
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
        center={this.props.center}
        zoom={this.props.zoom}
      >

        {markers}

        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          onClose={() => this.onInfoWindowClose()}>

          <div>
            <a style={{ cursor: 'pointer' }} target='_blank'
              href={'/foods/' + item.id}>
              <Card style={{ border: 'solid 2px grey', margin: '4px 4px 4px 4px' }}>
                <Card.Content>
                  <Image width='100%' shape='rounded' src={item.image} />
                  <Card.Header className='FoodCardHeader'>
                    <div className='marker-header'>${item.price} · {item.header}</div>
                    <div style={{ clear: 'both' }}></div>
                  </Card.Header>
                  <Card.Meta>
                    <div style={{ display: 'inline-flex'}}>
                      <Rating disabled={true} maxRating={5} rating={item.rating} size='mini'
                        className='marker-rating-stars' />
                      <div className='marker-rating-label'>{item.ratingCount} reviews</div>
                    </div>
                    <div className='marker-ingredients'>Ingredients: {item.meta}</div>
                  </Card.Meta>
                  <Card.Description>
                    <div className='marker-description'>{item.description} </div>

                  </Card.Description>
                </Card.Content>
              </Card>
            </a>
            <Divider hidden />
            {/* <a href={'/foods/' + item.id + '/order'}>
              <Button as='div' fluid color='teal'>Order</Button>
            </a> */}
          </div>



        </InfoWindow>
      </Map>
    )
  }
}

// <Map google={this.props.google} />

// export default GoogleApiWrapper({
//   apiKey: __GAPI_KEY__
// })(MapContainer)