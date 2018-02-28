import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import { StripeProvider } from 'react-stripe-elements'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import 'whatwg-fetch'
import './semantic/semantic.min.css'
import FoodDetail from './views/FoodDetail'
import Order from './views/Order'
import OrderSuccess from './views/OrderSuccess'
import OrderError from './views/OrderError'
import CognitoCallback from './services/Cognito/CognitoCallback'
import CognitoSignout from './services/Cognito/CognitoSignout'
import StripeCallback from './services/Stripe/StripeCallback'
import ProfileEdit from './views/ProfileEdit'
import ProfileView from './views/ProfileView'
import ProfileLink from './views/ProfileLink'
import NotFoundPage from './views/NotFoundPage'
import Login from './views/Login'
import Pricing from './views/Pricing'
// import Map2 from './views/map2'
import MobileSearch from './views/MobileSearch'
import Home from './views/Home'

import configureStore from './store/configureStore'
import Config from './Config'
import { unregister } from './registerServiceWorker'
//import temp from 'temp'

unregister();

const store = configureStore({ includeLogger: true });

render(
    <StripeProvider apiKey={Config.Stripe.PublicApiKey}>
        <Provider store={store}>
            <BrowserRouter>
                <Switch>
                    <Route exact path='/' component={Home} />
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
                    <Route path='/login' exact component={Login} />
                    <Route path='/pricing' exact component={Pricing} />
                    {/* <Route path='/map2' exact component={Map2} /> */}
                    <Route path='/mobilesearch' exact component={MobileSearch} />
                    <Route component={NotFoundPage} />
                </Switch>
            </BrowserRouter>
        </Provider>
    </StripeProvider>,
    document.getElementById('root')
)
