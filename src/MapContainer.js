import React from 'react'
import { Image, Card, Rating, Divider } from 'semantic-ui-react'
import './MapContainer.css'
import { Map, Marker, InfoWindow } from './Map'
// import FoodItems from './data/FoodItems'
import PriceCalc from './PriceCalc'
import ApiClient from './Api/ApiClient'

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
    this.foods = [];
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
    if (foodItem.food_id === selectedItemId) {
      return '/assets/images/food-icon-selected1.png';
    }
    return '/assets/images/food-icon1.png';
  }

  getZIndex(foodItem, selectedItemId) {
    return (foodItem.food_id === selectedItemId) ? 9999 : null;
  }

  componentWillMount() {
    var self = this;
    let apiClient = new ApiClient();
    apiClient.getFoods()
        .then(response => {
            // todo: this is gonna be done in the API
            // todo: fix the typo for long_description
            // todo: rating and ratingCount
            var foodsDTO = [];
            response.data.forEach(foodDAO => {
                let food = {};
                food.title = Object.keys(foodDAO.title).map(k => foodDAO.title[k])[0];
                food.unit = Object.keys(foodDAO.unit).map(k => foodDAO.unit[k])[0];
                food.feed = Object.keys(foodDAO.feed).map(k => foodDAO.feed[k])[0];
                food.pickup = Object.keys(foodDAO.pickup).map(k => foodDAO.pickup[k])[0];
                food.delivery = Object.keys(foodDAO.delivery).map(k => foodDAO.delivery[k])[0];
                food.food_id = Object.keys(foodDAO.food_id).map(k => foodDAO.food_id[k])[0];
                food.user_id = Object.keys(foodDAO.user_id).map(k => foodDAO.user_id[k])[0];
                food.imageUrls = Object.keys(foodDAO.imageUrls).map(k => foodDAO.imageUrls[k])[0];
                food.ingredients = Object.keys(foodDAO.ingredients).map(k => foodDAO.ingredients[k])[0];
                food.features = Object.keys(foodDAO.features).map(k => foodDAO.features[k])[0];
                food.states = Object.keys(foodDAO.states).map(k => foodDAO.states[k])[0];
                food.allergies = Object.keys(foodDAO.allergies).map(k => foodDAO.allergies[k])[0];
                food.short_description = Object.keys(foodDAO.short_description).map(k => foodDAO.short_description[k])[0];
                food.long_desciption = Object.keys(foodDAO.long_desciption).map(k => foodDAO.long_desciption[k])[0];
                food.price = Object.keys(foodDAO.price).map(k => foodDAO.price[k])[0];
                food.price_currency = Object.keys(foodDAO.price_currency).map(k => foodDAO.price_currency[k])[0];

                food.rating = 5;
                food.ratingCount = 3;
                food.position = { lat: 49.284982, lng: -123.130252 };

                foodsDTO.push(food);
            });

            self.foods = foodsDTO;
        })
        .catch(err => {
            console.error(err);
        });
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

    const markers = this.foods.map((foodItem) =>
      <Marker
        id={foodItem.food_id}
        key={foodItem.food_id}
        onClick={(props, marker, e) => this.onMarkerClick(props, marker, e)}
        header={foodItem.title}
        icon={this.getMarkerImage(foodItem, selectedItemId)}
        zIndex={this.getZIndex(foodItem, selectedItemId)}
        image={foodItem.imageUrls[0]}
        rating={foodItem.rating}
        ratingCount={foodItem.ratingCount}
        price={foodItem.price}
        meta={foodItem.title}
        description={foodItem.short_description}
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
                    <div className='marker-header'>${PriceCalc.getPrice(item.price)} · {item.header}</div>
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