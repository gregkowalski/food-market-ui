//import React from 'react'
// import Footer from './components/Footer'
// import AddTodo from './containers/AddTodo'
// import VisibleTodoList from './containers/VisibleTodoList'
import React, { Component } from 'react'
import './App.css'
import { Button, Dropdown, Grid } from 'semantic-ui-react'
import { SingleDatePicker } from 'react-dates';
import 'react-dates/lib/css/_datepicker.css';
import Autocomplete from 'react-google-autocomplete';
import { Route } from 'react-router-dom'
import { MapContainer } from './MapContainer'
import Food from './Food'
import Map from './Map'

function pad(num, size) {
  var s = num + "";
  while (s.length < size) s = "0" + s;
  return s;
}

let times = [];
for (let hour = 6, minute = 0; hour < 24;) {
  let am_pm = hour < 12 ? "am" : "pm";
  let val = {
    key: times.length,
    text: (hour / 12 >= 1 && hour > 12 ? hour - 12 : hour) + ':' + pad(minute, 2) + ' ' + am_pm,
    value: hour + ':' + pad(minute, 2)
  };

  minute += 30;
  if (minute >= 60) {
    minute = 0;
    hour++;
  }

  times.push(val);
}

class SearchButton extends Component {
  render() {
    return (
      <Route render={({ history }) => (
        <Button
          basic
          color={this.props.color}
          className={this.props.className}
          onClick={(e) => {
            this.props.onClick(e);
            if (this.props.linkTo) {
              history.push(this.props.linkTo);
            }
          }}
        >
          {this.props.text}
        </Button>
      )}
      />
    )
  }
}

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
          <Grid stackable>

            <Grid.Row columns={5} verticalAlign='bottom'>
              <Grid.Column>
                {/* <Input fluid placeholder='Street Address...' onChange={this.handleAddressChange} /> */}
                <div className="AutocompleteBox ui input">
                  <Autocomplete className="AutocompleteBox"
                    onPlaceSelected={(place) => {
                      this.handleAddressChange(place);
                    }}
                    types={['address']}
                  //componentRestrictions={{ country: "ru" }}
                  />
                </div>
              </Grid.Column>
              <Grid.Column>
                <SingleDatePicker
                  date={this.state.day} // momentPropTypes.momentObj or null
                  onDateChange={day => {
                    this.setState({ day });
                    this.handleDateChange(day);
                  }} // PropTypes.func.isRequired
                  focused={this.state.focused} // PropTypes.bool
                  onFocusChange={({ focused }) => this.setState({ focused })} // PropTypes.func.isRequired
                  numberOfMonths={1}
                  placeholder="Date..."
                  displayFormat={() =>
                    //moment.localeData().longDateFormat('LL')
                    'MMMM DD, YYYY'
                  }
                />
                {/* <DateRangePicker
                startDate={this.state.startDate} // momentPropTypes.momentObj or null,
                endDate={this.state.endDate} // momentPropTypes.momentObj or null,
                onDatesChange={({ startDate, endDate }) => this.setState({ startDate, endDate })} // PropTypes.func.isRequired,
                focusedInput={this.state.focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                onFocusChange={focusedInput => this.setState({ focusedInput })} // PropTypes.func.isRequired,
              /> */}
              </Grid.Column>
              <Grid.Column>
                <Dropdown className="TimePicker"
                  placeholder='Time...'
                  selection
                  options={times}
                  onChange={this.handleTimeChange} />
              </Grid.Column>
              <Grid.Column>
                <SearchButton
                  color="black"
                  className="SearchButton"
                  text="Search"
                  linkTo="/food"
                  onClick={(e) => this.handleSearch(e)} />
              </Grid.Column>
            </Grid.Row>

          </Grid>
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