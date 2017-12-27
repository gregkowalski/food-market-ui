import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
// import Food from './Food'
import FoodDetail from './FoodDetail'
import reducer from './reducers'
import './index.css'
import '../semantic/dist/semantic.min.css';
import Order from './Order'
import OrderSuccess from './OrderSuccess'
import OrderError from './OrderError'
import { HashRouter, Switch, Route } from 'react-router-dom'
import FoodEntry from './FoodEntry'
import 'whatwg-fetch'
import { unregister } from './registerServiceWorker';

import mytest from './test'

unregister();

const store = createStore(reducer)


render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/search' component={App} />
        {/* <Route path='/food' component={Food} /> */}
        <Route path='/test' component={mytest} />
        <Route path='/foods/:id/orderSuccess' component={OrderSuccess} />
        <Route path='/foods/:id/orderError' component={OrderError} />
        <Route path='/foods/:id/order' component={Order} />
        <Route path='/foods/:id' exact component={FoodDetail} />
        <Route path='/foodEntry' exact component={FoodEntry} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
