import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './App'
import FoodDetail from './FoodDetail'
import reducer from './reducers'
import './index.css'
import '../semantic/dist/semantic.min.css';
import Order from './Order'
import OrderSuccess from './OrderSuccess'
import OrderError from './OrderError'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'whatwg-fetch'
import { unregister } from './registerServiceWorker';
import CognitoCallback from './Cognito/CognitoCallback'
import CognitoSignout from './Cognito/CognitoSignout'
import StripeCallback from './Stripe/StripeCallback'
import Profile from './Profile'
import ProfileLink from './ProfileLink'
import { StripeProvider } from 'react-stripe-elements'

//import mytest from './test'

unregister();

const store = createStore(reducer)

render(
  <StripeProvider apiKey="pk_test_3i1u1cO6uPgfdBh08rz9MIlN">
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={App} />
          {/* <Route path='/test' component={mytest} /> */}
          <Route path='/foods/:id/orderSuccess' component={OrderSuccess} />
          <Route path='/foods/:id/orderError' component={OrderError} />
          <Route path='/foods/:id/order' component={Order} />
          <Route path='/foods/:id' exact component={FoodDetail} />
          <Route path='/cognitoCallback' exact component={CognitoCallback} />
          <Route path='/cognitoSignout' exact component={CognitoSignout} />
          <Route path='/stripeCallback' exact component={StripeCallback} />
          <Route path='/profile/:userId' exact component={Profile} />
          <Route path='/profilelink' exact component={ProfileLink} />
        </Switch>
      </BrowserRouter>
    </Provider>
  </StripeProvider>,
  document.getElementById('root')
)
