import React from 'react'
import { render } from 'react-dom'
import '../semantic/dist/semantic.min.css';
import 'index.css'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from 'App'
import FoodDetail from 'FoodDetail'
import reducer from 'reducers'
import Order from 'Order'
import OrderSuccess from 'OrderSuccess'
import OrderError from 'OrderError'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import 'whatwg-fetch'
import { unregister } from 'registerServiceWorker';
import CognitoCallback from 'Cognito/CognitoCallback'
import CognitoSignout from 'Cognito/CognitoSignout'
import StripeCallback from 'Stripe/StripeCallback'
import ProfileEdit from 'ProfileEdit'
import ProfileView from 'ProfileView'
import ProfileLink from 'ProfileLink'
import { StripeProvider } from 'react-stripe-elements'

//import temp from 'temp'

unregister();

const store = createStore(reducer)

render(
  <StripeProvider apiKey="pk_test_3i1u1cO6uPgfdBh08rz9MIlN">
    <Provider store={store}>
      <BrowserRouter>
        <Switch>
          <Route exact path='/' component={App} />
          {/* <Route path='/temp' component={temp} /> */}
          <Route path='/foods/:id/orderSuccess' component={OrderSuccess} />
          <Route path='/foods/:id/orderError' component={OrderError} />
          <Route path='/foods/:id/order' component={Order} />
          <Route path='/foods/:id' exact component={FoodDetail} />
          <Route path='/cognitoCallback' exact component={CognitoCallback} />
          <Route path='/cognitoSignout' exact component={CognitoSignout} />
          <Route path='/stripeCallback' exact component={StripeCallback} />
          <Route path='/profile/view/:userId' exact component={ProfileView} />
          <Route path='/profile/edit/:userId' exact component={ProfileEdit} />
          <Route path='/profilelink' exact component={ProfileLink} />
        </Switch>
      </BrowserRouter>
    </Provider>
  </StripeProvider>,
  document.getElementById('root')
)
