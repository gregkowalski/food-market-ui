import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import Food from './Food'
import FoodDetail from './FoodDetail'
import reducer from './reducers'
import './index.css'
import '../semantic/dist/semantic.min.css';
import { HashRouter, Switch, Route } from 'react-router-dom'

import mytest from './test'

const store = createStore(reducer)

render(
  <Provider store={store}>
    <HashRouter>
      <Switch>
        <Route exact path='/' component={App} />
        <Route path='/search' component={App} />
        <Route path='/food' component={Food} />
        <Route path='/test' component={mytest} />
        <Route path='/foods/:id' component={FoodDetail} />
      </Switch>
    </HashRouter>
  </Provider>,
  document.getElementById('root')
)
